const Mutations = {
  createItem(parent, args, ctx, info) {
    // TODO: check if user is looged in
    return ctx.db.mutation.createItem({
      data: { ...args.data },
    });
  },
};

module.exports = Mutations;
