import React, { Component } from "react";
import { Image } from "react-native";
import {
  Container,
  Content,
  Item,
  Input,
  Button,
  Icon,
  View,
  Text,
  Form
} from "native-base";
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import PropTypes from 'prop-types';
import styles from "./styles";
import connect from '../../connect';

const background = require("../../../assets/shadow.png");

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
  }

  handleLoginPress() {
    console.log('loginUser');
    this.props.loginUser({
      variables: {
        user: {
          username: this.state.username,
          password: this.state.password
        }
      }
    })
      .then(({ data }) => {
        console.log('got data', data);
        this.props.updateStore({
          response: data,
          token: data.token,
        });
      }).catch((error) => {
        console.log('there was an error sending the query', error);
      });
  }

  render() {
    console.log('props', this.props);
    return (
      <Container>
        <Content>
          <Form>
            <Item>
              <Input placeholder="Username" onChangeText={(username) => this.setState({username})} />
            </Item>
            <Item last>
              <Input placeholder="Password" onChangeText={(password) => this.setState({password})} />
            </Item>
            <Button onPress={() => this.handleLoginPress()}>
              <Text>Click Me! </Text>
            </Button>
          </Form>
        </Content>
      </Container>
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
`

const connectedComponent = connect(Login);
console.log('connected coponent', connectedComponent);

export default graphql(loginUserQuery, {name: 'loginUser'})(connectedComponent);
