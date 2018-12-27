const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');

const { hasPermission } = require('../utils');
const { sendPasswordResetEmail } = require('../mail');

const Mutations = {
  createItem(parent, { data }, ctx, info) {
    const { userId } = ctx.request;
    if (!userId) {
      throw new Error('You must be looged in to do that!');
    }
    return ctx.db.mutation.createItem(
      {
        data: {
          ...data,
          user: { connect: { id: userId } },
        },
      },
      info
    );
  },

  updateItem(parent, { data, id }, ctx, info) {
    return ctx.db.mutation.updateItem({ data, where: { id } }, info);
  },

  async deleteItem(parent, { id }, ctx, info) {
    const where = { id };
    // const item = await ctx.db.item({ where });
    // TODO: check permissions
    return ctx.db.mutation.deleteItem({ where }, info);
  },

  async signup(parent, args, ctx, info) {
    const data = {
      email: args.email.toLowerCase(),
      password: await bcrypt.hash(args.password, 10),
      name: args.name,
      permissions: { set: ['USER'] },
    };

    const user = await ctx.db.mutation.createUser({ data }, info);

    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
    });

    return user;
  },

  async signin(parent, { email, password }, ctx, info) {
    const user = await ctx.db.query.user({ where: { email } });
    if (!user) {
      throw new Error(`No user found for email ${email}!`);
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new Error('Invalid password!');
    }

    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
    });

    return user;
  },

  signout(parent, args, ctx, info) {
    ctx.response.clearCookie('token');
    return { message: 'Good Bye!' };
  },

  async requestReset(parent, { email }, ctx, info) {
    const user = await ctx.db.query.user({ where: { email } });
    if (!user) {
      throw new Error(`No user found for email ${email}!`);
    }

    const resetToken = randomBytes(20).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000;

    await ctx.db.mutation.updateUser({
      where: { email },
      data: { resetToken, resetTokenExpiry },
    });

    await sendPasswordResetEmail(email, resetToken);

    return {
      message: `Reset password link is sent to ${email}!`,
    };
  },

  async resetPassword(parent, args, ctx, info) {
    const { resetToken, password, confirmPassword } = args;
    // 1. check if passwords match
    if (password !== confirmPassword) {
      throw new Error('Passwords do not match!');
    }
    // 2. check if token is legit
    const [user] = await ctx.db.query.users({
      where: {
        resetToken,
        resetTokenExpiry_gte: Date.now(),
      },
      first: 1,
    });
    if (!user) {
      throw new Error('This reset token is either invalid or expired!');
    }
    console.log(user.resetTokenExpiry, Date.now());
    // 3. update password and delete resetToken
    const updatedUser = await ctx.db.mutation.updateUser({
      where: { id: user.id },
      data: {
        password: await bcrypt.hash(password, 10),
        resetToken: null,
        resetTokenExpiry: null,
      },
    });
    // 4. create and save JWT
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
    });
    // 5. return updatedUser
    return updatedUser;
  },

  updatePermissions(parent, { userId, permissions }, ctx, info) {
    if (!ctx.request.user) {
      throw new Error('You must be logged in!');
    }
    hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE']);
    return ctx.db.mutation.updateUser(
      {
        where: { id: userId },
        data: { permissions: { set: permissions } },
      },
      info
    );
  },

  async addToCart(parent, { id }, ctx, info) {
    // check if user is logged in
    if (!ctx.request.user) {
      throw new Error('You must be logged in to do that!');
    }
    // check if selected item is already in their cart
    const [cartItem] = await ctx.db.query.cartItems({
      where: {
        item: { id },
        user: { id: ctx.request.user.id },
      },
    });
    if (cartItem) {
      // if it IS then just update the quantity
      return ctx.db.mutation.updateCartItem(
        {
          where: { id: cartItem.id },
          data: { quantity: cartItem.quantity + 1 },
        },
        info
      );
    } else {
      // if it's NOT then create new fresh&shiny cart item
      return ctx.db.mutation.createCartItem(
        {
          data: {
            quantity: 1,
            item: { connect: { id } },
            user: { connect: { id: ctx.request.user.id } },
          },
        },
        info
      );
    }
  },

  async removeFromCart(parent, { id }, ctx, info) {
    if (!ctx.request.user) {
      throw new Error('You must be logged in to do that!');
    }
    const [cartItem] = await ctx.db.query.cartItems(
      { where: { id, user: { id: ctx.request.user.id } } },
      '{ id user { id } }'
    );
    if (!cartItem) {
      throw new Error('No CartItem found!');
    }
    return ctx.db.mutation.deleteCartItem({ where: { id } }, info);
  },
};

module.exports = Mutations;
