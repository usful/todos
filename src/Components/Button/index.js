import React, { Component } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import {StyleSheet} from 'react-native';
import styles from './styles';

export default class FormButton extends Component {
  render() {
    const style = {
      ...StyleSheet.flatten(this.props.style),
      ...StyleSheet.flatten(styles.touchable),
      ... (this.props.transparent ? {} :
        StyleSheet.flatten(styles.default))
  }

    return (
      <TouchableOpacity
        onPress={this.props.onPress}
        style={style}
      >
        <Text style={styles.text}>{this.props.text}</Text>
      </TouchableOpacity>
    );
  }
}
