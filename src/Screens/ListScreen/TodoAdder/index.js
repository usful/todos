import React, { Component } from "react";
import { TextInput, Text, View, TouchableOpacity, Modal } from "react-native";
import gql from "graphql-tag";
import { graphql, compose } from "react-apollo";
import styles from "./styles";

class TodoAdder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      todoTitle: "",
      todoText: ""
    };
  }

  async addNewTodo() {
    try {
      await this.props.createTodo({
        variables: {
          todo: {
            title: this.state.todoTitle,
            text: this.state.todoText,
            authorId: this.props.authorId,
            listId: this.props.listId
          }
        }
      });
    } catch (error) {
      console.error(error);
    }

    this.props.close();
  }

  render() {
    const { visible, close } = this.props;
    return (
      <Modal
        animationType={"slide"}
        transparent={true}
        visible={visible}
        onRequestClose={close}
        style={styles.modal}
      >
        <View style={styles.container}>
          <View style={styles.content}>
            <TextInput
              style={styles.textInput}
              onChangeText={text =>
                this.setState({ ...this.state, todoTitle: text })}
              value={this.state.todoTitle}
              placeholder="Todo title..."
            />
            <TextInput
              style={styles.textInput}
              onChangeText={text =>
                this.setState({ ...this.state, todoText: text })}
              value={this.state.todoText}
              placeholder="Todo text..."
            />
            <TouchableOpacity onPress={() => this.addNewTodo()}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Create Todo</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={close}>
              <Text>Close modal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}

const createTodoMutation = gql`
  mutation CreateTodo($todo: CreateTodoInput!) {
    createTodo(input: $todo) {
      clientMutationId
    }
  }
`;

export default graphql(createTodoMutation, { name: "createTodo" })(TodoAdder);
