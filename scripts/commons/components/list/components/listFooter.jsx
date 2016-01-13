import React from 'react';
import uuid from 'uuid';

var ListFooter = React.createClass({

  propTypes: {
    columns: React.PropTypes.number
  },

  getDefaultProps: function() {
    return { columns: 0 };
  },

  getInitialState: function() {
    return { keyId: uuid.v4() };
  },

  render: function() {
    var arr = [];
    for (var i = 0, len = this.props.columns; i < len; i++) {
      arr.push(' ');
    }

    return (
      <li className='separator separator-gray'>
        {
          arr.map(function(item, i) {
            return <div key={this.state.keyId + '_' + i}></div>;
          }, this)
        }
      </li>
    );
  }
});

module.exports = ListFooter;
