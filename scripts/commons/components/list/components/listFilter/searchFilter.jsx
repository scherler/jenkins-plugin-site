import React, {Component} from 'react';
import  {getSearchPreset} from './urlFilterPresetter';
import {parseQS} from '../../../../router/router';

export default class DefaultListFilter extends Component {
  constructor() {
    super();
    var token = getSearchPreset(
      parseQS(window.location.search)
    );
    if (token && this.props && this.props.onChange) {
      this.props.onChange(token);
    }

    this.state = {
      searchToken: token,
      open: false
    };
  };

  static propTypes = {
    label: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    onChange: React.PropTypes.func.isRequired,
    onToggle: React.PropTypes.func
  };

  static defaultProps = {
    placeholder: '...search',
    onChange: function () {
    },
    onToggle: function () {
    }
  };

  render() {
    return (
      <div className="form-group search">
        <div className="search-toggle">
          <button
            className="btn btn-fill"
            onClick={(e) => {
            var wasOpen = this.state.open;
            this.setState({ open: !this.state.open });
            if (!wasOpen) this.refs.searchInput.focus();
            if (wasOpen) this.refs.searchInput.blur();
            this.props.onToggle();
          }}>
            <i className="kaba-icon-search" />
            <span
              style={{textTransform: 'none'}}
              className="filter-label">
              {this.props.label}
            </span>
          </button>
        </div>
        <input
          ref="searchInput"
          type="text"
          name="search"
          placeholder={this.props.placeholder}
          value={this.state.searchToken}
          onChange={(evt) => {
            this.props.onChange(evt.target.value);
            this.setState({ searchToken: evt.target.value });
          }}/>
      </div>
    );
  }
};
