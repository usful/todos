import React, { Component } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from './styles';
import MembersAdder from './MembersAdder';
import { Header, Left, Center, Right, Button } from '../../Components';
import gStyles from '../../globalStyles';

class MembersScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showAdder: false,
      membersSearch: '',
      removingMember: false,
    };
  };

  componentWillUnmount() {
    console.log('unmounting MembersScreen');
  };

  handleBackPress = () => {
    this.props.navigation.navigate('Home');
  };
  renderMember = ({ item: user }) => {
    const { removingMember } = this.state;
    const isOwner = user.id === this.props.todoList.getTodoList.createdBy.id;

    return (
      <View style={[gStyles.card, styles.card]}>
        <View style={styles.memberTextContainer}>
          <Text style={styles.memberText}>
            {user.username}{user.owner ? '(owner)' : ''}
          </Text>
        </View>
        {isOwner
          ? null
          : <Button
              text={'Remove'}
              loading={removingMember}
              onPress={() => this.handleRemoveMemberPress(user)}
            />}

      </View>
    );
  };
  handleRemoveMemberPress = async user => {
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
    } catch (error) {
      console.log('[Error] removing member from todo list', error);
    }

    this.refetch();
    this.setState({ removingMember: false });
  };
  handleShowAdderPress = () => {
    this.setState({ showAdder: true, membersSearch: '' });
  };
  handleCloseAdderPress = () => {
    this.setState({ showAdder: false });
  };
  updateMembersSearch = text => {
    this.setState({ membersSearch: text });
  };
  refetch = () => {
    const query = this.props.todoList;
    query.refetch(query.variables);
  };
  render() {
    const { getTodoList, loading } = this.props.todoList;

    return (
      <View>
        {/** Header **/}
        <Header>
          <Left>
            <TouchableOpacity onPress={this.handleBackPress}>
              <Icon name="chevron-left" size={30} color="white" />
            </TouchableOpacity>
          </Left>
          <Center>
            <Text style={gStyles.headerTitle}>Members</Text>
          </Center>
          <Right>
            <TouchableOpacity onPress={this.handleShowAdderPress}>
              <Icon name="add" size={30} color="white" />
            </TouchableOpacity>
          </Right>
        </Header>

        {(() => {
          if (loading) {
            return <View><Text>Loading...</Text></View>;
          }

          if (!getTodoList) {
            return (
              <View>
                <Text>Looks like this Todo List was deleted :O!</Text>
              </View>
            );
          }

          const members = getTodoList.members.edges.map(edge => {
            return edge.node;
          });
          const owner = getTodoList.createdBy;
          members.unshift({
            owner: true,
            ...owner,
          });

          return (
            <View>
              {/** Members **/}
              <View>
                <FlatList
                  data={members}
                  renderItem={this.renderMember}
                  keyExtractor={item => item.id}
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
        })()}
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
