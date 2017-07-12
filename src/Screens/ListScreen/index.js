import React, { Component } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import gql from "graphql-tag";
import { graphql } from "react-apollo";
import _ from "lodash";
import styles from "./styles";
import { TodoCard, Button, Header, Left, Center, Right } from "../../Components";
import TodoAdder from "./TodoAdder";
import connect from "../../connect";
import gStyles from '../../globalStyles';

class ListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showTodoAdder: false
    };
  }

  componentDidMount() {
    this.props.getList.subscribeToMore({
      document: todosSubscription,
      variables: {
        filter: {
          listId: {
            eq: this.props.navigation.state.params.node.id
          }
        },
        id: this.props.store.user.id
      },
      updateQuery: this.updateData
    });
    this.props.getList.subscribeToMore({
      document: voteSubscription,
      variables: {
        filter: {
          todolistId: {
            eq: this.props.navigation.state.params.node.id
          }
        },
        id: this.props.store.user.id
      },
      updateQuery: this.updateData
    });
  }

  updateData(prev, { subscriptionData }) {
    if (!subscriptionData) {
      return prev;
    }
    let edges = prev.getTodoList.todos.edges;
    const todoEdge = subscriptionData.data.payload.edge;
    const event = subscriptionData.data.payload.mutation;
    if (event === "createTodo") {
      edges = edges.concat(todoEdge);
    } else if (event === "deleteTodo") {
      edges = edges.filter(edge => edge.node.id !== todoEdge.node.id);
    } else {
      edges = edges.map(edge => {
        if (edge.node.id === todoEdge.node.id) {
          return todoEdge;
        }
        return edge;
      });
    }
    return {
      ...prev,
      getTodoList: {
        todos: {
          edges: edges
        }
      }
    };
  }

  renderItem = ({ item }) => {
    const todo = {
      ...item.node,
      votes: item.node.votes.aggregations.count
    };

    return (
      <View
        shadowOffset={{ width: 5, height: 5 }}
        shadowOpacity={0.2}
        shadowColor={"black"}
        style={styles.listItem}
      >
        <TodoCard
          todo={todo}
          onPress={() => {
            this.props.navigation.navigate("Todo", { todoId: todo.id });
          }}
          touchable
        />
      </View>
    );
  };

  handleShowAdderPress = () => {
    this.setState({ showTodoAdder: !this.state.showTodoAdder });
  };

  handleBackPress = () => {
    this.props.navigation.navigate('Home');
  };

  render() {
    const { loading, error, getTodoList } = this.props.getList;
    const listTitle = this.props.navigation.state.params.node.title;

    return (
      <View style={gStyles.container}>

        {/** Header **/}
        <Header>
          <Left>
            <TouchableOpacity onPress={this.handleBackPress}>
              <Icon name="chevron-left" size={30} color="white" />
            </TouchableOpacity>
          </Left>
          <Center>
            <Text style={gStyles.headerTitle}>
              {listTitle}
            </Text>
          </Center>
          <Right>
            <TouchableOpacity onPress={this.handleShowAdderPress}>
              <Icon name="add" size={30} color="white" />
            </TouchableOpacity>
          </Right>
        </Header>

        {/** Content **/}
        {(() => {
          if (loading) {
            return (
              <View style={styles.loading}>
                <ActivityIndicator animating />
              </View>
            );
          }

          if (error) {
            return (
              <View>
                <Text>
                  Error: {error.message}
                </Text>
              </View>
            );
          }

          return (
            <View>
              <TodoAdder
                visible={this.state.showTodoAdder}
                listId={this.props.navigation.state.params.node.id}
                authorId={this.props.store.user.id}
                close={() => {
                  this.setState({ showTodoAdder: false });
                }}
              />
              <FlatList
                refreshing={loading}
                data={_.orderBy(
                  getTodoList.todos.edges,
                  ["node.votes.aggregations.count"],
                  ["desc"]
                )}
                keyExtractor={item => item.node.id}
                renderItem={this.renderItem}
                ListEmptyComponent={
                  <View style={styles.emptyList}>
                    <Text style={styles.emptyListText}>No Todos</Text>
                  </View>
                }
              />
            </View>
          );
        })()}
      </View>
    );
  }
}

const fragments = {
  todoFragment: gql`
    fragment TodoInfo on Todo {
      id
      done
      title
      votes {
        aggregations {
          count
        }
      }
      author {
        username
      }
    }
  `
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

export default connect(
  graphql(getTodoListQuery, {
    name: "getList",
    options: props => ({
      variables: {
        listId: props.navigation.state.params.node.id,
        id: props.store.user.id
      }
    })
  })(ListScreen)
);
