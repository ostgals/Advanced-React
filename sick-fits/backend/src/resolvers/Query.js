const Query = {
  items(parent, args, ctx, info) {
    return ctx.db.query.items();
  },

  item(parent, { id }, ctx, info) {
    return ctx.db.query.item({ where: { id } });
  },
};

module.exports = Query;
