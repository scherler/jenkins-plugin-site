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

export const State = Immutable.Record({
  plugins: Immutable.OrderedMap(),
  isFetching: false,
  searchOptions: SearchOptions,
  labels: [],
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
  SET_LABELS: null,
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
  [ACTION_TYPES.SET_LABELS](state, { payload }): State {
    return state.set('labels', payload);
  },
  [ACTION_TYPES.SET_QUERY_INFO](state, { payload }): State {
    return state.set('searchOptions', payload);
  }
};

export const actions = {

  clearPluginData: () => ({ type: ACTION_TYPES.CLEAR_PLUGIN_DATA }),

  fetchPluginData: () => ({ type: ACTION_TYPES.FETCH_PLUGIN_DATA }),

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
      logger.log(query, `${PLUGINS_URL}`);
      dispatch(actions.clearPluginData());
      dispatch(actions.fetchPluginData());

      return api.getJSON(`${PLUGINS_URL}`,(error, data) => {
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

export const resources = state => state.resources;
export const plugins = createSelector([resources], resources => resources.plugins);
export const labels = createSelector([resources], resources => resources.labels);
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

export function reducer(state = new State(), action: Object): State {
  const { type } = action;
  if (type in actionHandlers) {
    return actionHandlers[type](state, action);
  } else {
    return state;
  }
}
