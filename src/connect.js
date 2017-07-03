import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import { EventEmitter } from 'events';
import _ from 'lodash';
import initialState from './initialState';

class Store extends EventEmitter {
  constructor() {
    super();
    this.state = initialState;
    this.updateState = this.updateState.bind(this);
    AsyncStorage.getItem('app:state')
    .then((strState) => {
      try {
        loadedState = JSON.parse(strState);
        this.updateState(loadedState);
      } catch(e) {
        console.log('error parsing store state ', e);
      }
    });
    this.emit('intialized');
  }

  getState() {
    return this.state;
  }

  updateState(newState) {
    _.merge(this.state, newState);
    console.log('store update', this.state);
    this.emit('updated');

    const strState = JSON.stringify(this.state);
    AsyncStorage.setItem('app:state', strState)
    .then(() => console.log('AsyncStorage updated'));
  }
}

const store = new Store();

function connect(BaseComponent) {
  class HOCComponent extends Component {
    constructor(props) {
      super(props);
      this.updateComponent = this.updateComponent.bind(this);
      this.state = { renderCount: 0 };
    }

    updateComponent() {
      this.setState({ renderCount: ++this.state.renderCount });
    }

    componentDidMount() {
      store.on('updated', this.updateComponent);
    }

    componentWillUnmount() {
      store.removeListener('updated', this.updateComponent);
    }

    render() {
      return (
        <BaseComponent
          store={store.getState()}
          updateStore={store.updateState}
          addStoreListener={(eventString, handler) => {store.on(eventString,handler)}}
          {...this.props}
          renderCount={this.state.renderCount}
        />
      );
    }
  }

  return HOCComponent;
}

export default connect;
