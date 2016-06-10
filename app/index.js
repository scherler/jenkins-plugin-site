import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import { render } from 'react-dom';
import Application from './Application';
import App from './App';
import PluginDetail from './components/PluginDetail';

import React from 'react';

export const routes = (<Route path='/' component={App} title='Jenkins plugin site'>
  <IndexRoute component={Application} />

  <Route name='search'
         path='?query:query&limit=:limit&page=:page&category=:category&latest=:latest'
         component={Application} />

  <Route name='detail'
         path=':pluginName'
         component={PluginDetail} />
</Route>);

if (typeof document !== 'undefined') {
  render((
    <Router history={browserHistory}>
      { routes }
    </Router>
    ),
    document.getElementById('grid-box')
  );
}
