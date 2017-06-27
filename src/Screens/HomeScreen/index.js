import React, {Component} from 'react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import {
  Container,
  Content,
  Card,
  CardItem,
  Text,
  Icon,
  List,
  ListItem,
  Spinner,
  Button,
} from "native-base";
import styles from './styles';

import connect from '../../connect';

class Home extends Component {

  renderItem(edge){
    const data = edge.node;
    const isOwner = edge.owner;

    const handlePress = () => {
      const handler = isOwner ? this.props.deleteList : this.props.leaveList;
      const vars = isOwner ? {id:edge.node.id} :
        {
          userId:this.props.store.userId,
          todoListId:edge.node.id
        };
      handler({
        variables: {
          input: vars
        },
      }).then(({data}) => {
        console.log('success');
        const query = this.props.getLists;
        query.refetch(query.variables);
      }).catch((error) => {
        console.log('error', error);
      });
    }

    return (
      <ListItem key={`list-${data.id}`} onPress={()=>console.log('pressed item')} button>
        <Card>
          <CardItem style={styles.cardContent}>
            <Text>{data.title}</Text>
            <Button
              transparent
              onPress={handlePress}
            >
              <Icon name={isOwner ? "trash" : "md-close"} active/>
            </Button>
          </CardItem>
        </Card>
      </ListItem>
    );
  };

  render() {
    const {
      loading,
      error,
      getUser
    } = this.props.getLists;

    const view = () => {
      if (loading) {
        return <Spinner />
      }else if (error) {
        return <Text> Error has occured </Text>
      }
      return (getUser.todoLists.edges.map((edge) => {
        return this.renderItem(edge);
      }));
    };

    return (
      <Container>
        <Content>
          {
            view()
          }
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
          title
        }
        owner
      }
    }
  }
}`;

const leaveList = gql`
mutation removeMembership($input:RemoveFromMembershipConnectionInput!) {
	removeFromMembershipConnection(input:$input){
	  changedMembership {
      user {
        todoLists{
          edges {
            node {
              id
              title
            }
            owner
          }
        }
      }
    }
	}
}`;

const deleteTodoList = gql`
mutation deleteTodoList($input: DeleteTodoListInput!) {
  deleteTodoList(input:$input){
    clientMutationId
  }
}`;


/** Todo think maybe about a schema like this. Users have a one to many connection for subscriptions, and
 * lists have a one to many connection with Users. Problem, you have to update both connections for a user to be
 * added or remove
 **/
// Todo need to run this query every time page is loaded
export default connect(compose(
  graphql(getTodoListsQuery,
    {
      name: 'getLists',
      options: (props) => ({
        variables : {
          id: props.store.userId
        }
      })
    }
  ),
  graphql(leaveList,{name: 'leaveList'}),
  graphql(deleteTodoList,{name: 'deleteList'})
)(Home));