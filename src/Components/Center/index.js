import React, { Component } from 'react';
import { View } from 'react-native';
import styles from './styles';

export default class Center extends Component {
  render() {
    return (
      <View style={styles.center} {...this.props} />
    );
  }
}
