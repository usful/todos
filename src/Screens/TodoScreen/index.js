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

  handleDone = async() => {
    const { updateTodo } = this.props;
    const { node } = this.props.navigation.state.params;
    try {
      await updateTodo({
        variables: {
          input:{
            id: node.id,
            done: !node.done
          }
        }
      });
    } catch(error) {
      console.log('error', error);
    }
  };

  addVoteHandler = async() => {
    const {addVote, store} = this.props;
    const { node } = this.props.navigation.state.params;
    try{
      const {data} = await addVote({
        variables: {
          input:{
            userId:store.user.id,
            todoId:node.id,
            todolistId:node.list.id,
          }
        }
      });
      this.setState({
        vote: data.createVote,
        count: this.state.count+1,
      });
    }catch(error){
      console.log('error', error);
    }
  };

  deleteVoteHandler = async() => {
    const {deleteVote} = this.props;
    try{
      await deleteVote({
        variables: {
          input:{
            id: this.state.vote.node.id,
          }
        }
      });
      this.setState({
        vote:null,
        count: this.state.count-1
      });
    }catch(error){
      console.log('error', error);
    }
  };

  constructor(props) {
    super(props);
    const { node } = props.navigation.state.params;
    this.state = {
      vote: node.usersVote.edges[0],
      count: node.votes.aggregations.count,
    };
  }


  render(){
    const { node } = this.props.navigation.state.params;
    const voted = !!(this.state.vote);
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
                  onPress={this.handleDone}
                  checked={node.done}
                  color="#e26e64"
                  borderColor="#e26e64"
                />
              </View>
              <TouchableOpacity
                style={buttonStyle}
                onPress={voted ? this.deleteVoteHandler : this.addVoteHandler}
              >
                <View style={voted ? styles.whiteCircle : styles.redCircle}>
                  <Text style={
                    {
                      fontWeight:'bold',
                      backgroundColor:'transparent',
                      color: !voted ? "white" : "#e26e64"
                    }
                  }>{this.state.count}</Text>
                </View>
                <Text style={{fontWeight:'bold',color:voted ? "white" : "#e26e64"}}>
                  {voted?'Vote Down': 'Vote Up'}
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

const addVote = gql`
  mutation CreateVote($input: CreateVoteInput!) {
    createVote(input:$input) {
      node:changedVote {
        id
        user{
          id
        }
      }
    }
  }
`;

const deleteVote = gql`
  mutation DeleteVote($input: DeleteVoteInput!) {
    deleteVote(input:$input){
      clientMutationId
    }
  }
`;

export default connect(compose(
  graphql(updateTodoMutation, { name: 'updateTodo' }),
  graphql(addVote, { name: 'addVote' }),
  graphql(deleteVote, { name: 'deleteVote' }),
)(TodoScreen));