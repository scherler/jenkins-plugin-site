/** @flow */
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { reducer as resourceReducer } from './resources';
import thunk from 'redux-thunk';

export default function createAppStore() {
  const finalCreateStore = compose(
    applyMiddleware(thunk),
    window && window.devToolsExtension ? window.devToolsExtension() : f => f
  )(createStore);

  const rootReducer = combineReducers({
    resources: resourceReducer
  });

  return finalCreateStore(rootReducer);
}
