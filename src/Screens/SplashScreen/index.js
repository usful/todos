import React, { Component } from 'react';
import { View, Text } from 'react-native';
import connect from '../../connect';

export default connect(class SplashScreen extends Component {

  navigate = () => {
    if (this.props.store.user.isAuthenticated) {
      this.props.navigation.navigate('Home');
    } else {
      this.props.navigation.navigate('Auth');
    };
  }

  constructor(props) {
    super(props);
    this.props.addStoreListener('initialized',this.navigate);
  }

  componentWillMount() {
    if (this.props.store) {
      this.navigate();
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
