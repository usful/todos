import React, { Component } from "react";
import { Image, View, Text, TextInput as TI } from 'react-native';
import styles from './styles';

export default class TextInput extends Component {

  render() {
    return (
      <TI
        selectionColor={'white'}
        underlineColorAndroid={'white'}
        placeholderTextColor={'white'}
        style={styles.input}
        {...this.props}
      />
    );
  }
}
