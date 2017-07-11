import React, { Component } from "React";
import Icon from "react-native-vector-icons/FontAwesome";
import { TouchableOpacity, Text } from "react-native";
import styles from './styles';

export default class CheckBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: props.checked,
    }
  }

  componentDidUpdate() {
    if (this.props.checked !== this.state.checked) {
      this.setState({checked: this.props.checked});
    }
  }

  render() {
    const {
      onPress,
      color,
      checkColor,
      borderColor,
    } = this.props;
    const {
      checked
    } = this.state;
    const backgroundColor = checked ? color || "green" : "transparent";

    const touchStyle = {
      backgroundColor,
      borderColor: borderColor || "green",
    };

    return (
      <TouchableOpacity style={[touchStyle, styles.checkbox]} onPress={() => {
        this.setState({checked:!checked});
        onPress();
      }}>
        {checked ? <Icon name="check" color={"white" || checkColor} /> : null}
      </TouchableOpacity>
    );
  }
}
