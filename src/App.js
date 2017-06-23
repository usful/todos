
import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { LoginScreen } from './Screens';
import { scapholdUrl } from './config';

const client = new ApolloClient({
  networkInterface: createNetworkInterface({ uri: scapholdUrl })
})

const Navigator = StackNavigator({
    Login: { screen: LoginScreen },
});

export default class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <Navigator />
      </ApolloProvider>
    );
  }
}
