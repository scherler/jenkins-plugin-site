import React, { Component, PropTypes } from 'react';

const { any } = PropTypes;

class App extends Component {
  render() {
    return (
      <div>
          {this.props.children }
      </div>
    );
  }
}

App.propTypes = {
  children: any,
};

export default App;
