import React, {Component} from 'react';
import uuid from 'uuid';

export default class ListFooter extends Component {

  static propTypes = {
    columns: React.PropTypes.number
  };

  static defaultProps = {
    columns: 0
  };

  state ={
    keyId: uuid.v4()
  };

  render() {
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
};
