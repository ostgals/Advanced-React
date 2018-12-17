const Query = {
  items(parent, args, ctx, info) {
    return ctx.db.query.items();
  },
};

module.exports = Query;
