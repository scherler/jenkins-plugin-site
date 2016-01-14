import React, {Component} from 'react';
import uuid from 'uuid';

export default class ListColumnDefinition extends Component {
  static propTypes = {
    headers: React.PropTypes.array.isRequired
  };

  static defaultProps = {
    columns: 0
  };

  state = {
    keyId: uuid.v4()
  };

  render() {
    return (
      <li style={{display: 'table-row'}}>
        {
          this.props.headers.map(function(item, i) {
            return <div style={{display: 'table-cell'}} key={this.state.keyId + '_' + i}>{item}</div>;
          }, this)
        }
      </li>
    );
  }
};
