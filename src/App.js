import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { View, StatusBar, StyleSheet } from 'react-native';
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws';
import { LoginScreen, HomeScreen, RegisterScreen } from './Screens';
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
      if (app.props.store.user.isAuthenticated) {
        console.log('authenticated request', `Bearer ${app.props.store.user.token}`);
        req.options.headers['authorization'] = `Bearer ${app.props.store.user.token}`;
      }
      next();
    },
  };
};

const AuthNavigator = StackNavigator({
  Login: { screen: LoginScreen },
  Register: { screen: RegisterScreen },
}, {
   headerMode: 'none',
});

const Navigator = StackNavigator({
    Auth: { screen: AuthNavigator },
    Home: { screen: HomeScreen }
}, {
   headerMode: 'none',
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

class App extends Component {
  constructor(props) {
    super(props);
    client.networkInterface.use([genAuthMiddleWare(this)]);
  }
  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="#e26e64"
          barStyle="light-content"
        />
        <ApolloProvider client={client}>
          <Navigator />
        </ApolloProvider>
      </View>
    );
  }
}

export default connect(App);
