import React, { Component } from 'react';
import { TouchableOpacity, View, Text, ActivityIndicator } from 'react-native';
import styles from './styles';

export default class Button extends Component {
  static defaultProps = {
    disabled: false,
    loading: false,
    onPress: () => {},
    text: 'Submit',
  };

  render() {
    const {
      backgroundColor,
      borderColor,
      borderWidth,
      fontSize,
      fontColor,
      width,
      height
    } = this.props;
    const passedStyles = {
      containerStyle: {
        backgroundColor,
        borderColor,
        borderWidth,
        width,
        height,
      },
      textStyle: {
        fontSize,
        color:fontColor
      }
    }
    return (
      <TouchableOpacity
        disabled={this.props.disabled || this.props.loading}
        onPress={this.props.onPress}
        style={[styles.container, passedStyles.containerStyle]}
      >
        {this.props.loading ? <ActivityIndicator animating/> : null}
        <Text style={[styles.text, passedStyles.textStyle]}>{this.props.text}</Text>
      </TouchableOpacity>
    );
  }
}