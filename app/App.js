import React, { Component, PropTypes } from 'react';

const { any } = PropTypes;

export default class App extends Component {
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
