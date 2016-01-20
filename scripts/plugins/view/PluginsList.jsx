/*
 * FIXME: HACK to make the JSON-P call work INFRA-543.
 * As soon CORS works uncomment the store code and
 * remove all lines marks as HACK
 */

import listComponent from '../../commons/components/list/index';
import Immutable from 'immutable';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import PluginItem from './PluginsItem';
import { utils } from '../../commons';
import logger from '../../commons/utils/logger';
import { fetchPluginsIfNeeded } from '../actions';


const { ListFilter, List, ListSpinner: Spinner} = listComponent.components;
const { env } = utils;

if (env.isBrowser)
  require('../../commons/style/common.styl');

const config = {
  // keys on each subject that will be searched on
  searchKeys: ['title', 'name'],
};

class PluginList extends Component {

  /*mixins: [listComponent.mixins.filter],//FIXME refactor: dropping mixins and swith to ES6

  componentWillMount: function () {
    this.setFilter(function (query) {
      return listComponent.sift(query);
    });

    this.setSort(function (field, reverse, primer) {
      if (!field) {
        field = 'name';
      } // default sort
      return listComponent.sortBy(field, reverse, primer);
    });

    this.setListToFilter('plugins');
  },*/

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchPluginsIfNeeded());
    //this.setFetchStore(pluginStore, 'Plugins');
  }
  /*
  onStoreChange() {
    this.setState(this.getInitialState());
    this.updateFilter();
  },
*/

  asPluginItem (item) {
    return (
      <PluginItem plugin={item} key={item.sha1}/>
    );
  }

  render () {
    const { isFetching, lastUpdated, plugins } = this.props
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
        <ListFilter
          searchFields={config.searchKeys}
          searchPlaceholder={'searchPlaceholder'}
          onSearchChange={this.onFetchFilterChange} />

          <div style={{paddingTop: '10px'}} className="list">
            {isFetching ? <Spinner /> :
                <List headers={['Plugin', 'Title', '']}
                hasEntries={!!listSize}
                collection={plugins.items} mapItem={this.asPluginItem}/>
              }
          </div>


      </div>
    );
  }
}

PluginList.propTypes = {
  plugins: PropTypes.object.isRequired,
  isFetching: PropTypes.bool.isRequired,
  lastUpdated: PropTypes.number,
  dispatch: PropTypes.func.isRequired
};


function mapStateToProps(state) {
  const { plugins} = state;
  const {
    isFetching,
    lastUpdated,
    items: items
  } = plugins || {
    isFetching: true,
    items: []
  };

  return {
    plugins,
    isFetching,
    lastUpdated
  }
}


export default connect(mapStateToProps)(PluginList);
