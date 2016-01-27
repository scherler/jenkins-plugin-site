/** @flow */
import { actions, searchText, filteredList, plugins } from './resources'
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
  searchPluginData: PropTypes.func.isRequired
}
export default function Application ({
  generatePluginData,
  filteredList,
  searchText,
  plugins,
  searchPluginData
}) {

  return (
      <Widget
        generateData={generatePluginData}
        recordIds={filteredList}
        recordsMap={plugins}
        searchData={searchPluginData}
        title={'List of Plugins'}
      />

  )
}

const selectors = createSelector(
  [filteredList, searchText, plugins],
  (filteredList, searchText, plugins) => ({
    filteredList,
    searchText,
    plugins
  })
)

export default connect(selectors, actions)(Application)
