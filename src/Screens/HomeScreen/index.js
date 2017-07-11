import React, { Component } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
  Modal,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import styles from './styles';
import { TodoListCard } from '../../Components';
import TodoListAdder from './TodoListAdder';

import connect from '../../connect';

class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      showListAdder: false,
    };
  }

  refetch = () => {
    const query = this.props.getLists;
    query.refetch(query.variables);
  }

  renderItem = ({ item }) => {

    return (
      <TodoListCard
        refetch={this.refetch}
        data={item.node}
        owner={item.node.createdBy.id === this.props.store.user.id}
        userId={this.props.store.user.id}
        onPress={() => this.handleListCardPress(item)}
        handleMembersClick={() => this.handleMembersClick(item)}
      />
    );
  };

  handleMembersClick = (item) => {
    this.props.navigation.navigate('Members', item);
  }

  handleListCardPress = (item) => {
    this.props.navigation.navigate('List', item);
  };

  handleAddListPress = () => {
    this.setState({ showListAdder: true });
  };

  handleCloseListAdder = () => {
    this.setState({ showListAdder: false });
  };

  render() {
    const { loading, error, getUser } = this.props.getLists;
    if (loading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator animating />
        </View>
      );
    }

    if (error) {
      return (
        <View>
          <Text>Error: {error.message}</Text>
        </View>
      )
    }
    return (
      <View>
        <StatusBar backgroundColor="#C7584E" barStyle="light-content" />
        <View style={styles.menu}>
          <TouchableOpacity
            onPress={this.handleAddListPress}
            style={styles.addButton}
          >
            <Text style={styles.addButtonText}>
              Add List
            </Text>
          </TouchableOpacity>
        </View>
        <TodoListAdder
          visible={this.state.showListAdder}
          close={this.handleCloseListAdder}
          userId={this.props.store.user.id}
        />
        <FlatList
          style={styles.listContainer}
          refreshing={loading}
          data={getUser.todoLists.edges.concat(getUser.createdLists.edges)}
          keyExtractor={(item) => item.node.id}
          renderItem={this.renderItem}
          ListEmptyComponent={
            <View style={styles.emptyList}>
              <Text style={styles.emptyListText}>No TodoLists</Text>
            </View>
          }
        />
      </View>
    );
  }
}

const fragments = {
  todoList: gql`
    fragment todoListInfo on TodoList {
      id,
      title,
      createdBy {
        id
        username
      },
      createdAt
      members{
        aggregations{
          count
        }
      }
      totalTodos: todos {
        aggregations {
          count
        }
      }
      completedTodos: todos(where: {done:{eq:true}}) {
        aggregations {
          count
        }
      }
    }
  `
};

const getTodoListsQuery = gql`
query getUserTodoLists($id: ID!) {
  getUser(id: $id) {
    todoLists {
      edges {
        node {
          ...todoListInfo
        }
      }
    }
    createdLists {
      edges {
        node {
          ...todoListInfo
        }
      }
    }
  }
}
${fragments.todoList}`;

export default connect(
  graphql(getTodoListsQuery, {
    name: 'getLists',
    options: props => ({
      variables: {
        id: props.store.user.id,
      },
      pollInterval: 1000, // Time for development
    }),
  })(Home),
);
