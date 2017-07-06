import React, { Component } from 'react';
import { View, Text, StatusBar } from 'react-native';
import connect from '../../connect';

export default connect(class SplashScreen extends Component {

  navigate = () => {
    if (this.props.store.user.isAuthenticated) {
      this.props.navigation.navigate('Home');
    } else {
      this.props.navigation.navigate('Login');
    };
  }

  constructor(props) {
    super(props);
    this.props.addStoreListener('initialized',this.navigate);
  }

  componentWillMount(){
    if(this.props.store.initialized) {
      this.navigate();
    }
  }

  render() {
    return (
      <View>
        <StatusBar backgroundColor="#e26e64" barStyle="light-content" />
        <Text>Loading...</Text>
      </View>
    );
  }
});
