import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet } from 'react-native';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';

import styles from './styles';
import { Button, VoteCount, TodoCard } from '../../Components';
import connect from '../../connect';

class TodoScreen extends Component {
  constructor(props) {
    super(props);
  
    const todo = props.navigation.state.params.todo;
    
    this.state = {
      vote: todo.vote,
      count: todo.votes,
      voted: todo.voted
    };
  }
  
  get todo() {
    return this.props.navigation.state.params.todo;
  }
  
  addVoteHandler = async () => {
    const { addVote, store } = this.props;

    try {
      const { data } = await addVote({
        variables: {
          input: {
            userId: store.user.id,
            todoId: this.todo.id,
            todolistId: this.todo.list.id
          }
        }
      });

      this.setState({
        vote: data.createVote,
        count: this.state.count + 1,
        voted: true
      });
    } catch (error) {
      console.log('error', error);
    }
  };

  deleteVoteHandler = async () => {
    const { deleteVote } = this.props;

    try {
      await deleteVote({
        variables: {
          input: {
            id: this.state.vote.node.id
          }
        }
      });

      this.setState({
        vote: null,
        count: this.state.count - 1,
        voted: false
      });
    } catch (error) {
      console.log('error', error);
    }
  };

  render() {
    const { count, voted } = this.state.voted;

    return (
      <ScrollView style={styles.container}>
        <View
          style={styles.todo}
          shadowOffset={{ width: 5, height: 5 }}
          shadowOpacity={0.2}
          shadowColor={'black'}
        >
          <TodoCard todo={this.todo} />
          <View style={styles.seperator} />
          <View style={styles.body}>
            <Text style={styles.bodyText}>
              {this.todo.text}
            </Text>

            <Button
              onPress={
                voted ? this.deleteVoteHandler : this.addVoteHandler
              }
              text={voted ? 'Vote Down' : 'Vote Up'}
              inverted={!voted}
            >
              <VoteCount count={count} inverted={voted} />
            </Button>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const addVote = gql`
  mutation CreateVote($input: CreateVoteInput!) {
    createVote(input: $input) {
      node: changedVote {
        id
        user {
          id
        }
      }
    }
  }
`;

const deleteVote = gql`
  mutation DeleteVote($input: DeleteVoteInput!) {
    deleteVote(input: $input) {
      clientMutationId
    }
  }
`;

export default connect(
  compose(
    graphql(addVote, { name: 'addVote' }),
    graphql(deleteVote, { name: 'deleteVote' })
  )(TodoScreen)
);
