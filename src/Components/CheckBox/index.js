import React, { Component } from 'React';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TouchableOpacity, Text } from 'react-native';

export default class CheckBox extends Component {

  constructor(props){
    super(props);
    this.state={
      checked: this.props.checked
    }
  }

  render() {
    const { onPress } = this.props;
    const backgroundColor = this.state.checked ? this.props.color || 'green' : 'transparent';
    const checkColor = "white" || this.props.checkColor;

    const touchStyle = {
      backgroundColor,
      borderWidth: 1,
      borderRadius:5,
      borderColor: this.props.borderColor || 'green',
      width: this.props.width || 20,
      height: this.props.width || 20,
      alignItems:'center',
      justifyContent:'center',
    };

    return (
      <TouchableOpacity style={touchStyle} onPress={() => {
        this.setState({checked:!this.state.checked});
        onPress();
      }} >
        {
          this.state.checked ? <Icon name="check" color={checkColor}/> : null
        }
      </TouchableOpacity>
    );
  }
}
