import React, { Component } from 'react';
import { View, Text } from 'react-native';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import Icon from 'react-native-vector-icons/FontAwesome';

import styles from './styles';
import connect from '../../connect';
import { TextInput, Button, Link } from '../../Components';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      loading: false,
    };
  }

  async handleLoginPress() {
    this.setState({ loading: true });

    try {
      const { data } = await this.props.loginUser({
        variables: {
          user: {
            username: this.state.username,
            password: this.state.password,
          },
        },
      });

      this.props.updateStore({
        user: {
          token: data.loginUser.token,
          id: data.loginUser.user.id,
          isAuthenticated: true,
        },
      });

      this.props.navigation.navigate('Home');
    } catch (error) {
      console.log('there was an error sending the query', error);
    }

    this.setState({ loading: false });
  }

  handleRegisterPress = () => {
    this.props.navigation.navigate('Register');
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <Icon name="rocket" size={120} color="white" />
          <Text style={styles.title}>To-do by Usful</Text>
        </View>

        <View style={styles.formContainer}>
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
            <Button loading={this.state.loading} text="Login" onPress={() => this.handleLoginPress()} />
            <Link text="Register" onPress={() => this.handleRegisterPress()} />
          </View>
        </View>

      </View>
    );
  }
}

const loginUserQuery = gql`
  mutation LoginUser($user: LoginUserInput!) {
    loginUser(input: $user) {
      user {
        id
        username
      }
      token
    }
  }
`;

export default graphql(loginUserQuery, { name: 'loginUser' })(connect(Login));
