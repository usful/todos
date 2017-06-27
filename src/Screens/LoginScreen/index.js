import React, { Component } from "react";
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
    this.props.loginUser({
      variables: {
        user: {
          username: this.state.username,
          password: this.state.password
        }
      }
    })
      .then(({ data }) => {
        this.props.updateStore({
          response: data,
          token: data.loginUser.token,
          userId: data.loginUser.user.id,
        });
      }).catch((error) => {
        console.log('there was an error sending the query', error);
      });
  }

  render() {
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
          <Button onPress={() => {
            this.props.updateStore({
              token:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJraW5kIjoic2NhcGhvbGQuc3VwZXJ1c2VyIiwiZXhwIjo4NjQwMDAwMDAwMDAwMDAwLCJpYXQiOjE0OTgyNDk4MDMsImF1ZCI6Ikp0Z2Z5WklRMnBKajlySThFOWU2MTdoUWNrMFJueEFuIiwiaXNzIjoiaHR0cHM6Ly9zY2FwaG9sZC5hdXRoMC5jb20vIiwic3ViIjoiYTQxNjkyMWQtNzM3MC00ZTA4LWFiODktMTA4ZWYxNmIwMmZjIn0.hPHB7MT-5nI9ezdA380LZAkPAgK0NpksFlA8T8Eq3wo',
              userId: 'VXNlcjo2'
            });
            this.props.navigation.navigate('Home')
          }}>
            <Text>Dev button</Text>
          </Button>
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

export default graphql(loginUserQuery, {name: 'loginUser'})(connectedComponent);
