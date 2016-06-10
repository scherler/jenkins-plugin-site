import React, { Component, PropTypes } from 'react';
import { Provider } from 'react-redux';
import createAppStore from './createAppStore';

// store workaround to export app even if no document is active
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

let store;
if (typeof document !== 'undefined' && typeof window !== 'undefined') {
  store = createAppStore();
  console.log('win')
} else {
  const middlewares = [ thunk ];
  const mockStore = configureMockStore(middlewares);
  store = mockStore({});
  console.log('mock')
}

const { node } = PropTypes;

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div>
           {React.cloneElement(this.props.children, { ...this.props })}
        </div>
      </Provider>
    );
  }
}

App.propTypes = {
  children: node,
};

export default App;
