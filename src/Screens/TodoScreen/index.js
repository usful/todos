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

  handleToggleDonePress = async() => {
    const { updateTodo } = this.props;
    const { node } = this.props.navigation.state.params;
    try {
      await updateTodo({
        variables: {
          input: {
            id: this.props.data.id,
            done: !this.props.data.done
          }
        }
      });
    } catch(error) {
      console.log('error', error);
    }
  };

  voteAction = async() => {
    const {addVote,deleteVote} = this.props;
    try {
      if (!(this.state.vote)) {
        const {data} = await addVote({
          variables: {
            input: {
              userId: this.props.store.user.id,
              todoId: this.props.navigation.state.params.node.id
            }
          }
        });
        this.setState({
          vote: data.voteMutation.changedVote
        });
      }else{
        await deleteVote({
          variables:{
            input:{
              id: this.state.vote.id,
            }
          }
        });
        this.setState({
          vote:null
        });
      }
    }catch(error){
      console.log('error', error);
    }
  };

  constructor(props) {
    super(props);
    const { node } = props.navigation.state.params;
    const edge = node.usersVote.edges[0];
    this.state = {
      vote: edge ? edge.node : null,
    }
  }


  render(){
    const { node } = this.props.navigation.state.params;
    const voted = !!(this.state.vote);
    const buttonStyle = StyleSheet.flatten([styles.votingButton,voted ? styles.voted: styles.notVoted])
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
                  onPress={this.handleToggleDonePress}
                  checked={node.done}
                  color="#e26e64"
                  borderColor="#e26e64"
                />
              </View>
              <TouchableOpacity
                style={buttonStyle}
                onPress={()=>{
                  this.voteAction();
                  //const input = {
                  //  id: node.id,
                  //};
                  //this.handleUpdate(input);
                  //Todo change listScreen to also watch votes. Will allow this to be one
                  // mutation instead of two
                }}
              >
                <Icon
                  name={voted ? "arrow-down" : "arrow-up"}
                  size={16}
                  color={voted ? "white" : "#e26e64"}
                />
                <Text style={{fontWeight:'bold',color:voted ? "white" : "#e26e64"}}>  {voted?'Undo': 'Vote'}</Text>
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
  mutation addVote($input: CreateVoteInput!){
    voteMutation:createVote(input:$input){
      changedVote{
        id
      }
    }
  }
`;

const deleteVote = gql`
  mutation deleteVote($input: DeleteVoteInput!){
    voteMutation: deleteVote(input:$input){
      clientMutationId
    }
  }
`;

export default connect(compose(
  graphql(updateTodoMutation, { name: 'updateTodo' }),
  graphql(addVote, {name: 'addVote'}),
  graphql(deleteVote, {name: 'deleteVote'}),
)(TodoScreen));