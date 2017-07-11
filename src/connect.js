import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import { EventEmitter } from 'events';
import _ from 'lodash';
import initialState from './initialState';

class Store extends EventEmitter {
  constructor() {
    super();

    this._state = initialState;

    this.setup();
  }

  async setup() {
    const strState = await AsyncStorage.getItem('app:state');

    try {
      await this.updateState(JSON.parse(strState));
      await this.updateState({ initialized: true });
      this.emit('initialized');
    } catch (err) {
      console.error('error parsing store state ', e);
    }
  }

  get state() {
    return this._state;
  }

  async updateState(newState) {
    _.merge(this._state, newState);

    console.log('store update', this._state);

    await AsyncStorage.setItem('app:state', JSON.stringify(this._state));

    this.emit('updated');

    console.log('AsyncStorage updated');
  }
}

const store = new Store();

function connect(BaseComponent) {
  class HOCComponent extends Component {
    constructor(props) {
      super(props);

      this.state = { renderCount: 0 };

      this.listener = () => this.updateComponent();
    }

    updateComponent() {
      this.setState({ renderCount: ++this.state.renderCount });
    }

    componentDidMount() {
      store.on('updated', this.listener);
    }

    componentWillUnmount() {
      store.removeListener('updated', this.listener);
    }

    render() {
      return (
        <BaseComponent
          store={store.state}
          updateStore={state => store.updateState(state)}
          addStoreListener={(eventString, handler) =>
            store.on(eventString, handler)}
          {...this.props}
          renderCount={this.state.renderCount}
        />
      );
    }
  }

  return HOCComponent;
}

export default connect;
