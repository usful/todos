import React, { Component } from 'react';
import { TextInput, Text, View, TouchableOpacity } from 'react-native';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import styles from './styles';

class TodoListAdder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newTodoList: '',
    };
  }

  async addNewTodo() {
    try {
      this.setState({ newTodoList: '' });

      const result = await this.props.createTodoList({
        variables: {
          todoList: {
            author: this.props.userId,
            title: this.state.newTodoList,
          },
        },
      });

      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.textInput}
          onChangeText={text => this.setState({ newTodoList: text })}
          onEndEditing={() => this.addNewTodo()}
          value={this.state.newTodoList}
          placeholder="Todo List name..."
        />
        <TouchableOpacity onPress={() => this.addNewTodo()}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Add new TodoList</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const createTodoListMutation = gql`
  mutation CreateTodoList($todoList: CreateTodoListInput!) {
    createTodoList(input: $todoList) {
      changedTodoList {
        id
        createdAt
        modifiedAt
        author
        title
      }
    }
  }
`;

export default graphql(createTodoListMutation, {
  name: 'createTodoList',
})(TodoListAdder);
