import React, { PropTypes } from 'react';
import PureComponent from 'react-pure-render/component';

export default class Searchbox extends PureComponent {

  static propTypes = {
    browserHistory: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    limit: PropTypes.number.isRequired
  }

  render() {
    return (
      <div>
        <input
          ref="searchInput"
          defaultValue={this.props.location.query.q}
          placeholder="search..."
          />
        {this.props.limit && <input
          ref="limit"
          defaultValue={this.props.limit}
          placeholder="limit..."
          />}
        <button onClick={() => {
          this.props.location.query = {
            q: this.refs.searchInput.value,
            limit: this.refs.limit.value
          };
          this.props.browserHistory.push(this.props.location);
         }
        }>
          search
        </button>
      </div>
      );
  }
}
