import _ from 'lodash';
import React from 'react';

/**
 * Add static properties to your component.
 * Make sure this is the last HOC you apply to a component,
 * because other HOC's might wrap your component and make the statics invisible.
 */
const Statics = function (statics, Component) {
  return React.createClass({
    statics,

    render() {
      return React.createElement(
        Component,
        this.props
      );
    }
  });
};

export default _.curry(Statics);
