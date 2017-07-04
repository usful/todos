import React, { Component } from 'React';
import { TouchableOpacity, Text } from 'react-native';

export default class CheckBox extends Component {

  render() {
    const { onPress } = this.props;
    const backgroundColor = this.props.checked ? 'green' : 'transparent';

    const touchStyle = {
      backgroundColor,
      borderWidth: 2,
      borderColor: 'green',
      width: 40,
      height: 40,
    };

    return (
      <TouchableOpacity style={touchStyle} onPress={onPress} />
    );
  }
}
