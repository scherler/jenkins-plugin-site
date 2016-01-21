import {
  REQUEST_PLUGINS, RECEIVE_PLUGINS
} from '../actions'

export default function plugins(state = {
  isFetching: false,
  didInvalidate: false,
  items: []
}, action) {
  switch (action.type) {
    case REQUEST_PLUGINS:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      });
    case RECEIVE_PLUGINS:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        items: action.plugins,
        lastUpdated: action.receivedAt
      });
    default:
      return state;
  }
}
