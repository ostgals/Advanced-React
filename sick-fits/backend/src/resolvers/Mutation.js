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
};

module.exports = Mutations;
