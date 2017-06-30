import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import Spinner from 'react-native-spinkit';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import styles from './styles';
import { Button, CheckBox } from '../index';
import connect from '../../connect';

class TodoCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mutating: false,
    };
  }

  handleToggleDonePress = async() => {
    const { updateTodo, refetch } = this.props;

    this.setState({ mutating: true });

    try {
      const { data } = await updateTodo({
        variables: {
          input: {
            id: this.props.data.id,
            done: !this.props.data.done
          }
        }
      });
      console.log('res data', data);
      refetch();
    } catch(error) {
      console.log('error', error);
      this.setState({ mutating: false });
    }
  }

  render() {
    const { data, owner, onPress } = this.props;

    return (
      <TouchableOpacity onPress={onPress}>
        <View style={styles.card}>

          <View style={styles.cardPreview}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{data.title}</Text>
            </View>
            <View style={styles.authorContainer}>
              <Text style={styles.author}>Created by: {data.author.username}</Text>
            </View>
          </View>

          <View style={styles.cardButtons}>
            <CheckBox
              checked={data.done}
              onPress={this.handleToggleDonePress}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const updateTodoMutation = gql`
  mutation UpdateTodo($input: UpdateTodoInput!) {
    updateTodo(input: $input) {
      changedTodo {
        id
        title
        votes
      }
    }
  }
`;

export default graphql(updateTodoMutation, { name: 'updateTodo' })(TodoCard);
