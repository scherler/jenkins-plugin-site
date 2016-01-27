/** @flow */
import Immutable from 'immutable'
import styles from './Widget.css'
import React, { PropTypes } from 'react'
import { VirtualScroll } from 'react-virtualized'

Widget.propTypes = {
  generateData: PropTypes.func.isRequired,
  recordIds: PropTypes.any.isRequired,
  recordsMap: PropTypes.any.isRequired,
  rowRenderer: PropTypes.any.isRequired,
  searchData: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
}
export default function Widget ({
  generateData,
  recordIds,
  recordsMap,
  rowRenderer,
  searchData,
  title
}) {
  const totalSize = recordsMap instanceof Immutable.Collection
    ? recordsMap.size
    : Object.keys(recordsMap).length
  const filteredSize = recordIds instanceof Immutable.Collection
    ? recordIds.size
    : recordIds.length
    
  return (
    <div>
      
        {totalSize > 0 &&
          <small className={styles.ResultsSummary}>
            {filteredSize} of {totalSize}
          </small>
        }
      <div className={styles.ControlBar}>

        <input
          disabled={recordsMap.size === 0}
          className={styles.SearchInput}
          onChange={event => searchData(event.target.value)}
          placeholder='Search..'
        />
      </div>
      <div onClick={
          function(){
            document.getElementById('plugin-spinner').className = "spinner"
            generateData()
          }
        }>
      
      <VirtualScroll
        className={styles.VirtualScroll + ' grid-box'}
        height={600}
        rowHeight={20}
        noRowsRenderer={() => (
          <div className={styles.noRows}>
            <div id="plugin-spinner">
              Click to load
              <div className="double-bounce1"></div>
              <div className="double-bounce2"></div>
            </div>
          </div>
        )}
        rowsCount={filteredSize}
        rowRenderer={rowRenderer}
      /></div>
    </div>
  )
}
