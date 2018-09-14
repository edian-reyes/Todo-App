module.exports = `
    type Todo {
        id: ID!
        text: String
        complete: Boolean
        createdAt: String
    }

    type SuccessPayload {
        success: Boolean
        message: String
    }

    type Query {
        getAllTodos: [Todo!]!
    }

    type Mutation {
        createTodo(text: String): Todo
        toggleComplete(id: ID!, complete: Boolean): Todo
        deleteTodo(id: ID!): SuccessPayload
    }
`;
