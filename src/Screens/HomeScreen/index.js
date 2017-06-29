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
  constructor(props) {
    super(props);
  }

  onPress = () => {
    console.log('ListCardPress');
  }

  renderItem = ({ item }) => {
    const refetch = () => {
      const query = this.props.getLists;
      query.refetch(query.variables);
    };

    return (
      <TodoListCard
        onPress={this.onPress}
        refetch={refetch}
        data={item.node}
        owner={item.owner}
        userId={this.props.store.user.id}
      />
    );
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
      <FlatList
        refreshing={loading}
        data={getUser.todoLists.edges}
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

const getTodoListsQuery = gql`
query getUserTodoLists($id: ID!) {
  getUser(id: $id) {
    todoLists {
      edges {
        node {
          id,
          title,
          createdAt
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
        owner
      }
    }
  }
}`;

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
