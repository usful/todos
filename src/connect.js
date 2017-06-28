import React, { Component } from 'react';
import { EventEmitter } from 'events';
import _ from 'lodash';
import initialState from './initialState';

class Store extends EventEmitter {
  constructor() {
    super();
    this.state = initialState;
    this.updateState = this.updateState.bind(this);
  }

  getState() {
    return this.state;
  }

  updateState(newState) {
    console.log('udating stote state');
    _.merge(this.state, newState);
    this.emit('updated');
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
          {...this.props}
        />
      );
    }
  }

  return HOCComponent;
}

export default connect;
