import React from "react";
import ReactDom from "react-dom";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import Root from "./Root";

const client = new ApolloClient({
  uri: "http://localhost:3001/graphql"
});

const root = document.querySelector("#root");

ReactDom.render(
  <ApolloProvider client={client}>
    <Root />
  </ApolloProvider>,
  root
);
