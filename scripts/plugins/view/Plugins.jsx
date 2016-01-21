
import Immutable from 'immutable';
import React, { Component, PropTypes } from 'react';
import Highlighter from 'react-highlight-words'
import { connect } from 'react-redux';
import PluginItem from './PluginsItem';
import { fetchPluginsIfNeeded } from '../actions';
import { createSelector } from 'reselect'
import { createSearchAction, getSearchSelectors } from 'redux-search'
import keymirror from 'keymirror'
import { actions, dataSearchText, filteredIdArray,  plugin } from '../search'

PluginList.propTypes = {
  dataSearchText: PropTypes.string.isRequired,
  generateData: PropTypes.func.isRequired,
  filteredIdArray: PropTypes.array.isRequired,
  searchData: PropTypes.func.isRequired,
  plugins: PropTypes.object.isRequired,
  search: PropTypes.object.isRequired,
  isFetching: PropTypes.bool.isRequired,
  lastUpdated: PropTypes.number,
  dispatch: PropTypes.func.isRequired
}

export default function PluginList ({
  dataSearchText,
  generateData,
  filteredIdArray,
  plugin,
  searchData
}) {
    const { isFetching, lastUpdated, plugins, search } = this.props
    let
      listSize = plugins.items.size,
      subjects = plugins.items.toArray ? plugins.items.toArray(): [];

    console.log("crash", this.props);
    return (
      <div
        style={{paddingTop: '10px'}}
        className="content content-list row">
        <div>
          Here we will use only one general component "List"
          and then use callbacks to render each item.

        </div>
        <p>
          {lastUpdated &&
            <span>
              Last updated at {new Date(lastUpdated).toLocaleTimeString()}.
              {' '}
            </span>
          }
        </p>
          <div style={{paddingTop: '10px'}} className="list">
            {isFetching ? <Spinner /> :
                <p>xxx</p>
              }
          </div>


      </div>
    );
}

function mapStateToProps(state) {
  const { plugins, search } = state;
  const {
    isFetching,
    lastUpdated,
    items: items
  } = plugins || {
    isFetching: true,
    items: []
  };

  return {
    search,
    plugins,
    isFetching,
    lastUpdated
  }
}

export default connect(mapStateToProps)(PluginList);
