import React, { Component } from 'react';
import { Image, View, Text, StatusBar } from 'react-native';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from './styles';
import connect from '../../connect';
import { TextInput, Button, Link } from '../../Components';

class RegisterComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      username: '',
      password: '',
    };
  }

  async handleRegisterPress() {
    this.setState({ loading: true });

    try {
      const { data } = await this.props.registerUser({
        variables: {
          user: {
            email: this.state.email,
            username: this.state.username,
            password: this.state.password,
          },
        },
      });

      const user = data.createUser.changedUser;
      const token = data.createUser.token;

      this.props.updateStore({
        user: {
          ...user,
          token,
          isAuthenticated: true,
        },
      });

      this.props.navigation.navigate('Home');
    } catch (error) {
      console.log('there was an error sending the query', error);
    }

    this.setState({ loading: false });
  }

  handleLoginPress() {
    this.props.navigator.navigate('Login');
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#e26e64" barStyle="light-content" />
        <View style={styles.topContainer}>
          <Icon name="spa" size={120} color="white" />
          <Text style={styles.title}>Create Account</Text>
        </View>

        <View style={styles.formContainer}>
          <TextInput
            placeholder="Email"
            keyboardType="email-address"
            onChangeText={email => this.setState({ email })}
            value={this.state.email}
          />
          <TextInput
            placeholder="Username"
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={username => this.setState({ username })}
            value={this.state.username}
          />
          <TextInput
            placeholder="Password"
            onChangeText={password => this.setState({ password })}
            value={this.state.password}
            secureTextEntry
          />
          <View style={styles.buttons}>
            <Button
              text="Register"
              loading={this.state.loading}
              onPress={() => this.handleRegisterPress()}
            />
            <Link text="Login" onPress={() => this.handleLoginPress()} />
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
`;

const connectedComponent = connect(RegisterComponent);

export default graphql(registerUserQuery, { name: 'registerUser' })(
  connectedComponent,
);
