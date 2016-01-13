import React from 'react';
import uuid from 'uuid';

var ListColumnDefinition = React.createClass({

  propTypes: {
    headers: React.PropTypes.array.isRequired
  },

  getDefaultProps: function() {
    return { columns: 0 };
  },

  getInitialState: function() {
    return { keyId: uuid.v4() };
  },

  render: function() {
    return (
      <li className='list-header'>
        {
          this.props.headers.map(function(item, i) {
            return <div key={this.state.keyId + '_' + i}>{item}</div>;
          }, this)
        }
      </li>
    );
  }
});

module.exports = ListColumnDefinition;
