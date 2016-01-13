import React from 'react';
import  urlFilterPreselector from './urlFilterPresetter';
import router from '../../../../router/router';

var DefaultListFilter = React.createClass({
  propTypes: {
    label: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    onChange: React.PropTypes.func.isRequired,
    onToggle: React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      placeholder: '...search',
      onChange: function () {
      },
      onToggle: function () {
      }
    };
  },

  toggleSearch: function(e) {
    var wasOpen = this.state.open;
    this.setState({ open: !this.state.open });
    if (!wasOpen) this.refs.searchInput.focus();
    if (wasOpen) this.refs.searchInput.blur();
    this.props.onToggle();
  },

  getInitialState: function() {

    var token = urlFilterPreselector.getSearchPreset(router.parseQS(window.location.search));

    if (token) {
      this.props.onChange(token);
    }

    return {
      searchToken: token,
      open: false
    };
  },

  handleChange: function(evt) {
    this.props.onChange(evt.target.value);

    this.setState({ searchToken: evt.target.value });
  },

  render: function() {
    return (
      <div className="form-group search">
        <div className="search-toggle">
          <button className="btn btn-fill" onClick={this.toggleSearch}><i className="kaba-icon-search" />
            <span style={{textTransform: 'none'}} className="filter-label">{this.props.label}</span>
          </button>
        </div>
        <input ref="searchInput" type="text" name="search" placeholder={this.props.placeholder} value={this.state.searchToken} onChange={this.handleChange}/>
      </div>
    );
  }
});

module.exports = DefaultListFilter;
