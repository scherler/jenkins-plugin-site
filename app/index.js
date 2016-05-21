import createAppStore from './createAppStore';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import { render } from 'react-dom';
import Application from './Application';
import App from './App';
import PluginDetail from './components/PluginDetail';

import React from 'react';

const store = createAppStore();

const routes = (<Route path="/" component={App}>
  <IndexRoute component={Application} />

  <Route name="search"
         path="?query:query&limit=:limit&page=:page&category=:category&latest=:latest"
         component={Application} />

  <Route name="detail"
         path=":pluginName"
         component={PluginDetail} />
</Route>);

render((
    <Provider store={store}>
      <Router history={browserHistory}>
        { routes }
      </Router>
    </Provider>
  ),
  document.getElementById('grid-box')
);
/**
 * This function is the global export that static-render-webpack-plugin uses
 */
module.exports = function(path, props, callback) {
  /**
   * Each route that is provided will execute the following function once,
   * the callback is called with the desired html
   */
  Router.run(routes, path, (Root) => {
    /**
     * React.renderToStaticMarkup converts your react elements
     * into regular html as a string.
     *
     * Please note that we add the doctype, which react isn't
     * able to generate on its own. If we don't add the doctype
     * some browsers will render the page in quirks mode which is
     * extremely hard to debug.
     */
    const html = React.renderToStaticMarkup(<Root/>);
    callback('<!doctype html>' + html);
  });
}