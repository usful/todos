import React, { Component } from 'react';
import { View, Text } from 'react-native';
import connect from '../../connect';

export default connect(class SplashScreen extends Component {

  componentDidUpdate() {
    if (this.props.store.initialized) {
      setTimeout(() => {
        if (this.props.store.user.isAuthenticated) {
          this.props.navigation.navigate('Home');
        } else {
          this.props.navigation.navigate('Auth');
        }
      }, 500);
    }
  }

  render() {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }
});
