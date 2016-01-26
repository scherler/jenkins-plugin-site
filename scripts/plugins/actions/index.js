import _ from 'lodash';
import Immutable from 'immutable';
import { createSelector } from 'reselect';
import { createSearchAction, getSearchSelectors } from 'redux-search';
import keymirror from 'keymirror';

export const REQUEST_PLUGINS = 'REQUEST_PLUGINS';
export const RECEIVE_PLUGINS = 'RECEIVE_PLUGINS';

const PLUGINS_URL = 'https://updates.jenkins-ci.org/current/update-center.json';

function requestPlugins() {
  return {
    type: REQUEST_PLUGINS
  };
}

function receivePlugins(plugins) {
  return {
    type: RECEIVE_PLUGINS,
    plugins: new Immutable.List(_.toArray(plugins)),
    receivedAt: Date.now()
  };
}

function fetchPlugins() {//FIXME that will not work
  return dispatch => {
    dispatch(requestPlugins());
    return jsonp(PLUGINS_URL, data => {
      dispatch(receivePlugins(data.plugins));
    });
  };
}

function shouldFetchPlugins(state) {
  const plugins = state.plugins;
  if (!plugins) {
    return true;
  }
  if (plugins.isFetching) {
    return false;
  }
  return true;
}

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

export function fetchPluginsIfNeeded() {
  return (dispatch, getState) => {
    if (shouldFetchPlugins(getState())) {
      return dispatch(fetchPlugins());
    }
  }
}
