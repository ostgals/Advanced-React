const { forwardTo } = require('prisma-binding');

const Query = {
  items: forwardTo('db'),

  item(parent, { id }, ctx, info) {
    return ctx.db.query.item({ where: { id } });
  },

  itemsConnection: forwardTo('db'),
};

module.exports = Query;
