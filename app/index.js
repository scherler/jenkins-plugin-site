import createAppStore from './createAppStore';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import { render } from 'react-dom';
import Application from './Application';
import App from './App';
import PluginDetail from './components/PluginDetail';

import React from 'react';

const store = createAppStore();

render((
    <Provider store={store}>
      <Router history={browserHistory}>
        <Route path="/" component={App}>
          <IndexRoute component={Application} />

          <Route name="search"
                 path="?query:query&limit=:limit&page=:page&category=:category&latest=:latest"
                 component={Application} />

          <Route name="detail"
                 path=":pluginName"
                 component={PluginDetail} />
        </Route>
      </Router>
    </Provider>
  ),
  document.getElementById('grid-box')
);
