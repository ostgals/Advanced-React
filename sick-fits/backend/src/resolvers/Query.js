const { forwardTo } = require('prisma-binding');

const Query = {
  items: forwardTo('db'),

  item(parent, { id }, ctx, info) {
    return ctx.db.query.item({ where: { id } });
  },

  itemsConnection: forwardTo('db'),

  me(parent, args, ctx, info) {
    const { userId } = ctx.request;
    if (!userId) {
      return null;
    }
    return ctx.db.query.user({ where: { id: userId } }, info);
  },
};

module.exports = Query;
