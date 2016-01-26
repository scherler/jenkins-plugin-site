/**
 * Duck for resources that happen to be searchable.
 * @flow
 */
import { createSelector } from 'reselect'
import { createSearchAction, getSearchSelectors } from 'redux-search'
import faker from 'faker'
import Immutable from 'immutable'
import keymirror from 'keymirror'
import _ from 'lodash'

export const State = Immutable.Record({
  plugins: Immutable.OrderedMap()
})

export const ACTION_TYPES = keymirror({
  CLEAR_PLUGIN_DATA: null,
  SET_PLUGIN_DATA: null
})

// Immutable Data attributes must be accessible as getters
const Record = Immutable.Record({
  id: null,
  name: null,
  title: null,
  excerpt: null
})

//const PLUGINS_URL = 'https://updates.jenkins-ci.org/current/update-center.json';
const PLUGINS_URL = 'http://0.0.0.0:1337/';

export function jsonp(url, callback) {// HACK
  let callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
  window.updateCenter = {
    post: function (data) {
      callback(data);
    }
  };
  let script = document.createElement('script');
  script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
  document.body.appendChild(script);
}

export const actions = {
  clearPluginData: () => ({ type: ACTION_TYPES.CLEAR_PLUGIN_DATA }),

  generatePluginData () {
    return (dispatch, getState) => {
      dispatch(actions.clearPluginData())
      const plugins = {}
      return jsonp(PLUGINS_URL, data => {
        _.forEach(data.plugins, (item) => {
          _.set(item, 'id', item.sha1);
          plugins[item.id] = new Record(item);
        });
        dispatch({
          type: ACTION_TYPES.SET_PLUGIN_DATA,
          payload: Immutable.Map(plugins)
        })
      });
    }
  },
  searchPluginData: createSearchAction('plugins')
}

export const actionHandlers = {
  [ACTION_TYPES.CLEAR_PLUGIN_DATA] (state) {
    return state.set('plugins', Immutable.Map())
  },
  [ACTION_TYPES.SET_PLUGIN_DATA] (state, { payload }): State {
    return state.set('plugins', payload)
  }
}

export const resources = state => state.resources
export const resourceSelector = (resourceName, state) => state.resources.get(resourceName)
export const plugins = createSelector([resources], resources => resources.plugins)

const pluginSelectors = getSearchSelectors({ resourceName: 'plugins', resourceSelector })
export const searchText = pluginSelectors.text
export const filteredList = createSelector([pluginSelectors.result], result => Immutable.List(result))

export function reducer (state = new State(), action: Object): State {
  const { type } = action
  if (type in actionHandlers) {
    return actionHandlers[type](state, action)
  } else {
    return state
  }
}
