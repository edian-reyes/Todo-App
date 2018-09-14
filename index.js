require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./typeDefs/todo");
const resolvers = require("./resolvers/todo");
require("./models/todo");
const Todo = mongoose.model("todo");
const models = { Todo };

const app = express();

// put together are the schema
const server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
  context: models
});

server.applyMiddleware({ app });

app.use(bodyParser.json());
app.use(cors("*", { origin: "http://localhost/3000" }));

app.listen(3001, url => {
  console.log(`Server listening to ${url}`);
});
