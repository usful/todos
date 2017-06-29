import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import { Card, CardItem, Text, Icon, Button, Container, H3 } from 'native-base';
import Spinner from 'react-native-spinkit';
import Moment from 'moment';

import styles from './styles';
import connect from '../../connect';

class TodoListCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mutating: false,
    };
  }

  async handleDelete() {
    const { data, owner, deleteList, leaveList, store, refetch } = this.props;

    this.setState({ mutating: true });

    const handler = owner ? deleteList : leaveList;

    const vars = owner
      ? { id: data.id }
      : {
          userId: store.userId,
          todoListId: data.id,
        };

    try {
      const { data } = await handler({
        variables: {
          input: vars,
        },
      });

      refetch();
    } catch (error) {
      console.log('error', error);
    }

    this.setState({ mutating: false });
  }

  render() {
    const { data, owner } = this.props;

    const dateString = Moment(data.createdAt).calendar();

    return (
      <Card>
        <CardItem style={styles.cardContent}>
          <H3>{data.title}</H3>
          <Button
            transparent
            onPress={() => this.state.mutating ? null : this.handleDelete()}
            style={styles.button}
          >
            {this.state.mutating
              ? <Spinner isVisible color="#0c49ff" size={25} type="Circle" />
              : <Icon name={owner ? 'trash' : 'md-close'} active />}
          </Button>
        </CardItem>
        <CardItem>
          <Text>
            {`Author: ${owner ? 'You' : data.author}\n`}
            {`Created ${dateString}\n`}
            {`${data.completedTodos.aggregations.count} of ${data.totalTodos.aggregations.count} todos completed`}
          </Text>
        </CardItem>
      </Card>
    );
  }
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

export default connect(
  compose(
    graphql(leaveList, { name: 'leaveList' }),
    graphql(deleteTodoList, { name: 'deleteList' }),
  )(TodoListCard),
);