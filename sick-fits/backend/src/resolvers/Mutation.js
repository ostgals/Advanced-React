const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');

const Mutations = {
  createItem(parent, args, ctx, info) {
    // TODO: check if user is looged in
    return ctx.db.mutation.createItem(
      {
        data: { ...args.data },
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
    console.log(JSON.stringify(user));
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
        resetTokenExpiry_gte: Date.now() - 3600000,
      },
      first: 1,
    });
    if (!user) {
      throw new Error('This reset token is either invalid or expired!');
    }
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
};

module.exports = Mutations;
