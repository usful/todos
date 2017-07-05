import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import styles from './styles';
import { Button, CheckBox } from '../index';

class TodoCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mutating: false,
    };
  }

  handleToggleDonePress = async() => {
    const { updateTodo } = this.props;

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
    } catch(error) {
      console.log('error', error);
      this.setState({ mutating: false });
    }
  }

  render() {
    const { data, onPress } = this.props;

    return (
      <TouchableOpacity onPress={onPress}>
        <View
          style={styles.card}
          shadowOffset={{width:5,height:5}}
          shadowOpacity={0.2}
          shadowColor={'black'}
        >

          <View style={styles.cardPreview}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{data.title}</Text>
            </View>
            <View style={styles.authorContainer}>
              <Text style={styles.author}>Created by: {data.author.username}</Text>
            </View>
          </View>

          <View style={styles.cardActions}>
            <View style={styles.cardCheckbox}>
              <Text style={{marginRight:20}}>Done:</Text>
              <CheckBox
                checked={data.done}
                onPress={this.handleToggleDonePress}
                borderColor="#e26e64"
                color="#e26e64"
              />
            </View>
            <Text>{`Upvotes:\t${data.votes.aggregations.count}`}</Text>
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
      }
    }
  }
`;

export default graphql(updateTodoMutation, { name: 'updateTodo' })(TodoCard);
