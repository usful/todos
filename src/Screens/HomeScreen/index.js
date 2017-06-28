import React, { Component } from 'react';
import { TextInput, Text, View, TouchableOpacity } from 'react-native';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Container, Content, List, ListItem, Spinner } from 'native-base';
import styles from './styles';

import { TodoListCard } from '../../Components';
import TodoListAdder from './TodoListAdder';

import connect from '../../connect';

class Home extends Component {
  constructor(props) {
    super(props);
  }

  renderItem(edge) {
    const refetch = () => {
      const query = this.props.getLists;
      query.refetch(query.variables);
    };

    return (
      <ListItem
        key={`list-${edge.node.id}`}
        onPress={() => console.log('pressed item', edge.node.id)}
        button
      >
        <TodoListCard refetch={refetch} data={edge.node} owner={edge.owner} />
      </ListItem>
    );
  }

  render() {
    const { loading, error, getUser } = this.props.getLists;

    const view = () => {
      if (loading) {
        return <Spinner />;
      } else if (error) {
        return <Text> Error has occurred </Text>;
      }
      return getUser.todoLists.edges.map(edge => {
        return this.renderItem(edge);
      });
    };

    return (
      <Container>
        <Content>
          {view()}
          <TodoListAdder userId={this.props.store.userId}/>
        </Content>
      </Container>
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
          author,
          createdAt
          totalTodos: todos {
            aggregations {
              count
            }
          }
          completedTodos: todos(where: {complete:{eq:true}}) {
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
        id: props.store.userId,
      },
    }),
  })(Home),
);
