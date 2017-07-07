import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Header, Left, Center, Right } from '../../Components';
import styles from './styles';

export default class MembersScreen extends Component {

  handleBackPress = () => {
    this.props.navigation.navigate('Home');
  }

  render() {
    return (
      <View>
        <Header>
          <Left>
            <TouchableOpacity onPress={this.handleBackPress}>
              <Icon name="chevron-left" size={30} />
            </TouchableOpacity>
          </Left>
          <Center>
            <Text>Members</Text>
          </Center>
          <Right>
            <TouchableOpacity onPress={this.handleBackPress}>
              <Icon name="add" size={30} />
            </TouchableOpacity>
          </Right>
        </Header>

        <View>
          <View>

          </View>
        </View>

      </View>
    );
  }
}
