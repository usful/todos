import React, { Component } from "React";
import Icon from "react-native-vector-icons/FontAwesome";
import { TouchableOpacity, Text } from "react-native";
import styles from './styles';

export default class CheckBox extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      onPress,
      checked,
      color,
      checkColor,
      borderColor,
    } = this.props;
    const backgroundColor = checked ? color || "green" : "transparent";

    const touchStyle = {
      backgroundColor,
      borderColor: borderColor || "green",
    };

    return (
      <TouchableOpacity style={[touchStyle, styles.checkbox]} onPress={onPress}>
        {checked ? <Icon name="check" color={"white" || checkColor} /> : null}
      </TouchableOpacity>
    );
  }
}
