/** @flow */
import Immutable from 'immutable'
import Entry from './Entry'
import styles from './Widget.css'
import React, { PropTypes } from 'react'
import {cleanTitle, getMaintainers, getScoreClassName} from '../../helper'
import { VirtualScroll } from 'react-virtualized'
import classNames from 'classnames'

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
      <button onClick={()=>  generateData()}>getPlugins</button>
      <div className={classNames(styles.VirtualScroll, 'grid-box')} >
        {totalSize > 0 && recordIds.valueSeq().map(id => {
          return <Entry key={recordsMap.get(id).id} plugin={recordsMap.get(id)} />
        })}
      </div>
    </div>
    )
}
