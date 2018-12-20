const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
};

module.exports = Mutations;
