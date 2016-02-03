/** @flow */
import {
  actions,
  totalSize,
  isFetching,
  labelFilter,
  getVisiblePlugins,
  getVisiblePluginsLabels
} from './resources'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { Card, CardWrapper } from './components/Card'
import Footer from './components/Footer'
import Header from './components/Header'
import Immutable from 'immutable'
import React, { PropTypes } from 'react'
import Widget from './components/Widget'
import Highlighter from 'react-highlight-words'
import styles from './Application.css'

Application.propTypes = {
  generatePluginData: PropTypes.func.isRequired,
  totalSize: PropTypes.any.isRequired,
  getVisiblePlugins: PropTypes.any.isRequired,
  getVisiblePluginsLabels: PropTypes.any.isRequired,
  searchPluginData: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  labelFilter: PropTypes.any.isRequired
}
export default function Application ({
  generatePluginData,
  totalSize,
  searchPluginData,
  isFetching,
  labelFilter,
  getVisiblePlugins,
  getVisiblePluginsLabels
}) {
  return (
      <Widget
        generateData={generatePluginData}
        getVisiblePlugins={getVisiblePlugins}
        totalSize={totalSize}
        searchData={searchPluginData}
        labelFilter={getVisiblePluginsLabels}
        title={'Loading ' + isFetching}
      />

  )
}

const selectors = createSelector(
  [ totalSize, isFetching, labelFilter, getVisiblePlugins, getVisiblePluginsLabels],
  ( totalSize, isFetching, labelFilter, getVisiblePlugins, getVisiblePluginsLabels) => ({
    totalSize,
    isFetching,
    labelFilter,
    getVisiblePlugins,
    getVisiblePluginsLabels
  })
)

export default connect(selectors, actions)(Application)
