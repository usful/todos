import React, { Component } from 'react';
import { View } from 'react-native';
import styles from './styles';

export default class Right extends Component {
  render() {
    return (
      <View style={styles.right} {...this.props} />
    );
  }
}
