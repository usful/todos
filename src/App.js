
import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { LoginScreen } from './Screens';
import { scapholdUrl } from './config';

const client = new ApolloClient({
  networkInterface: createNetworkInterface({ uri: scapholdUrl })
})

const genAuthMiddleWare = (app) => {
  return {
    applyMiddleware(req,next) {
      if(!req.options.headers) {
        req.options.headers = {};
      }
      req.options.headers['authorization'] = `Bearer ${app.props.store.token}`;
      next();
    }
  }
}

const Navigator = StackNavigator({
    Login: { screen: LoginScreen },
});

export default class App extends Component {

  constructor(props) {
    super(props);
    client.networkInterface.use([
      genAuthMiddleWare(this)
    ]);
  }
  render() {
    return (
      <ApolloProvider client={client}>
        <Navigator />
      </ApolloProvider>
    );
  }
}
