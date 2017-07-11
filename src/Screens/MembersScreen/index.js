import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from './styles';
import MembersAdder from './MembersAdder';
import { Header, Left, Center, Right } from '../../Components';

class MembersScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      showAdder: false,
      membersSearch: '',
      removingMember: false,
    };
  }

  handleBackPress = () => {
    this.props.navigation.navigate('Home');
  }

  renderMember = ({ item: user }) => {
    const isOwner = (user.id === this.props.todoList.getTodoList.createdBy.id);
    return (
      <View>
        <Text>{user.username}{user.owner ? '(owner)' : ''}</Text>
        { isOwner
          ? null
          : <TouchableOpacity onPress={() => this.handleRemoveMemberPress(user)} >
            <Text>(Remove)</Text>
          </TouchableOpacity>
        }

      </View>
    );
  }

  handleRemoveMemberPress = async(user) => {
    const { removeMember } = this.props;
    this.setState({ removingMember: true });

    const listId = this.props.todoList.getTodoList.id;
    try {
      const { data } = await removeMember({
        variables: {
          removeUserInput: {
            userId: user.id,
            todoListId: listId,
          },
        },
      });
    } catch(error) {
      console.log('[Error] removing member from todo list', error);
    }

    this.refetch();
    this.setState({ removingMember: false });
  }

  handleShowAdderPress = () => {
    this.setState({ showAdder: true, membersSearch: '' });
  }

  handleCloseAdderPress = () => {
    this.setState({ showAdder: false });
  }

  updateMembersSearch = (text) => {
    this.setState({ membersSearch: text });
  }

  refetch = () => {
    const query = this.props.todoList;
    query.refetch(query.variables);
  }

  render() {
    const { getTodoList, loading } = this.props.todoList;

    if (loading) {
      return (
        <View><Text>Loading...</Text></View>
      )
    }

    const members = getTodoList.members.edges.map((edge) => {
      return edge.node;
    });
    const owner = getTodoList.createdBy;
    members.unshift({
      owner: true,
      ... owner,
    });

    return (
      <View>

        {/** Header **/}
        <Header>
          <Left>
            <TouchableOpacity onPress={this.handleBackPress}>
              <Icon name="chevron-left" size={30} />
            </TouchableOpacity>
          </Left>
          <Center>
            <Text>Members</Text>
          </Center>
          <Right>
            <TouchableOpacity onPress={this.handleShowAdderPress}>
              <Icon name="add" size={30} />
            </TouchableOpacity>
          </Right>
        </Header>

        {/** Members **/}
        <View>
          <FlatList
            data={members}
            renderItem={this.renderMember}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={<View><Text>Empty</Text></View>}
          />
        </View>

        {/** Members Adder **/}
        <MembersAdder
          visible={this.state.showAdder}
          close={this.handleCloseAdderPress}
          todoList={getTodoList}
          membersSearch={this.state.membersSearch}
          updateMembersSearch={this.updateMembersSearch}
          refetch={this.refetch}
        />

      </View>
    );
  }
}

const getTodoListQuery = gql`
  query GetTodoList($id: ID!) {
    getTodoList(id: $id) {
      id
      createdAt
      createdBy {
        id
        username
      }
      members {
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

const removeUserFromListMutation = gql`
  mutation RemoveUserFromList($removeUserInput: RemoveFromMembershipConnectionInput!) {
    removeFromMembershipConnection(input: $removeUserInput) {
  		changedMembership {
        createdAt
      }
    }
  }
`;

export default compose(
  graphql(getTodoListQuery, {
   name: 'todoList',
   options: props => ({
     variables: {
       id: props.navigation.state.params.node.id,
     },
     pollInterval: 5000, // Time for development
   }),
  }),
  graphql(removeUserFromListMutation, { name: 'removeMember' }),
)(MembersScreen);
