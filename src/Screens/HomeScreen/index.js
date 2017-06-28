import React, {Component} from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Text } from 'react-native';
import styles from './styles';

// import { TodoListCard } from '../../Components';
import connect from '../../connect';

class Home extends Component {

  // renderItem(edge){
  //   const refetch = () => {
  //     const query = this.props.getLists;
  //     query.refetch(query.variables);
  //   };
  //
  //   return (
  //     <ListItem key={`list-${edge.node.id}`} onPress={()=>console.log('pressed item')} button>
  //       <TodoListCard
  //         refetch={refetch}
  //         data={edge.node}
  //         owner={edge.owner}
  //       />
  //     </ListItem>
  //   );
  // };

  render() {
    // const {
    //   loading,
    //   error,
    //   getUser
    // } = this.props.getLists;

    // const view = () => {
    //   if (loading) {
    //     return <Spinner />
    //   }else if (error) {
    //     return <Text> Error has occured </Text>
    //   }
    //   return (getUser.todoLists.edges.map((edge) => {
    //     return this.renderItem(edge);
    //   }));
    // };

    // return (
    //   <Container>
    //     <Content>
    //       {
    //         view()
    //       }
    //     </Content>
    //   </Container>
    // );

    return (<Text>Home Screen</Text>)
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
  graphql(getTodoListsQuery,
    {
      name: 'getLists',
      options: (props) => ({
        variables : {
          id: props.store.userId
        }
      })
    }
  )(Home)
);
