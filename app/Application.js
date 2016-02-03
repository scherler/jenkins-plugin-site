/** @flow */
import {
  actions,
  searchText,
  filteredList,
  plugins,
  isFetching,
  labelFilter
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
  searchText: PropTypes.string.isRequired,
  generatePluginData: PropTypes.func.isRequired,
  filteredList: PropTypes.instanceOf(Immutable.List).isRequired,
  searchText: PropTypes.string.isRequired,
  plugins: PropTypes.any.isRequired,
  searchPluginData: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  labelFilter: PropTypes.any.isRequired
}
export default function Application ({
  generatePluginData,
  filteredList,
  searchText,
  plugins,
  searchPluginData,
  isFetching,
  labelFilter
}) {
  return (
      <Widget
        generateData={generatePluginData}
        recordIds={filteredList}
        recordsMap={plugins}
        searchData={searchPluginData}
        labelFilter={labelFilter}
        title={'Loading ' + isFetching}
      />

  )
}

const selectors = createSelector(
  [filteredList, searchText, plugins, isFetching, labelFilter],
  (filteredList, searchText, plugins, isFetching, labelFilter) => ({
    filteredList,
    searchText,
    plugins,
    isFetching,
    labelFilter
  })
)

export default connect(selectors, actions)(Application)
