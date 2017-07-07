import React, { Component } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
} from 'react-native';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import _ from 'lodash';
import styles from './styles';
import { TodoCard } from '../../Components';
import connect from '../../connect';

class ListScreen extends Component {

  componentDidUpdate() {
    if(!this.props.getList.loading) {
      this.props.getList.subscribeToMore({
        document: todosSubscription,
        variables: {
          filter: {
            listId: {
              eq: this.props.navigation.state.params.node.id
            }
          },
          id: this.props.store.user.id,
        },
        updateQuery: this.updateData,
      });
      this.props.getList.subscribeToMore({
        document: voteSubscription,
        variables: {
          filter: {
            todolistId: {
              eq: this.props.navigation.state.params.node.id
            }
          },
          id: this.props.store.user.id,
        },
        updateQuery: this.updateData,
      });

    }
  }

  updateData(prev,{subscriptionData}) {
    if (!subscriptionData) {
      return prev;
    }
    let edges = prev.getTodoList.todos.edges;
    const todoEdge = subscriptionData.data.payload.edge;
    const event = subscriptionData.data.payload.mutation;
    if (event === 'createTodo') {
      edges = edges.concat(todoEdge);
    }else if (event === 'deleteTodo') {
      edges = edges.filter((edge) => (edge.node.id !== todoEdge.node.id));
    }else {
      edges = edges.map((edge) => {
        if (edge.node.id === todoEdge.node.id) {
          return todoEdge;
        }
        return edge;
      })
    }
    return {
      ...prev,
      getTodoList:{
        todos:{
          edges:edges
        }
      }
    };
  }

  renderItem = ({item}) => {
    return (
      <TodoCard
        data={item.node}
        onPress={()=>{this.props.navigation.navigate('Todo',item)}}
      />
    );
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
        style={styles.listContainer}
        refreshing={loading}
        data={_.orderBy(getTodoList.todos.edges,['node.votes.aggregations.count'],['desc'])}
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

const fragments = {
  todoFragment: gql`
  fragment TodoInfo on Todo {
    id
    done
    title
    text
    createdAt
    modifiedAt
    votes {
      aggregations {
        count
      }
    }
    usersVote: votes {
      edges{
        node{
          id
          user{
            id
          }
        }
      }
    }
    author {
      username
    }
    list{
      id
    }
  }`
};

const getTodoListQuery = gql`
query GetListTodos($listId: ID!) {
  getTodoList(id: $listId) {
    todos {
      edges {
        node {
          ...TodoInfo
        }
      }
    }
    id
    title
    createdAt
  }
}
${fragments.todoFragment}
`;

const todosSubscription = gql`
subscription subscribeToTodos($filter: TodoSubscriptionFilter) {
  payload:subscribeToTodo(filter:$filter, mutations:[createTodo,updateTodo,deleteTodo]){
    mutation
    edge {
      node {
        ...TodoInfo
      }
    }
  }
}
${fragments.todoFragment}
`;

const voteSubscription = gql`
subscription subscribeToVotes($filter: VoteSubscriptionFilter) {
  payload:subscribeToVote(filter:$filter, mutations:[createVote,deleteVote]){
    mutation
    edge:value{
      node:todo {
        ...TodoInfo
      }
    }
  }
}
${fragments.todoFragment}
`;

export default connect(graphql(getTodoListQuery, {
    name: 'getList',
    options: props => ({
      variables: {
        listId: props.navigation.state.params.node.id,
        id: props.store.user.id
      },
    }),
  })(ListScreen));
