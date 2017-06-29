import React, { Component } from "react";
import { Image, View, Text, TextInput } from 'react-native';
import styles from './styles';

export default class FormTextInput extends Component {

  render() {
    return (
      <TextInput
        selectionColor={'white'}
        underlineColorAndroid={'white'}
        placeholderTextColor={'white'}
        style={styles.input}
        {...this.props}
      />
    );
  }
}
