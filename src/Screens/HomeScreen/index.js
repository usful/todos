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
   renderItemGenerator(query) {
     console.log(query);
     return (data) => {
       const refetch = () => {
         query.refetch(query.variables);
       };
       return (
         <TodoListCard
           onPress={() => console.log('pressed item', data.item.node.id)}
           refetch={refetch}
           data={data.item.node}
           owner={data.item.owner}/>
       );
     }
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
           style={styles.list}
           data={getUser.todoLists.edges}
           renderItem={this.renderItemGenerator(this.props.getLists)}
           keyExtractor={(item,index) => item.node.id}
       />);
     };
  
     return (
       <View style={styles.container}>
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
