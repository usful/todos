import React, { Component } from 'react';
import { TouchableOpacity, View, Text, ActivityIndicator } from 'react-native';
import styles from './styles';

export default class Button extends Component {
  static defaultProps = {
    disabled: false,
    loading: false,
    onPress: () => {},
    text: 'Submit'
  };
  
  render() {
    return (
      <TouchableOpacity
        disabled={this.props.disabled || this.props.loading}
        onPress={this.props.onPress}
        style={styles.touchable}
      >
        <View style={styles.container}>
          {this.props.loading ? <ActivityIndicator animating/> : null}
          <Text style={styles.text}>{this.props.text}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}
