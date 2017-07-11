import React, { Component } from "react";
import {
  ActivityIndicator,
  Text,
  View,
  ScrollView,
  StyleSheet
} from "react-native";
import gql from "graphql-tag";
import { graphql, compose } from "react-apollo";
import Icon from "react-native-vector-icons/FontAwesome";

import styles from "./styles";
import { Button, TodoCard } from "../../Components";
import connect from "../../connect";

class TodoScreen extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getTodo.subscribeToMore({
      document: todoSubscription,
      variables: {
        filter: {
          id: {
            eq: this.props.navigation.state.params.todoId
          }
        },
        where: {
          userId: {
            eq: this.props.store.user.id
          }
        }
      },
      updateQuery: this.updateTodoInfo
    });
    this.props.getTodo.subscribeToMore({
      document: voteSubscription,
      variables: {
        filter: {
          todoId: {
            eq: this.props.navigation.state.params.todoId
          }
        },
        where: {
          userId: {
            eq: this.props.store.user.id
          }
        }
      },
      updateQuery: this.updateTodoInfo
    });
  }

  updateTodoInfo(prev, { subscriptionData }) {
    if (!subscriptionData) {
      return prev;
    }
    return {
      todo: subscriptionData.data.payload.edge.node
    };
  }

  get todo() {
    return {
      ...this.props.getTodo.todo,
      votes: this.props.getTodo.todo.votes.aggregations.count,
      vote: this.props.getTodo.todo.usersVote.edges[0],
      voted: !!this.props.getTodo.todo.usersVote.edges[0]
    };
  }

  addVoteHandler = async () => {
    const { addVote, store } = this.props;

    try {
      const { data } = await addVote({
        variables: {
          input: {
            userId: store.user.id,
            todoId: this.todo.id,
            todolistId: this.todo.list.id
          }
        }
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  deleteVoteHandler = async () => {
    const { deleteVote } = this.props;

    try {
      await deleteVote({
        variables: {
          input: {
            id: this.todo.vote.node.id
          }
        }
      });
    } catch (error) {
      console.log("error", error);
    }
  };
  render() {
    const { loading } = this.props.getTodo;

    if (loading) {
      //Loading screen
      return (
        <View>
          <ActivityIndicator animating />
        </View>
      );
    }
    return (
      <ScrollView style={styles.container}>
        <View
          style={styles.todo}
          shadowOffset={{ width: 5, height: 5 }}
          shadowOpacity={0.2}
          shadowColor={"black"}
        >
          <TodoCard todo={this.todo} />
          <View style={styles.seperator} />
          <View style={styles.body}>
            <Text style={styles.bodyText}>
              {this.todo.text}
            </Text>
            <Button
              onPress={
                this.todo.voted ? this.deleteVoteHandler : this.addVoteHandler
              }
              text={this.todo.voted ? "Vote Down" : "Vote Up"}
              inverted={!this.todo.voted}
            >
              <Icon
                name={this.todo.voted ? "arrow-down" : "arrow-up"}
                color={!this.todo.voted ? "#e26e64" : "white"}
                size={20}
              />
            </Button>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const addVote = gql`
  mutation CreateVote($input: CreateVoteInput!) {
    createVote(input: $input) {
      node: changedVote {
        id
        user {
          id
        }
      }
    }
  }
`;

const deleteVote = gql`
  mutation DeleteVote($input: DeleteVoteInput!) {
    deleteVote(input: $input) {
      clientMutationId
    }
  }
`;

const todoFragment = gql`
  fragment TodoInfo on Todo {
    id
    done
    title
    text
    createdAt
    modifiedAt
    votes {
      aggregations {
        count
      }
    }
    usersVote: votes(where: $where) {
      edges {
        node {
          id
          user {
            id
          }
        }
      }
    }
    author {
      username
    }
    list {
      id
    }
  }
`;
//Think later about people deleting todos and how to react to that
const todoSubscription = gql`
  subscription todoUpdates($filter: TodoSubscriptionFilter, $where: VoteWhereArgs) {
    payload:subscribeToTodo(filter:$filter, mutations:[updateTodo]) {
      edge {
        node {
          ...TodoInfo
        }
      }
    }
  }
  ${todoFragment}
`;

const voteSubscription = gql`
subscription subscribeToVotes($filter: VoteSubscriptionFilter, $where: VoteWhereArgs) {
  payload:subscribeToVote(filter:$filter, mutations:[createVote,deleteVote]){
    edge:value{
      node:todo {
        ...TodoInfo
      }
    }
  }
}
${todoFragment}
`;

const getTodoListQuery = gql`
query GetListTodos($todoId: ID!, $where: VoteWhereArgs) {
  todo:getTodo(id: $todoId) {
    ...TodoInfo
  }
}
${todoFragment}
`;

export default connect(
  compose(
    graphql(addVote, { name: "addVote" }),
    graphql(deleteVote, { name: "deleteVote" }),
    graphql(getTodoListQuery, {
      name: "getTodo",
      options: props => {
        return {
          variables: {
            todoId: props.navigation.state.params.todoId,
            where: {
              userId: {
                eq: props.store.user.id
              }
            }
          }
        };
      }
    })
  )(TodoScreen)
);
