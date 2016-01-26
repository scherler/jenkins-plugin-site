import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { reducer as searchReducer, reduxSearch } from 'redux-search'
//import { reducer as resourceReducer } from '../search'
import createLogger from 'redux-logger'
import plugins from '../reducers'

const rootReducer = combineReducers({
  search: searchReducer,
  //resources: resourceReducer,
  plugins: plugins
})

export default function configureStore(initialState) {
  //const store = createStoreWithMiddleware(rootReducer, initialState);
  const store = compose(
    applyMiddleware(
      thunkMiddleware,
      createLogger()
    ),
    reduxSearch({
      resourceIndexes: {
        plugins: ({ resources, indexDocument }) => {
        resources.forEach(plugin => {
          indexDocument(plugin.sha1, plugin.name)
          indexDocument(plugin.sha1, plugin.excerpt)
          indexDocument(plugin.sha1, plugin.title)
          plugin.developers.forEach(
            developer => indexDocument(plugin.sha1, developer.name)
          )
        })
      }
      }
    })
  )(createStore)(rootReducer);
/*resourceIndexes: {
        plugins: ['title', 'name']
      },*/
      /*
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers');
      store.replaceReducer(nextRootReducer);
    });
  }*/

  return store;
}
