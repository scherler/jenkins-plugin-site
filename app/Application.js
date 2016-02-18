/** @flow */
import {
  actions,
  totalSize,
  isFetching,
  labelFilter,
  filterVisibleList,
  getVisiblePluginsLabels
} from './resources';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Card, CardWrapper } from './components/Card';
import Footer from './components/Footer';
import Header from './components/Header';
import Immutable from 'immutable';
import React, { PropTypes } from 'react';
import Widget from './components/Widget';
import Highlighter from 'react-highlight-words';
import styles from './Application.css';

Application.propTypes = {
  generatePluginData: PropTypes.func.isRequired,
  setFilter: PropTypes.func.isRequired,
  filterVisibleList: PropTypes.any.isRequired,
  totalSize: PropTypes.any.isRequired,
  getVisiblePluginsLabels: PropTypes.any.isRequired,
  searchPluginData: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  labelFilter: PropTypes.any.isRequired
};
export default function Application({
  generatePluginData,
  setFilter,
  filterVisibleList,
  totalSize,
  searchPluginData,
  isFetching,
  labelFilter,
  getVisiblePluginsLabels
}) {
  return (
      <Widget
        generateData={generatePluginData}
        setFilter={setFilter}
        getVisiblePlugins={filterVisibleList}
        totalSize={totalSize}
        searchData={searchPluginData}
        getVisiblePluginsLabels={getVisiblePluginsLabels}
        labelFilter={labelFilter}
      />

  );
}

const selectors = createSelector(
  [ totalSize, isFetching, labelFilter, filterVisibleList, getVisiblePluginsLabels],
  ( totalSize, isFetching, labelFilter, filterVisibleList, getVisiblePluginsLabels) => ({
    totalSize,
    isFetching,
    labelFilter,
    filterVisibleList,
    getVisiblePluginsLabels
  })
);

export default connect(selectors, actions)(Application);
