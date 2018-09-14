module.exports = {
  Query: {
    getAllTodos: async (parent, args, ctx, info) => {
      const todos = await ctx.Todo.find({});
      return todos.reverse();
    }
  },
  Mutation: {
    createTodo: async (parent, args, ctx, info) => {
      try {
        const todo = new ctx.Todo({ text: args.text });
        const savedTodo = await todo.save();
        return savedTodo;
      } catch (error) {
        console.log("createTodo", error);
        return null;
      }
    },
    toggleComplete: async (parent, args, ctx, info) => {
      const filter = { _id: args.id };
      const update = { $set: { complete: args.complete } };
      await ctx.Todo.findOneAndUpdate(filter, update);
      return await ctx.Todo.findById(args.id);
    },
    deleteTodo: async (parent, args, ctx, info) => {
      try {
        await ctx.Todo.findByIdAndRemove(args.id);
        return {
          success: true,
          message: "Todo Deleted Successfully."
        };
      } catch (error) {
        console.log(error);

        return {
          success: false,
          message: "Error Deleting Todo."
        };
      }
    }
  }
};
