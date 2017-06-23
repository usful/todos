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
import styles from "./styles";

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
    console.log(this.props);
    this.props.createUser({
      variables: {
        user: {
          username: this.state.username,
          password: this.state.password
        }
      }
    })
      .then(({ data }) => {
        console.log('got data', data);
      }).catch((error) => {
        console.log('there was an error sending the query', error);
      });
  }

  render() {
    console.log('this is the state', this.state);
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

const createUserQuery = gql`
mutation CreateUser($user: CreateUserInput!) {
  createUser(input: $user) {
    changedUser {
      id
      username
    }
    token
  }
}
`

export default graphql(createUserQuery, {name: 'createUser'})(Login)
