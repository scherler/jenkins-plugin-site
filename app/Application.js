/** @flow */
import {
  actions,
  totalSize,
  isFetching,
  labelFilter,
  searchOptions,
  filterVisibleList,
  getVisiblePluginsLabels
} from './resources';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Card, CardWrapper } from './components/Card';
import Footer from './components/Footer';
import Header from './components/Header';
import Immutable from 'immutable';
import React, { PropTypes, Component } from 'react';
import Widget from './components/Widget';
import Highlighter from 'react-highlight-words';
import styles from './Application.css';

export default class Application extends Component {

  componentWillMount() {
    const { location } = this.props;
    this.props.generatePluginData(location.query);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.location.query !== this.props.location.query) {
      this.props.generatePluginData(nextProps.location.query);
    }
  }

  render() {
    const {
      generatePluginData,
      setFilter,
      filterVisibleList,
      browserHistory,
      totalSize,
      searchOptions,
      getVisiblePluginsLabels,
      searchPluginData,
      isFetching,
      location,
      labelFilter
    } = this.props;

    return (
        <Widget
          searchOptions={searchOptions}
          location={location}
          generateData={generatePluginData}
          browserHistory={browserHistory}
          setFilter={setFilter}
          getVisiblePlugins={filterVisibleList}
          totalSize={totalSize}
          isFetching = {isFetching}
          searchData={searchPluginData}
          getVisiblePluginsLabels={getVisiblePluginsLabels}
          labelFilter={labelFilter}
        />
    );
  }
}

Application.propTypes = {
  generatePluginData: PropTypes.func.isRequired,
  setFilter: PropTypes.func.isRequired,
  browserHistory: PropTypes.object.isRequired,
  filterVisibleList: PropTypes.any.isRequired,
  totalSize: PropTypes.any.isRequired,
  getVisiblePluginsLabels: PropTypes.any.isRequired,
  searchOptions: PropTypes.any.isRequired,
  searchPluginData: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
  labelFilter: PropTypes.any.isRequired
};

const selectors = createSelector(
  [ totalSize, isFetching, labelFilter, filterVisibleList, getVisiblePluginsLabels, searchOptions],
  ( totalSize, isFetching, labelFilter, filterVisibleList, getVisiblePluginsLabels, searchOptions) => ({
    totalSize,
    isFetching,
    labelFilter,
    filterVisibleList,
    getVisiblePluginsLabels,
    searchOptions
  })
);

export default connect(selectors, actions)(Application);
