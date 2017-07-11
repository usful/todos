import React, { Component } from 'react';
import {
  TextInput,
  Text,
  View,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import styles from './styles';

class MembersAdder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      addingUser: false,
    };
  }

  handleInputChange = (text) => {
    this.props.updateMembersSearch(text);
  }

  renderFoundUser = ({ item: user }) => {
    return (
      <View>
        <Text>{user.node.username}</Text>
        <TouchableOpacity onPress={() => this.handleAddUserPress(user.node)}>
          <Text>(Add member)</Text>
        </TouchableOpacity>
      </View>
    )
  }

  handleAddUserPress = async(user) => {
    const { addUser, refetch } = this.props;
    this.setState({ addingUser: true });

    try {
      const { data } = await addUser({
        variables: {
          userListInput: {
            userId: user.id,
            todoListId: this.props.todoList.id,
          },
        }
      });
    } catch(err) {
      console.log('err', err);
    }

    refetch();
    this.setState({ addingUser: false });
  }

  render() {
    const {
      visible,
      close,
      searchUser,
      membersSearch,
    } = this.props;
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

            {/** Input **/}
            <TextInput
              style={styles.textInput}
              onChangeText={this.handleInputChange}
              value={membersSearch}
              placeholder="Username"
            />
            <TouchableOpacity onPress={close}>
              <Text>Close modal</Text>
            </TouchableOpacity>

            {/** Users found **/}
            { searchUser.loading
              ? <Text>Loading...</Text>
              : <FlatList
                data={searchUser.viewer.allUsers.edges}
                renderItem={this.renderFoundUser}
                keyExtractor={(user) => user.node.id}
                ListEmptyComponent={<View><Text>No users found...</Text></View>}
              />
            }

          </View>
        </View>
      </Modal>
    );
  }
}

const addUserToListMutation = gql`
  mutation AddUserToList($userListInput: AddToMembershipConnectionInput!) {
    addToMembershipConnection(input: $userListInput) {
      changedMembership {
        createdAt
      }
    }
  }
`;

const searchUserByUsernameQuery = gql`
  query SearchUserByUsername($userWhereArgs: UserWhereArgs) {
    viewer {
      allUsers(where: $userWhereArgs) {
        edges {
          node {
            id
            username
          }
        }
      }
    }
  }
`;

export default compose(
  graphql(addUserToListMutation, { name: 'addUser' }),
  graphql(searchUserByUsernameQuery, {
    name: 'searchUser',
    options: props => ({
      variables: {
        userWhereArgs: {
          "username": {
            "like": `%${props.membersSearch}%`,
          },
        },
      },
    }),
  }),
)(MembersAdder);
