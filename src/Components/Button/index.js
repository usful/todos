import React, { Component } from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import styles from './styles';
import chroma from 'chroma-js';

export default class Button extends Component {
  static defaultProps = {
    disabled: false,
    loading: false,
    onPress: () => {},
    text: 'Submit',
    color: '#e26e64',
    inverted: false
  };

  get containerStyle() {
    return [styles.container, this.props.inverted ? {
      borderWidth: 1,
      borderColor: this.props.color,
      backgroundColor: 'transparent'
    } : {
      borderWidth: 0,
      backgroundColor: this.props.color
    }];
  }

  get textStyle() {
    return [
      styles.text, this.props.inverted ? {
        color: this.props.color
      } : {
        color: chroma(this.props.color).luminance() < 0.4 ? 'white' : 'black'
      },
      {
        paddingLeft: !!this.props.children ? 10 : 0
      }
    ]
  }

  render() {
    return (
      <TouchableOpacity
        disabled={this.props.disabled || this.props.loading}
        onPress={this.props.onPress}
        style={this.containerStyle}
      >
        {this.props.loading ? <ActivityIndicator animating /> : null}
        {this.props.children}
        <Text style={this.textStyle}>
          {this.props.text}
        </Text>
      </TouchableOpacity>
    );
  }
}
