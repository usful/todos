
import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws';
import { LoginScreen, HomeScreen } from './Screens';
import { scapholdUrl } from './config';
import connect from './connect';

const wsClient = new SubscriptionClient(`ws:${scapholdUrl}`, {
  reconnect: true
});

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  createNetworkInterface({ uri: scapholdUrl }),
  wsClient
);

const client = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions
});

const Navigator = StackNavigator({
    Login: { screen: LoginScreen },
    Home: {screen: HomeScreen }
});

const genAuthMiddleWare = (app) => {
  return {
    applyMiddleware(req,next) {
      console.log('---------------running query-------------');
      if(!req.options.headers) {
        req.options.headers = {};
      }
      req.options.headers['authorization'] = `Bearer ${app.props.store.token}`;
      next();
    }
  }
}

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