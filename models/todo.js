const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.connect(
  "",
  {
    useNewUrlParser: true
  }
);

let db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  console.log("Connected to MLab");
});

const todoSchema = new Schema({
  text: String,
  complete: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: new Date()
  }
});

const Todo = mongoose.model("todo", todoSchema);
// const todo = new Todo({ text: "Do some laundy" }).save();
