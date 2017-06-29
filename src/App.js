import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import {
  SubscriptionClient,
  addGraphQLSubscriptions,
} from 'subscriptions-transport-ws';
import { LoginScreen, HomeScreen } from './Screens';
import { scapholdUrl, scapholdWebSocketUrl } from './config';
import connect from './connect';

const wsClient = new SubscriptionClient(scapholdWebSocketUrl, {
  reconnect: true,
});

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  createNetworkInterface({ uri: scapholdUrl }),
  wsClient,
);

const client = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions,
});

const genAuthMiddleWare = app => {
  return {
    applyMiddleware(req, next) {
      if (!req.options.headers) {
        req.options.headers = {};
      }
      req.options.headers['authorization'] = `Bearer ${app.props.store.token}`;
      next();
    },
  };
};

const Navigator = StackNavigator({
  Login: { screen: LoginScreen },
  Home: { screen: HomeScreen },
});

class App extends Component {
  constructor(props) {
    super(props);
    client.networkInterface.use([genAuthMiddleWare(this)]);
  }
  render() {
    return (
      <ApolloProvider client={client}>
        <Navigator />
      </ApolloProvider>
    );
  }
}

export default connect(App);
