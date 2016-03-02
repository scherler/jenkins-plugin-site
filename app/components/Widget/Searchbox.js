import React, { PropTypes } from 'react';
import { logger } from '../../commons';
import PureComponent from 'react-pure-render/component';

export default class Searchbox extends PureComponent {

  static propTypes = {
    browserHistory: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    limit: PropTypes.number.isRequired
  }

  handleClick = (data, limit) => {
    this.props.location.query= {
      q: data.value,
      limit: limit.value
    };
    logger.log(this.props.location);
    this.props.browserHistory.replace(this.props.location);
  }

  render() {
    return (
      <div>
        <input
          ref='searchInput'
          defaultValue={this.props.location.query.q}
          placeholder='search...'
          />
        {this.props.limit && <input
          ref='limit'
          defaultValue={this.props.limit}
          placeholder='limit...'
          />}
        <button onClick={this.handleClick.bind(null, this.refs.searchInput, this.refs.limit)}>
          search
        </button>
      </div>
      );
  }
}
