import { createSelector } from 'reselect';
import Immutable from 'immutable';
import keymirror from 'keymirror';
import { api, logger } from './commons';

api.init({
  latency: 100
});

export const SearchOptions = Immutable.Record({
  limit: 100,
  page: 1,
  pages: 0,
  total: 0
});

const Record = Immutable.Record({
  id: null,
  name: null,
  title: null,
  buildDate: null,
  releaseTimestamp: null,
  version: null,
  previousVersion: null,
  previousTimestamp: null,
  compatibleSinceVersion: null,
  scm: null,
  url: null,
  sha1: null,
  wiki: null,
  excerpt: null,
  iconDom: null,
  requiredCore: null,
  developers: [],
  labels: [],
  dependencies: [],
  stats: null,
});

export const State = Immutable.Record({
  plugins: null,
  plugin: Record,
  isFetching: false,
  labels: [],
  labelFilter: Immutable.Record({//fixme: that should become label: search, sort: field
    field: 'title',
    searchField: null,
    asc: false,
    search: []
  }),
  searchOptions: SearchOptions,
});

export const ACTION_TYPES = keymirror({
  CLEAR_PLUGINS_DATA: null,
  FETCH_PLUGINS_DATA: null,
  SET_PLUGINS_DATA: null,
  SET_PLUGIN_DATA: null,
  CLEAR_PLUGIN_DATA: null,
  SET_LABEL_FILTER: null,
  SET_LABELS: null,
  SET_QUERY_INFO: null
});

export const actionHandlers = {
  [ACTION_TYPES.CLEAR_PLUGIN_DATA](state) {
    return state.set('plugin', null);
  },
  [ACTION_TYPES.SET_PLUGIN_DATA](state, { payload }): State {
    return state.set('plugin', payload);
  },
  [ACTION_TYPES.CLEAR_PLUGINS_DATA](state) {
    return state.set('plugins', Immutable.Map());
  },
  [ACTION_TYPES.FETCH_PLUGINS_DATA](state, {}): State {
    return state.set('isFetching', !state.isFetching);
  },
  [ACTION_TYPES.SET_PLUGINS_DATA](state, { payload }): State {
    return state.set('plugins', payload);
  },
  [ACTION_TYPES.SET_LABELS](state, { payload }): State {
    return state.set('labels', payload);
  },
  [ACTION_TYPES.SET_QUERY_INFO](state, { payload }): State {
    return state.set('searchOptions', payload);
  }
};

export const actions = {

  clearPluginsData: () => ({ type: ACTION_TYPES.CLEAR_PLUGINS_DATA }),
  clearPluginData: () => ({ type: ACTION_TYPES.CLEAR_PLUGINS_DATA }),

  fetchPluginData: () => ({ type: ACTION_TYPES.FETCH_PLUGINS_DATA }),

  getPlugin(name) {
    return (dispatch, getState) => {
      dispatch({ type: ACTION_TYPES.CLEAR_PLUGIN_DATA });
      const plugins = getState().resources.plugins;
      let plugin;
      if (plugins) {
        plugin = plugins.filter((plugin) => plugin.name === name);
      }
      const urlStats = `/stats/${name}`;
      if(!plugins || !plugin || plugin.size === 0) {
        const url = `/plugin/${name}`;
        return api.getJSON(url, (error, data) => {
          if (data) {
            return api.getJSON(urlStats, (error, statsData) => {
              if (statsData) {
                const stats = {stats: statsData};
                dispatch({
                  type: ACTION_TYPES.SET_PLUGIN_DATA,
                  payload: new Record(Object.assign({}, data, stats)),
                });

              }
            });
          }
        });
      } else {
        const js = plugin.toArray()[0];
        return api.getJSON(urlStats, (error, statsData) => {
          if (statsData) {
            const stats = {stats: statsData};
            dispatch({
              type: ACTION_TYPES.SET_PLUGIN_DATA,
              payload: new Record(Object.assign({}, js.toJS(), stats)),
            });

          }
        });
      }
    };
  },

  generateLabelData: () => {
    return (dispatch) => {
      return api.getJSON('/labels',(error, data) => {
        if (data && data.docs) {
          dispatch({
            type: ACTION_TYPES.SET_LABELS,
            payload: Immutable.List(data.docs)
          });
        }
      });
    };
  },

  generatePluginData(query={}) {
    return (dispatch) => {
      logger.log(query);
      let PLUGINS_URL = `/plugins?page=${query.page}`;
     ['limit', 'q', 'sort', 'asc', 'category', 'labelFilter', 'latest']
        .filter(item => query[item])
        .map(item => PLUGINS_URL += `&${item}=${query[item]}`);
      logger.log(query, PLUGINS_URL);
      dispatch(actions.clearPluginsData());
      dispatch(actions.fetchPluginData());

      return api.getJSON(PLUGINS_URL,(error, data) => {
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
            type: ACTION_TYPES.SET_PLUGINS_DATA,
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

export const resources = state => state.resources;
export const plugins = createSelector([resources], resources => resources.plugins);
export const labels = createSelector([resources], resources => resources.labels);
export const plugin = createSelector([resources], resources => resources.plugin);
export const searchOptions = createSelector([resources], resources => resources.searchOptions);

export const isFetching = createSelector([resources], resources => resources.isFetching);

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
  ( plugins ) => plugins ? groupAndCountLabels(plugins) : new Immutable.List());

export function reducer(state = new State(), action: Object): State {
  const { type } = action;
  if (type in actionHandlers) {
    return actionHandlers[type](state, action);
  } else {
    return state;
  }
}

export { createSelector } from 'reselect';
export { connect } from 'react-redux';
