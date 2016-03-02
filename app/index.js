import createAppStore from './createAppStore';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory} from 'react-router';
import { render } from 'react-dom';
import Application from './Application';

import React, { Component, PropTypes } from 'react';

const store = createAppStore();

class App extends Component {

  render() {
    return (
      <div>
        <Provider store={store}>
          <Application location={this.props.location} browserHistory={browserHistory} />
        </Provider>
      </div>
    );
  }
}

App.propTypes = {
  location: PropTypes.object.isRequired
};

render((
    <Router history={browserHistory}>
      <Route component={App} path="/" component={App}>
        <Route name="search" path="?query:query&limit=:limit&page=:page&category=:category&latest=:latest" component={App}/>
      </Route>
    </Router>
  ),
  document.getElementById('grid-box')
);
