import { createSelector } from 'reselect';
import Immutable from 'immutable';
import keymirror from 'keymirror';
import { api, logger } from './commons';
import _ from 'lodash';
import React from 'react';

api.init({
  latency: 100
});

export const SearchOptions = Immutable.Record({
  limit: 100,
  page: 1,
  pages: 0,
  total: 0
});

export const State = Immutable.Record({
  plugins: Immutable.OrderedMap(),
  isFetching: false,
  searchOptions: SearchOptions,
  labelFilter: Immutable.Record({//fixme: that should become label: search, sort: field
    field: 'title',
    searchField: null,
    asc: false,
    search: []
  })
});

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

export const ACTION_TYPES = keymirror({
  CLEAR_PLUGIN_DATA: null,
  FETCH_PLUGIN_DATA: null,
  SET_PLUGIN_DATA: null,
  SET_LABEL_FILTER: null,
  SET_QUERY_INFO: null
});

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
  },
  [ACTION_TYPES.SET_QUERY_INFO](state, { payload }): State {
    return state.set('searchOptions', payload);
  }
};

export const actions = {

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

  generatePluginData(query={}) {
    return (dispatch) => {
      logger.log(query);
      let url;
      if(query.latest){
        url = '/latest';
      } else {
        let PLUGINS_URL = `/plugins?page=${query.page}`;
       ['limit', 'q', 'sort', 'asc', 'category', 'labelFilter']
          .filter(item => query[item])
          .map(item => PLUGINS_URL += `&${item}=${query[item]}`);
        url = `${PLUGINS_URL}`;
      }
      logger.log(query, url);
      dispatch(actions.clearPluginData());
      dispatch(actions.fetchPluginData());

      return api.getJSON(url,(error, data) => {
        if (data) {
          const searchOptions = new SearchOptions({
            limit: data.limit,
            page: data.page,
            pages: data.pages,
            total: data.total
          });

          const items = data.docs.map(item => new Record(item));
          const recordsMap = Immutable.OrderedSet(items);
          dispatch({
            type: ACTION_TYPES.SET_PLUGIN_DATA,
            payload: recordsMap
          });
          dispatch({
            type: ACTION_TYPES.SET_QUERY_INFO,
            payload: searchOptions
          });
          dispatch(actions.fetchPluginData());
        }
      });
    };
  }
};

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

export const resources = state => state.resources;
export const plugins = createSelector([resources], resources => resources.plugins);
export const searchOptions = createSelector([resources], resources => resources.searchOptions);

export const isFetching = createSelector([resources], resources => resources.isFetching);
export const labelFilter = createSelector([resources], resources => resources.labelFilter);

export const totalSize = createSelector(
  [ searchOptions ],
  ( searchOptions ) => {
    return searchOptions.total || 0;
  }
);

export const filterVisibleList = createSelector (
  [plugins],
  (plugins) => {
    return plugins;
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
