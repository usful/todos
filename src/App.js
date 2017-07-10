import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { View, StyleSheet } from 'react-native';
import {
  SubscriptionClient,
  addGraphQLSubscriptions
} from 'subscriptions-transport-ws';
import {
  LoginScreen,
  HomeScreen,
  RegisterScreen,
  SplashScreen,
  ListScreen,
  TodoScreen
} from './Screens';
import { scapholdUrl, scapholdWebSocketUrl } from './config';
import connect from './connect';

const wsClient = new SubscriptionClient(scapholdWebSocketUrl, {
  reconnect: true
});

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  createNetworkInterface({ uri: scapholdUrl }),
  wsClient
);

const client = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions
});

const genAuthMiddleWare = app => {
  return {
    applyMiddleware(req, next) {
      if (!req.options.headers) {
        req.options.headers = {};
      }
      if (app.props.store.user.isAuthenticated) {
        req.options.headers['authorization'] = `Bearer ${app.props.store.user
          .token}`;
      }
      next();
    }
  };
};

const AuthNavigator = StackNavigator(
  {
    Splash: { screen: SplashScreen },
    Login: { screen: LoginScreen },
    Register: { screen: RegisterScreen }
  },
  {
    headerMode: 'none',
    initialRouteName: 'Splash'
  }
);

const HomeNavigator = StackNavigator(
  {
    Home: { screen: HomeScreen },
    List: { screen: ListScreen },
    Todo: { screen: TodoScreen }
  },
  {
    headerMode: 'none',
    initialRouteName: 'Home'
  }
);

const Navigator = StackNavigator(
  {
    Auth: { screen: AuthNavigator },
    Home: { screen: HomeNavigator }
  },
  {
    headerMode: 'none',
    initialRouteName: 'Auth'
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1
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
        <ApolloProvider client={client}>
          <Navigator onNavigationStateChange={null} />
        </ApolloProvider>
      </View>
    );
  }
}

export default connect(App);
