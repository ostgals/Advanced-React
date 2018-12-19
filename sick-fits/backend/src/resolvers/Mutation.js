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
};

module.exports = Mutations;
