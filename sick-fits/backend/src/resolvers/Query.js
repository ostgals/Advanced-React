const { forwardTo } = require('prisma-binding');
const { hasPermission } = require('../utils');

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

  async users(parent, args, ctx, info) {
    const { user } = ctx.request;
    if (!user) {
      throw new Error('You must be logged in!');
    }
    hasPermission(user, ['ADMIN', 'PERMISSIONUPDATE']);
    return ctx.db.query.users({}, info);
  },
};

module.exports = Query;
