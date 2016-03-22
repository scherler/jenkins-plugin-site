/** @flow */
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { reducer as resourceReducer } from './resources';
import thunk from 'redux-thunk';

export default function createAppStore(): Object {
  const finalCreateStore = compose(
    applyMiddleware(thunk)
  )(createStore);

  const rootReducer = combineReducers({
    resources: resourceReducer
  });

  return finalCreateStore(rootReducer);
}
