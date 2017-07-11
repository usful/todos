import React, { Component } from "react";
import gql from "graphql-tag";
import { graphql } from "react-apollo";
import { View, Text, TouchableOpacity } from "react-native";

import styles from "./styles";
import { VoteCount, CheckBox } from "../index";

class TodoCard extends Component {
  static defaultProps = {
    onPress: () => {},
    todo: {
      id: "",
      title: "",
      author: {
        username: ""
      },
      votes: 0,
      done: false
    },
    touchable: false
  };

  constructor(props) {
    super(props);

    this.state = {
      mutating: false
    };
  }

  handleToggleDonePress = async () => {
    this.setState({ mutating: true });

    const { todo, updateTodo } = this.props;

    try {
      await updateTodo({
        variables: {
          input: {
            id: todo.id,
            done: !todo.done
          }
        }
      });
    } catch (error) {
      console.log("error", error);
    }

    this.setState({ mutating: false });
  };

  render() {
    const { todo, onPress, touchable } = this.props;

    return (
      <TouchableOpacity disabled={!touchable} onPress={onPress}>
        <View style={styles.card}>
          <View style={styles.cardPreview}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>
                {todo.title}
              </Text>
            </View>
            <View style={styles.authorContainer}>
              <Text style={styles.author}>
                {todo.author.username}
              </Text>
            </View>
          </View>

          <View style={styles.cardActions}>
            <View style={styles.cardCheckbox}>
              <CheckBox
                checked={todo.done}
                onPress={this.handleToggleDonePress}
                borderColor="#e26e64"
                color="#e26e64"
              />
            </View>
            <VoteCount inverted={todo.votes === 0} count={todo.votes} />
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const updateTodoMutation = gql`
  mutation UpdateTodo($input: UpdateTodoInput!) {
    updateTodo(input: $input) {
      changedTodo {
        id
        title
      }
    }
  }
`;

export default graphql(updateTodoMutation, { name: "updateTodo" })(TodoCard);
