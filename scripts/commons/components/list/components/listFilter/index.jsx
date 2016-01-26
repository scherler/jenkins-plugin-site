import React from 'react';
import { parseQS } from '../../../../router/router';
import classNames from 'classnames';
import { default as SearchFilter } from './searchFilter';
import  { presetFilters } from './urlFilterPresetter';
import  { stateFilter as StateFilter } from './stateFilter';
import  { buildStateQuery, buildSearchQuery } from './queryBuilder';
import  env from '../../../../utils/env';
import  PageTitle from '../../../../page/PageTitle';

function hasQuery(filter) {
  return (filter.$and && filter.$and.length) || (filter.$or && filter.$or.length);
}

var ListFilter = React.createClass({

  propTypes: {
    pageTitle: React.PropTypes.string,
    showBackButton: React.PropTypes.bool,
    searchLabel: React.PropTypes.string,
    filterLabel: React.PropTypes.string,
    searchFields: React.PropTypes.array,
    searchPlaceholder: React.PropTypes.string,
    stateFilters: React.PropTypes.array,
    onSearchChange: React.PropTypes.func
  },

  getDefaultProps: function () {
    return {
      searchPlaceholder: '...search',
      searchFields: [],
      stateFilters: [],
      pageTitle: '',
      showBackButton: true,
      onSearchChange: function () {
      }
    };
  },

  getInitialState: function () {

    var presetResult = presetFilters(this.props.stateFilters, parseQS(window.location.search));

    return {
      searchToken: '',
      filterState: '',
      searchOpen: this.props.pageTitle ? false : true,
      filterActive: false,
      stateFilters: presetResult
    };
  },

  componentWillMount: function() {
    this.presetStateFilters(this.props);
  },

  componentWillReceiveProps: function (nextprops) {
    if (nextprops.pageTitle && !this.props.pageTitle) {
      // if pageTitle is set the first time, close search (happens if you pass in a translated pageTitle and start the client application)
      this.setState({
        searchOpen: false
      });
    }
    this.presetStateFilters(nextprops);
  },

  presetStateFilters: function(props) {
    // if not set stateFilters set them with preset by query - else just update the state
    //if (!this.state.stateFilters) {
      var presetResult = presetFilters(props.stateFilters, parseQS(window.location.search));

      this.setState({
        stateFilters: presetResult,
        didPreset: presetResult.didPreset,
        filterMenuOpen: this.state.filterMenuOpen || presetResult.didPreset,
      });
    //}
  },

  handleSearchFilter: function (token) {
    var self = this;
    this.setState({searchToken: token}, function () {
      self.trigger();
    });
  },

  handleStateFilter: function (selection) {
    var self = this;
    this.setState({filterState: selection}, function () {
      self.trigger();
    });
  },

  toggleFilterMenu: function () {
    this.setState({filterMenuOpen: !this.state.filterMenuOpen});
  },

  toggleSearch: function () {
    if (!this.props.pageTitle) return;
    this.setState({searchOpen: !this.state.searchOpen});
  },

  trigger: function () {
    var { searchToken, filterState, stateFilters } = this.state;
    var searchQuery = buildSearchQuery(this.props.searchFields, searchToken);
    var stateQuery = buildStateQuery(stateFilters, filterState);

    var q = {};
    if (hasQuery(searchQuery) && hasQuery(stateQuery)) {
      q = {$and: [searchQuery, stateQuery]};
    } else if (hasQuery(searchQuery)) {
      q = searchQuery;
    } else if (stateQuery.$and.length) {
      q = stateQuery;
    }

    // filter active
    var active = stateQuery.$and.length ? true : false;
    this.setState({filterActive: active});

    this.props.onSearchChange(q, { searchToken, filterState });
  },

  renderFilterToggle: function () {
    if (!this.state.stateFilters || !this.state.stateFilters.length) {
      return null;
    }

    return (
      <div className="form-group filter-toggle">
        <button className="btn btn-fill" onClick={this.toggleFilterMenu}>
          <i className="kaba-icon-filter"/>
          <span style={{textTransform: 'none'}} className="filter-label">{this.props.filterLabel}</span>
        </button>
      </div>
    );

  },

  renderSearch: function () {
    if (!this.props.searchFields || !this.props.searchFields.length) {
      return null;
    }

    return (
      <SearchFilter label={this.props.searchLabel}
                    onToggle={this.toggleSearch}
                    placeholder={this.props.searchPlaceholder}
                    onChange={this.handleSearchFilter}/>
    );
  },

  renderFilterMenu: function () {
    if (!this.state.stateFilters || !this.state.stateFilters.length) {
      return null;
    }

    return (
      <StateFilter filters={this.state.stateFilters} onChange={this.handleStateFilter} didPreset={this.state.didPreset} />
    );
  },

  renderPageTitle: function () {
    if (!this.props.pageTitle) {
      return null;
    }

    return (
      <PageTitle label={this.props.pageTitle} showBackButton={this.props.showBackButton} backButtonNavigateTo={this.props.backButtonNavigateTo}/>
    );
  },

  render: function () {

    var filterClass = classNames({
      'list-filter': true,
      'search-active': this.state.searchToken,
      'filter-active': this.state.filterActive,
      'has-filter': this.state.stateFilters && this.state.stateFilters.length,
      'filters-open': this.state.filterMenuOpen,
      'search-open': this.state.searchOpen && this.props.searchFields.length,
      'has-navback': this.props.showBackButton
    });

    return (
      <div className={filterClass}>
        <div className='flex'>
          <div className="flex-grow-9 list-filter-upper-wrapper">
            {this.renderPageTitle()}
            {this.renderSearch()}
            {this.renderFilterToggle()}
          </div>
          {this.props.children}
        </div>
        {this.renderFilterMenu()}
      </div>
    );
  }
});

module.exports = ListFilter;
