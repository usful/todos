import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import Spinner from 'react-native-spinkit';
import Moment from 'moment';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import styles from './styles';
import {
  Button
} from '../index';
import connect from '../../connect';

class TodoListCard extends Component {
  constructor(props) {
    super(props);
    console.log('-----refetch is -----', this.props.refetch);

    this.state = {
      mutating: false,
    };
  }

  handleDelete = async() => {
    const { data, owner, deleteList, leaveList, store, refetch } = this.props;

    this.setState({ mutating: true });

    const handler = owner ? deleteList : leaveList;

    const vars = owner
      ? { id: data.id }
      : {
          userId: store.user.data.id,
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
      <View>
        <View style={styles.cardContent}>
          <Text style={styles.contentItems}>{data.title}</Text>
            {this.state.mutating
              ? <Spinner isVisible color="#0c49ff" size={25} type="Circle" />
              :
              <Button
                style={styles.contentItems}
                onPress={() => this.state.mutating ? null : this.handleDelete()}
                text={owner ? 'delete' : 'remove'}
                transparent
              />}
        </View>
        <View style={styles.cardContent}>
          <Text>
            {`Author: ${owner ? 'You' : data.author}\n`}
            {`Created ${dateString}\n`}
            {`${data.completedTodos.aggregations.count} of ${data.totalTodos.aggregations.count} todos completed`}
          </Text>
        </View>
      </View>
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
