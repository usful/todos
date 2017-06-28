import React, { Component } from "react";
import { Image, View, Text } from 'react-native';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from "./styles";
import connect from '../../connect';
import { TextInput, Button, Link } from '../../Components';

class RegisterComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: "",
      username: "",
      password: ""
    };
  }

  handleRegisterPress = () => {
    this.props.registerUser({
      variables: {
        user: {
          email: this.state.email,
          username: this.state.username,
          password: this.state.password
        }
      }
    })
      .then(({ data }) => {
        console.log('registered user', data);
        this.props.updateStore({
          user: {
            data: {
              token: data.loginUser.token,
              id: data.loginUser.user.id,
            },
            isAuthenticated: true,
          }
        });
        this.props.navigation.navigate('Home');
      }).catch((error) => {
        console.log('there was an error sending the query', error);
      });
  }

  handleLoginPress = () => {
    this.props.navigator.navigate('Login');
  }

  render() {
    return (
      <View style={styles.container}>
          <View style={styles.topContainer}>
            <Icon name="spa" size={120} color="white" />
            <Text style={styles.title}>Create Account</Text>
          </View>

          <View style={styles.formContainer}>
            <TextInput
              placeholder={'Email'}
              onChangeText={(email) => this.setState({email})}
              value={this.state.email}
            />
            <TextInput
              placeholder={'Username'}
              onChangeText={(username) => this.setState({username})}
              value={this.state.username}
            />
            <TextInput
              placeholder={'Password'}
              onChangeText={(password) => this.setState({password})}
              value={this.state.password}
              secureTextEntry
            />
            <View style={styles.buttons}>
              <Button
                text={'Register'}
                onPress={this.handleRegisterPress}
              />
              <Link
                text={'Login'}
                onPress={this.handleLoginPress}
              />
            </View>
          </View>

      </View>
    );
  }
}

const registerUserQuery = gql`
mutation CreateUser($user: CreateUserInput!) {
  createUser(input: $user) {
    changedUser {
      id
      username
      email
    }
    token
  }
}
`

const connectedComponent = connect(RegisterComponent);

export default graphql(
  registerUserQuery,
  { name: 'registerUser' }
)(connectedComponent);
