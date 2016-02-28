import { createSelector } from 'reselect';
import { createSearchAction, getSearchSelectors } from 'redux-search';
import faker from 'faker';
import Immutable from 'immutable';
import keymirror from 'keymirror';
import { env } from './commons';
import _ from 'lodash';
import React, { PropTypes } from 'react';

export const State = Immutable.Record({
  plugins: Immutable.OrderedMap(),
  isFetching: false,
  labelFilter: Immutable.Record({//fixme: that should become label: search, sort: field
    field: 'title',
    searchField: null,
    asc: false,
    search: []
  })
});

export const ACTION_TYPES = keymirror({
  CLEAR_PLUGIN_DATA: null,
  FETCH_PLUGIN_DATA: null,
  SET_PLUGIN_DATA: null,
  SET_LABEL_FILTER: null
});
/*
buildDate: "Mar 03, 2011"
dependencies: Array[0]
developers: Array[1]
excerpt: "This (experimental) plug-in exposes the jenkins build extension
 points (SCM, Build, Publish) to a groovy scripting environment that has
  some DSL-style extensions for ease of development."
gav: "jenkins:AdaptivePlugin:0.1"
labels: Array[2]
name: "AdaptivePlugin"
releaseTimestamp: "2011-03-03T16:49:24.00Z"
requiredCore: "1.398"
scm: "github.com"
sha1: "il8z91iDnqVMu78Ghj8q2swCpdk="
title: "Jenkins Adaptive DSL Plugin"
url: "http://updates.jenkins-ci.org/download/plugins/AdaptivePlugin/0.1/AdaptivePlugin.hpi"
version: "0.1"
wiki: "https://wiki.jenkins-ci.org/display/JENKINS/Jenkins+Adaptive+Plugin"
*/
// Immutable Data attributes must be accessible as getters
const Record = Immutable.Record({
  id: null,
  name: null,
  title: '',
  buildDate: null,
  releaseTimestamp: null,
  version: null,
  wiki: '',
  excerpt: '',
  iconDom: null,
  requiredCore: null,
  developers: [],
  labels: [],
  dependencies: []
});

let PLUGINS_URL = 'https://updates.jenkins-ci.org/current/update-center.json';

if (env.debug) {
  PLUGINS_URL = 'http://0.0.0.0:3000/update-center.json';
}

export function jsonp(url, callback) {// HACK
  const callbackName = `jsonp_callback_${Math.round(100000 * Math.random())}`;
  window.updateCenter = {
    post(data) {
      callback(data);
    }
  };
  const script = document.createElement('script');
  script.src = `${url}${url.indexOf('?') >= 0 ? '&' : '?'}callback=${callbackName}`;
  document.body.appendChild(script);
}

export function groupAndCountLabels(recordsMap) {
  const labelMap = _.map(
      _.groupBy(
        _.flatten(recordsMap.toArray().map((a) => a.labels)
      )
    ), (array, item) => {
      return {
        value: array.length,
        key: item
      };
    }
  );
  return Immutable.List(labelMap);
}

export const actions = {
    //FIXME: This should not inject React DOM here, but.... hack...
  makeIcon(title, type){
    title = title
      .replace('Jenkins ','')
      .replace('jenkins ','')
      .replace(' Plugin','')
      .replace(' Plug-in','')
      .replace(' lugin','');
    type = type || '';
    const colors = ['#6D6B6D','#DCD9D8','#D33833','#335061','#81B0C4','#709aaa','#000'];
    const color = colors[(title.length % 7)]; //pick color based on chars in the name to make semi-random, but fixed color per-plugin
    const iconClass=`i ${type};  
    color = ${color}`;

    const firstLetter = title.substring(0,1).toUpperCase();
    const firstSpace = title.indexOf(' ') + 1;
    const nextIndx = (firstSpace === 0)?
        1: firstSpace;
    const nextLetter = title.substring(nextIndx,nextIndx + 1);

    return (
      <i className={iconClass} style={{background:color}}>
        <span className="first">{firstLetter}</span>
        <span className="next">{nextLetter}</span>
      </i>
    );
  },

  clearPluginData: () => ({ type: ACTION_TYPES.CLEAR_PLUGIN_DATA }),

  fetchPluginData: () => ({ type: ACTION_TYPES.FETCH_PLUGIN_DATA }),

  setFilter(filter) {
    return (dispatch) => {
      dispatch({
        type: ACTION_TYPES.SET_LABEL_FILTER,
        payload: filter
      });
    };
  },

  generatePluginData() {
    return (dispatch, getState) => {
      dispatch(actions.clearPluginData());
      dispatch(actions.fetchPluginData());
      const plugins = {};
      return jsonp(PLUGINS_URL, data => {
        _.forEach(data.plugins, (item) => {
          _.set(item, 'id', item.sha1);
          _.set(item, 'iconDom', actions.makeIcon(item.title));
          plugins[item.id] = new Record(item);
        });
        const recordsMap = Immutable.Map(plugins);
        dispatch({
          type: ACTION_TYPES.SET_PLUGIN_DATA,
          payload: recordsMap
        });
        dispatch(actions.fetchPluginData());
      });
    };
  },
  searchPluginData: createSearchAction('plugins')
};

export const actionHandlers = {
  [ACTION_TYPES.CLEAR_PLUGIN_DATA](state) {
    return state.set('plugins', Immutable.Map());
  },
  [ACTION_TYPES.FETCH_PLUGIN_DATA](state, {}): State {
    return state.set('isFetching', !state.isFetching);
  },
  [ACTION_TYPES.SET_PLUGIN_DATA](state, { payload }): State {
    return state.set('plugins', payload);
  },
  [ACTION_TYPES.SET_LABEL_FILTER](state, { payload }): State {
    return state.set('labelFilter', payload);
  }
};

export const resources = state => state.resources;
export const resourceSelector = (resourceName, state) => state.resources.get(resourceName);
export const plugins = createSelector([resources], resources => resources.plugins);

export const isFetching = createSelector([resources], resources => resources.isFetching);
export const labelFilter = createSelector([resources], resources => resources.labelFilter);

const pluginSelectors = getSearchSelectors({ resourceName: 'plugins', resourceSelector });
export const searchText = pluginSelectors.text;
export const filteredList = createSelector([pluginSelectors.result], result => Immutable.List(result));

export const getVisiblePlugins = createSelector(
  [ filteredList, plugins ],
  (filteredList, plugins) => {
    return filteredList.map(
      (id) => {
        return plugins.get(id);
      });
  }
);

export const totalSize = createSelector(
  [ plugins ],
  ( plugins ) => {
    return plugins.size;
  }
);

export const filterVisibleList = createSelector (
  [getVisiblePlugins, labelFilter],
  (plugins, labelFilter) => {

    if (labelFilter instanceof Function) {
      labelFilter = labelFilter();
    }

    const list  = plugins
    .filter(
      item => {
        if ( !labelFilter.searchField || !labelFilter.search || !labelFilter.search.length > 0) {
          return true;
        }
        const matchIndex = _.findIndex(item[labelFilter.searchField], (i) => {
          let match = false;
          labelFilter.search.some(searchFilter => {
            match = (i === searchFilter);
            return match;
          });
          return match;
        });
        return ( matchIndex >= 0);
      }
    )
    .sortBy(plugin => {
      return plugin[labelFilter.field];}, (plugin, nextPlugin) => {
      if (labelFilter.asc) {
        return nextPlugin.localeCompare(plugin);
      } else {
        return plugin.localeCompare(nextPlugin);
      }
    }

    );
    return list;
  }
);

export const getVisiblePluginsLabels = createSelector(
  [ filterVisibleList ],
  ( plugins ) => {
    return groupAndCountLabels(plugins);
  }
);

export function reducer(state = new State(), action: Object): State {
  const { type } = action;
  if (type in actionHandlers) {
    return actionHandlers[type](state, action);
  } else {
    return state;
  }
}
