/*
 * FIXME: HACK to make the JSON-P call work INFRA-543.
 * As soon CORS works uncomment the store code and
 * remove all lines marks as HACK
 */
//import listComponent from '../../commons/components/list/index';
const listComponent = require('../../commons/components/list/index');
//import listComponent from '../../commons/components/list/index';
/*import listSpinner from '../../commons/components/list/components/listSpinner';
import list from '../../commons/components/list/components/list';*/
//import { connect } from '../../commons/hoc';
import Immutable from 'immutable';
import React from 'react';
import PluginItem from './PluginsItem'
import { utils } from '../../commons'
//import pluginStore from '../stores/pluginStore';  ListFilter,

const { List, ListSpinner: Spinner} = listComponent.components;
const { env } = utils;

// which fields do we want to search
const searchConfig = ['name', 'title', 'excerpt'];

if (env.isBrowser)
  require('../../commons/style/common.styl');

const PluginList = React.createClass({//FIXME refactor: dropping mixins and swith to ES6
  mixins: [listComponent.mixins.filter],

  getInitialState: function () {
    return {};
  },


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
  },

  componentDidMount: function () {

    let url = 'https://updates.jenkins-ci.org/current/update-center.json';
    this.jsonp(url, data => {this.transformPlugins(data.plugins); });//HACK
    //this.setFetchStore(pluginStore, 'Plugins');
  },
  /*
  onStoreChange() {
    this.setState(this.getInitialState());
    this.updateFilter();
  },
*/

  jsonp: function (url, callback) {// HACK
    let callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
    window.updateCenter = {
      post: function (data) {
        callback(data);
      }
    };

    let script = document.createElement('script');
    script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
    document.body.appendChild(script);
  },

  transformPlugins: function (plugins) {
    this.setState({plugins: new Immutable.List(_.toArray(plugins))});
    //this.setState({plugins: _.toArray(plugins)});
    this.updateFilter();
  },

  asPluginItem: function (item) {
    return (
      <PluginItem plugin={item} key={item.sha1}/>
    );
  },

  render: function () {
    var listSize = this.state.plugins ? this.state.plugins.size : null;
    return (
      <div
        style={{paddingTop: '10px'}}
        className="content content-list row">
        <div>
          Here we will use only one general component "List"
          and then use callbacks to render each item
        </div>

        <div style={{paddingTop: '10px'}} className="list">
          {!this.state.plugins ? <Spinner /> :
            <List headers={['Plugin', 'Title', '']}
              hasEntries={!!listSize}
              items={this.state.filteredPlugins} mapItem={this.asPluginItem}/>
            }
        </div>


      </div>
    );
  }
});

module.exports = PluginList;/*

/*
<ListFilter
          searchFields={searchConfig}
          searchPlaceholder={'searchPlaceholder'}
          onSearchChange={this.onFetchFilterChange} />

.compose(
  connect(pluginStore, 'onStoreChange')
)(PluginList);*/
