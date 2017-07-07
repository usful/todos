import React, { Component } from 'react';
import { TextInput, Text, View, TouchableOpacity, Modal } from 'react-native';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
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
            createdById: this.props.userId,
            title: this.state.newTodoList,
          },
        },
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
            <TouchableOpacity onPress={close}>
              <Text>Close modal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
        createdBy {
          id
          username
        }
        members {
          edges {
            cursor
          }
        }
      }
    }
  }
`;

// const AddToMembershipConnection = gql`
//   mutation AddToMembershipConnection($conn: AddToMembershipConnectionInput!) {
//     addToMembershipConnection(input: $conn) {
//   		changedMembership {
//         todoList {
//           title
//           members {
//             edges {
//               cursor
//             }
//           }
//         }
//       }
//     }
//   }
// `;

// graphql(AddToMembershipConnection, { name: 'addTodoMembership' })

export default graphql(createTodoListMutation,
  { name: 'createTodoList' })(TodoListAdder);
