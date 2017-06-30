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
import { TodoCard } from '../../Components';

class ListScreen extends Component {
  renderItem = ({item}) => {
    const refetch = () => {
      const query = this.props.getList;
      query.refetch(query.variables);
    };

    return (
      <TodoCard
        refetch={refetch}
        data={item.node}
      />
    );

    return (
      <View>
        <Text>item</Text>
      </View>
    )
  };

  render() {
    const { loading, error, getTodoList } = this.props.getList;

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
        data={getTodoList.todos.edges}
        keyExtractor={(item) => item.node.id}
        renderItem={this.renderItem}
        ListEmptyComponent={
          <View style={styles.emptyList}>
            <Text style={styles.emptyListText}>No Todos</Text>
          </View>
        }
      />
    );
  }
}

const getTodoListQuery = gql`
query GetListTodos($listId: ID!) {
  getTodoList(id: $listId) {
    todos {
      edges {
        node {
          id
          done
          title
          text
          createdAt
          modifiedAt
          votes
          author {
            username
          }
          text
        }
      }
    }
    id
    title
    createdAt
  }
}
`;

export default graphql(getTodoListQuery, {
    name: 'getList',
    options: props => ({
      variables: {
        listId: props.navigation.state.params.node.id,
      },
      // pollInterval:1000,
    }),
  })(ListScreen);
