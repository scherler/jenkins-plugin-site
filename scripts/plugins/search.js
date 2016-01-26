import _ from 'lodash';
import Immutable from 'immutable';
import { createSelector } from 'reselect'
import { createSearchAction, getSearchSelectors } from 'redux-search'
import keymirror from 'keymirror'

export const State = Immutable.Record({
  plugin: Immutable.OrderedMap(),
  immutableMap: Immutable.OrderedMap()
})

// Immutable Data attributes must be accessible as getters
const Record = Immutable.Record({
  id: null,
  name: null,
  title: null
})

export const ACTION_TYPES = keymirror({
  CLEAR_DATA: null,
  CLEAR_IMMUTABLE_DATA: null,
  SET_DATA: null,
  SET_IMMUTABLE_DATA: null
})

export const actions = {
  clearData: () => ({ type: ACTION_TYPES.CLEAR_DATA }),
  clearImmutableData: () => ({ type: ACTION_TYPES.CLEAR_IMMUTABLE_DATA }),
  searchData: createSearchAction('plugin'),
  searchImmutableData: createSearchAction('immutableMap')
}

export const actionHandlers = {
  [ACTION_TYPES.CLEAR_DATA] (state) {
    return state.set('plugin', {})
  },
  [ACTION_TYPES.CLEAR_IMMUTABLE_DATA] (state) {
    return state.set('immutableMap', Immutable.Map())
  },
  [ACTION_TYPES.SET_DATA] (state, { payload }): State {
    return state.set('plugin', payload)
  },
  [ACTION_TYPES.SET_IMMUTABLE_DATA] (state, { payload }): State {
    return state.set('immutableMap', payload)
  }
}

export const resources = state => state.resources
export const resourceSelector = (resourceName, state) => state.resources.get(resourceName)
export const plugin = createSelector([resources], resources => resources.plugin)
export const immutableMap = createSelector([resources], resources => resources.immutableMap)

const selectors = getSearchSelectors({ resourceName: 'plugin', resourceSelector })
export const dataSearchText = selectors.text
export const filteredIdArray = selectors.result

const immutableSelectors = getSearchSelectors({ resourceName: 'immutableMap', resourceSelector })
export const immutableDataSearchText = immutableSelectors.text
export const filteredIdList = createSelector([immutableSelectors.result], result => Immutable.List(result))

export function reducer (state = new State(), action: Object): State {
  const { type } = action
  if (type in actionHandlers) {
    return actionHandlers[type](state, action)
  } else {
    return state
  }
}
