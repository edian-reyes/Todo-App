import { gql } from "apollo-boost";

export const DELETE_TODO = gql`
  mutation($todoId: ID!) {
    deleteTodo(id: $todoId) {
      success
      message
    }
  }
`;
