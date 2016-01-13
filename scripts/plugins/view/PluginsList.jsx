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
import React from 'react';
import pure from 'react-mini/pure'
//import pluginStore from '../stores/pluginStore';

const  { List, ListSpinner} = listComponent.components;

const PluginItem = pure(({ plugin, modifySite }, me) => (
  <li className="pluginItem" >
    <div className="title position-inherit">
      {plugin.name}
    </div>
    <div className="commands">
        <i className="icon-externallink"/>
    </div>
  </li>
));

const PluginList = React.createClass({
  mixins: [listComponent.mixins.filter],

  getInitialState() {
    let url = 'https://updates.jenkins-ci.org/current/update-center.json';
    this.jsonp(url, data => {this.setState({plugins: data.plugins}); });//HACK
    return {
    //  plugins: pluginStore.getPlugins()
    };
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
/*
  componentDidMount() {
    this.setFetchStore(pluginStore, 'Plugins');
  },
  onStoreChange() {
    this.setState(this.getInitialState());
    this.updateFilter();
  },
*/

  jsonp(url, callback) {// HACK
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

  asPluginItem: function (item) {
    return (
      <PluginItem plugin={item} key={item.id}/>
    );
  },

  render() {
    var listSize = this.state.plugins ? this.state.plugins.size : null;
    return (
      <div>
        <div>
          Spinner <ListSpinner /> no more
        </div>
        <div>
          Here we will use only one general component "List"
          and then use callbacks to render each item
        </div>

      </div>
    );
  }
});

module.exports = PluginList;/*
{!this.state.plugins ? <Spinner /> :
  <List headers={['', 'nameHeader', 'header.medium', '']}
    hasEntries={!!listSize}
    items={this.state.filteredPlugins} mapItem={this.asPluginItem}/>
  }

.compose(
  connect(pluginStore, 'onStoreChange')
)(PluginList);*/
