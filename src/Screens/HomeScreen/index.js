import React, { Component } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
} from 'react-native';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import styles from './styles';
import { TodoListCard } from '../../Components';
import TodoListAdder from './TodoListAdder';

import connect from '../../connect';

class Home extends Component {

  componentDidUpdate(){
    if (!this.props.getLists.loading) {
      const todoLists = this.props.getLists.getUser.todoLists.edges;
      const createdLists = this.props.getLists.getUser.createdLists.edges;
      const listIds = (todoLists.concat(createdLists)).map((edge) => {
        return (edge.node.id);
      });
      this.subscription = this.props.getLists.subscribeToMore({
        document: todoListSubscription,
        variables: {
          filter: {
            id: {
              in: listIds,
            }
          }
        },
        updateQuery: (prev, {subscriptionData}) => {

          if (!subscriptionData) {
            return prev;
          }

          const event = subscriptionData.data.subscribeToTodoList.mutation;
          let todoLists = prev.getUser.todoLists.edges;
          let createdLists = prev.getUser.createdLists.edges;
          const todoList = subscriptionData.data.subscribeToTodoList.value;
          if (event === 'deleteTodoList') {
            todoLists = todoLists.filter((edge) => (edge.node.id !== todoList.id))
            createdLists = createdLists.filter((edge) => (edge.node.id !== todoList.id))
          } else if (event === 'updateTodoList') {
            const mapFunction = (edge) => {
              if (edge.node.id === todoList.id) {
                return {
                  node:todoList
                };
              }
              return edge;
            };
            todoLists = todoLists.map(
              mapFunction
            );
            createdLists = createdLists.map(
              mapFunction
            );
          }

          return {
            ...prev,
            getUser: {
              todoLists: {
                edges: todoLists
              },
              createdLists: {
                edges: createdLists
              }
            }
          }
        }
      })
    }
  }

  constructor(props) {
    super(props);
    this.state={
      subscriptionUpdates: 0
    }
  }

  renderItem = ({ item }) => {

    return (
      <TodoListCard
        data={item.node}
        owner={item.node.createdBy.id === this.props.store.user.id}
        userId={this.props.store.user.id}
        onPress={() => this.handleListCardPress(item)}
      />
    );
  };

  handleListCardPress = (item) => {
    this.props.navigation.navigate('List', item);
  }

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
      <FlatList
        refreshing={loading}
        data={getUser.todoLists.edges.concat(getUser.createdLists.edges)}
        keyExtractor={(item) => item.node.id}
        renderItem={this.renderItem}
        ListEmptyComponent={
          <View style={styles.emptyList}>
            <Text style={styles.emptyListText}>No TodoLists</Text>
          </View>
        }
        ListFooterComponent={
          <TodoListAdder userId={this.props.store.user.id} />
        }
      />
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
}

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

const todoListSubscription = gql`
subscription todoListDeletion($filter: TodoListSubscriptionFilter) {
 subscribeToTodoList(filter:$filter, mutations:[deleteTodoList,updateTodoList]) {
  value {
    ...todoListInfo
  }
  mutation
 }
}
${fragments.todoList}`

export default connect(
  graphql(getTodoListsQuery, {
    name: 'getLists',
    options: props => ({
      variables: {
        id: props.store.user.id,
      },
    }),
  })(Home),
);
