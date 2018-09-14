import React, { Component } from "react";
import { Query, Mutation } from "react-apollo";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import AddIcon from "@material-ui/icons/Add";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import { gql } from "apollo-boost";
import { DELETE_TODO } from "./mutations/deleteTodo";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions
} from "@material-ui/core";

const GET_TODOS = gql`
  query {
    getAllTodos {
      id
      text
      complete
      createdAt
    }
  }
`;

const ADD_TODO = gql`
  mutation($text: String) {
    createTodo(text: $text) {
      id
      text
      complete
      createdAt
    }
  }
`;

const TOGGLE_COMPLETE = gql`
  mutation($todoId: ID!, $complete: Boolean) {
    toggleComplete(id: $todoId, complete: $complete) {
      id
      text
      complete
      createdAt
    }
  }
`;

const styles = theme => ({
  root: {
    height: "90vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  card: {
    width: "50vw",
    height: "75vh",
    flexDirection: "column",
    display: "flex",
    alignItems: "center",
    overflowY: "auto",
    justifyContent: "space-around"
  },
  list: {
    height: "50vh",
    width: "40vw",
    overflowY: "auto",
    border: "1px solid grey"
  },
  fab: {
    position: "fixed",
    right: theme.spacing.unit * 2,
    bottom: theme.spacing.unit * 2
  },
  dialog: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center"
  },
  dialogContent: {
    width: "35vw"
  }
});
class Root extends Component {
  constructor() {
    super();

    this.state = {
      open: false,
      text: ""
    };
  }

  onClose = () => this.setState({ open: false });

  handleFab = () => this.setState({ open: true });

  handleChange = e => this.setState({ text: e.target.value });

  render() {
    const { classes } = this.props;
    return [
      <div className={classes.root} key="main">
        <Query query={GET_TODOS}>
          {({ loading, error, data }) => {
            if (loading) return <div>Loading...</div>;
            if (error) return <div>Error: {error.message}</div>;

            return (
              <Card className={classes.card}>
                <CardHeader title="Todo List" />
                <List className={classes.list}>
                  {data.getAllTodos.map(todo => (
                    <ListItem key={todo.id} dense>
                      <Mutation mutation={TOGGLE_COMPLETE}>
                        {(toggleComplete, { loading, error }) => (
                          <Checkbox
                            checked={todo.complete}
                            tabIndex={-1}
                            onChange={(event, checked) =>
                              toggleComplete({
                                variables: {
                                  todoId: todo.id,
                                  complete: checked
                                }
                              })
                            }
                          />
                        )}
                      </Mutation>
                      <ListItemText
                        primary={todo.text}
                        secondary={
                          todo.complete
                            ? "Todo Completed"
                            : "Todo Not Completed"
                        }
                      />
                      <Mutation
                        mutation={DELETE_TODO}
                        refetchQueries={[{ query: GET_TODOS }]}
                      >
                        {(deleteTodo, { loading, error }) => (
                          <ListItemSecondaryAction>
                            <IconButton
                              disabled={!todo.complete}
                              onClick={() => {
                                deleteTodo({
                                  variables: {
                                    todoId: todo.id
                                  }
                                });
                              }}
                            >
                              <DeleteIcon color="error" />
                            </IconButton>
                          </ListItemSecondaryAction>
                        )}
                      </Mutation>
                    </ListItem>
                  ))}
                </List>
                <CardActions />
              </Card>
            );
          }}
        </Query>
        <Button
          variant="fab"
          className={classes.fab}
          color="primary"
          onClick={this.handleFab}
        >
          <AddIcon />
        </Button>
      </div>,
      <Mutation
        mutation={ADD_TODO}
        key="dialog"
        update={(cache, { data: { createTodo } }) => {
          const { getAllTodos } = cache.readQuery({ query: GET_TODOS });
          cache.writeQuery({
            query: GET_TODOS,
            data: { getAllTodos: [createTodo, ...getAllTodos] }
          });
        }}
      >
        {(createTodo, { loading, error }) => (
          <Dialog
            open={this.state.open}
            onClose={this.onClose}
            className={classes.dialog}
          >
            <DialogTitle>Create New Todo</DialogTitle>
            <DialogContent className={classes.dialogContent}>
              <TextField
                onChange={this.handleChange}
                value={this.state.text}
                placeholder="Enter Todo Text..."
                label={error ? "Error creating Todo." : "Todo Text"}
                error={error}
                fullWidth
              />
              <DialogActions>
                <Button
                  variant="raised"
                  color="primary"
                  disabled={!this.state.text}
                  onClick={() => {
                    createTodo({
                      variables: { text: this.state.text }
                    });
                    this.onClose();
                  }}
                >
                  Save
                </Button>
                <Button variant="raised" onClick={this.onClose}>
                  Cancel
                </Button>
              </DialogActions>
            </DialogContent>
          </Dialog>
        )}
      </Mutation>
    ];
  }
}

export default withStyles(styles)(Root);
