import React, { Component } from 'react';
import { View } from 'react-native';
import styles from './styles';

export default class Left extends Component {
  render() {
    return (
      <View style={styles.left} {...this.props} />
    );
  }
}
