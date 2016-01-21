/** @flow */
import { actions, dataSearchText, filteredIdArray, filteredIdList, immutableDataSearchText, immutableMap, map } from './resources'
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
  dataSearchText: PropTypes.string.isRequired,
  generateData: PropTypes.func.isRequired,
  generateImmutableData: PropTypes.func.isRequired,
  filteredIdArray: PropTypes.array.isRequired,
  filteredIdList: PropTypes.instanceOf(Immutable.List).isRequired,
  immutableDataSearchText: PropTypes.string.isRequired,
  immutableMap: PropTypes.any.isRequired,
  map: PropTypes.object.isRequired,
  searchData: PropTypes.func.isRequired,
  searchImmutableData: PropTypes.func.isRequired
}
export default function Application ({
  dataSearchText,
  generateData,
  generateImmutableData,
  filteredIdArray,
  filteredIdList,
  immutableDataSearchText,
  immutableMap,
  map,
  searchData,
  searchImmutableData
}) {
  console.log("crash", dataSearchText,
  generateData,
  generateImmutableData,
  filteredIdArray,
  filteredIdList,
  immutableDataSearchText,
  immutableMap,
  map,
  searchData,
  searchImmutableData);
  return (
    <div>
      <Header/>
      <CardWrapper>
        <Card>
          <p>
            This page shows a list of plugins registered in updates.jenkins-ci.org
            (<a href='https://updates.jenkins-ci.org/current/update-center.json'>View the source</a>.)
          </p>
        </Card>
      </CardWrapper>
      <CardWrapper>
        <Card>
          <Widget
            generateData={generateImmutableData}
            recordIds={filteredIdList}
            recordsMap={immutableMap}
            rowRenderer={
              index => {
                const plugin = immutableMap.get(filteredIdList.get(index))
                return (
                  <div
                    key={index}
                    className={styles.Row}
                  >
                    <Highlighter
                      highlightClassName={styles.Highlight}
                      searchWords={immutableDataSearchText.split(/\s+/)}
                      textToHighlight={`${plugin.name}, ${plugin.title}`}
                    />
                  </div>
                )
              }
            }
            searchData={searchImmutableData}
            title={'List of Plugins'}
          />
        </Card>
      </CardWrapper>
      <Footer/>
    </div>
  )
}

const selectors = createSelector(
  [dataSearchText, filteredIdArray, filteredIdList, immutableDataSearchText, immutableMap, map],
  (dataSearchText, filteredIdArray, filteredIdList, immutableDataSearchText, immutableMap, map) => ({
    dataSearchText,
    filteredIdArray,
    filteredIdList,
    immutableDataSearchText,
    immutableMap,
    map
  })
)

export default connect(selectors, actions)(Application)
