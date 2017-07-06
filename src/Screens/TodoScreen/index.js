import React, { Component } from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  ScrollView,
  StyleSheet,
} from 'react-native';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './styles'
import {CheckBox} from '../../Components';
import connect from '../../connect';

class TodoScreen extends Component {

  handleUpdate = async(input, errorHandler = ()=>{}) => {
    const { updateTodo } = this.props;
    try {
      await updateTodo({
        variables: {
          input
        }
      });
    } catch(error) {
      console.log('error', error);
      errorHandler();
    }
  };

  voteAction = (voted) => {
    let votes = [];
    if (voted) {
      votes = this.state.votes.filter(
        (val) => (val !== this.props.store.user.id));
    }else{
      votes = this.state.votes.concat([this.props.store.user.id]);
    }
    this.setState({
      votes: votes
    });
    this.handleUpdate(
      {
        id: this.props.navigation.state.params.node.id,
        votes
      },
      ()=>{
        this.setState({
          votes: this.state.votes,
        });
      }
    );
  };

  constructor(props) {
    super(props);
    const { node } = props.navigation.state.params;
    this.state = {
      votes: node.votes
    }
  }


  render(){
    const { node } = this.props.navigation.state.params;
    const voted = this.state.votes.indexOf(this.props.store.user.id) !== -1
    const buttonStyle = StyleSheet.flatten([styles.votingButton,voted ? styles.voted: styles.notVoted]);
    return (
      <ScrollView style={styles.container}>
        <View
          style={styles.todo}
          shadowOffset={{width:5,height:5}}
          shadowOpacity={0.2}
          shadowColor={'black'}
        >
          <View style={styles.header}>
            <View style={styles.leftContainer}>
              <Text style={styles.title}>
                {`${node.title}\n`}
              </Text>
              <Text>
                {`created by ${node.author.username}`}
              </Text>
            </View>
            <View style={styles.rightContainer}>
              <View style={styles.checkboxContainer}>
                <Text style={{marginRight:10}}>Done:</Text>
                <CheckBox
                  onPress={
                    () => {
                      this.handleUpdate(
                        {
                          id: node.id,
                          done: !node.done
                        }
                      )
                    }
                  }
                  checked={node.done}
                  color="#e26e64"
                  borderColor="#e26e64"
                />
              </View>
              <TouchableOpacity
                style={buttonStyle}
                onPress={()=>{
                  this.voteAction(voted);
                }}
              >
                <Icon
                  name={voted ? "arrow-down" : "arrow-up"}
                  size={16}
                  color={voted ? "white" : "#e26e64"}
                />
                <Text style={{fontWeight:'bold',color:voted ? "white" : "#e26e64"}}>
                  {voted?'Undo': 'Vote'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.seperator}/>
          <View style={styles.body}>
            <Text style={styles.bodyText}>
              {node.text}
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const updateTodoMutation = gql`
  mutation UpdateTodo($input: UpdateTodoInput!) {
    updateTodo(input: $input) {
      clientMutationId
    }
  }
`;

export default connect(graphql(updateTodoMutation, { name: 'updateTodo' })(TodoScreen));