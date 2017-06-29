import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import {
  Text,
  FlatList,
  View,

} from 'react-native';
import Spinner from 'react-native-spinkit';

import styles from './styles';
import { TodoListCard } from '../../Components';
import connect from '../../connect';

class Home extends Component {
   renderItem(edge) {
     const refetch = () => {
       const query = this.props.getLists;
       query.refetch(query.variables);
     };
  
     return (
       <TodoListCard
         key={`list-${edge.node.id}`}
         onPress={() => console.log('pressed item', edge.node.id)}
         refetch={refetch}
         data={edge.node}
         owner={edge.owner} />
     );
   }

   render() {
     const { loading, error, getUser } = this.props.getLists;
  
     const view = () => {
       if (loading) {
         return <Spinner isVisible color="#0c49ff" type="Circle" />;
       } else if (error) {
         return <Text> Error has occured {error}</Text>;
       }
       return (
         <FlatList
           data={getUser.todoLists.edges}
           renderItem={this.renderItem}
       />);
     };
  
     return (
       <View>
         {view()}
       </View>
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
       id: props.store.user.data.id,
     },
    }),
  })(Home),
);
