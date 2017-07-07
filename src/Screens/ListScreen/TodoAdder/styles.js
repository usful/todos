import React, { Component } from 'react';
import { TextInput, Text, View, TouchableOpacity, Modal } from 'react-native';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import styles from './styles';

class TodoAdder extends Component {

  addNewTodo = async() => {
  };

  render() {
    const { visible, close } = this.props;
    return (
      <Modal
        animationType={"slide"}
        transparent={true}
        visible={visible}
        onRequestClose={close}
        style={styles.modal}
      >
        <View style={styles.container}>
          <View style={styles.content}>
            <TextInput
              style={styles.textInput}
              onChangeText={text => {}}
              onEndEditing={() => this.addNewTodo()}
              placeholder="Todo title..."
            />
            <TouchableOpacity onPress={() => this.addNewTodo()}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Create Todo</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={close}>
              <Text>Close modal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}