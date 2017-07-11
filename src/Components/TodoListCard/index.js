import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import Moment from 'moment';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import styles from './styles';
import { Button } from '../index';
import connect from '../../connect';

class TodoListCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mutating: false
    };
  }

  handleDelete = async () => {
    const { data, owner, deleteList, leaveList, userId } = this.props;

    this.setState({ mutating: true });

    const handler = owner ? deleteList : leaveList;

    const vars = owner
      ? { id: data.id }
      : {
          userId: userId,
          todoListId: data.id
        };

    try {
      const { data } = await handler({
        variables: {
          input: vars
        }
      });
    } catch (error) {
      console.log('error', error);
      this.setState({ mutating: false });
    }
  };

  render() {
    const { data, owner, onPress, handleMembersClick } = this.props;

    const dateString = Moment(data.createdAt).calendar();

    return (
      <TouchableOpacity onPress={onPress}>
        <View
          style={styles.card}
          shadowOffset={{ width: 5, height: 5 }}
          shadowOpacity={0.2}
          shadowColor={'black'}
        >
          <View style={styles.cardContent}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>
                {data.title}
              </Text>
            </View>
            <Button
              onPress={() => (this.state.mutating ? null : this.handleDelete())}
              loading={this.state.mutating}
              text={owner ? 'delete' : 'remove'}
              inverted
            />
          </View>
          <View style={styles.cardContent}>
            <Text>
              {`Author: ${owner ? 'You' : data.createdBy.username}\n`}
              {`Created ${dateString}\n`}
              {`Number of members: ${data.members.aggregations.count +
                (owner ? 1 : 0)}\n`}
              {`${data.completedTodos.aggregations.count} of ${data.totalTodos
                .aggregations.count} todos completed`}
            </Text>
            <Button
              onPress={() => handleMembersClick()}
              text="members"
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const leaveList = gql`
  mutation removeMembership($input: RemoveFromMembershipConnectionInput!) {
    removeFromMembershipConnection(input: $input) {
      clientMutationId
    }
  }
`;

const deleteTodoList = gql`
  mutation deleteTodoList($input: DeleteTodoListInput!) {
    deleteTodoList(input: $input) {
      clientMutationId
    }
  }
`;

export default connect(
  compose(
    graphql(leaveList, { name: 'leaveList' }),
    graphql(deleteTodoList, { name: 'deleteList' })
  )(TodoListCard)
);
