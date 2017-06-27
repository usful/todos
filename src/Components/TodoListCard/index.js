import React, {Component} from 'react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import {
  Card,
  CardItem,
  Text,
  Icon,
  Spinner,
  Button,
} from "native-base";

import styles from './styles';
import connect from '../../connect';

class TodoListCard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mutating: false,
    }
    console.log('todolistcard',props);
  }

  render() {
    const {
      data,
      owner,
    } = this.props;
    return (
      <Card>
        <CardItem style={styles.cardContent}>
          <Text>{data.title}</Text>
          {this.state.mutating ? <Spinner /> :
            <Button
              transparent
              onPress={() => {handleDelete(this.props)}}
            >
              <Icon name={owner ? "trash" : "md-close"} active/>
            </Button>
          }
        </CardItem>
      </Card>
    );
  }
}

const handleDelete = (props) => {
  const {
    data,
    owner,
    deleteList,
    leaveList,
    store,
    done,
  } = this.props;
  this.state.mutating = true;
  const handler = owner ? deleteList : leaveList;
  const vars = owner ? {id:data.id} :
    {
      userId:store.userId,
      todoListId:data.id
    };
  handler({
    variables: {
      input: vars
    },
  }).then(({data}) => {
    console.log('success');
    done();
    //const query = this.props.query;
   // query.refetch(query.variables);
  }).catch((error) => {
    this.state.mutating = false;
    console.log('error', error);
  });
}

const leaveList = gql`
mutation removeMembership($input:RemoveFromMembershipConnectionInput!) {
	removeFromMembershipConnection(input:$input){
	  clientMutationId
	}
}`;

const deleteTodoList = gql`
mutation deleteTodoList($input: DeleteTodoListInput!) {
  deleteTodoList(input:$input){
    clientMutationId
  }
}`;

export default connect(compose(
  graphql(leaveList,{name:'leaveList'}),
  graphql(deleteTodoList,{name:'deleteList'}),
)(TodoListCard));