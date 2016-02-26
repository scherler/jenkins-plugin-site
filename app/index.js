import createAppStore from './createAppStore';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory} from 'react-router';
import { render } from 'react-dom';
import Application from './Application';

import React, { Component } from 'react';

const store = createAppStore();

class App extends Component {

  render() {
  console.log('crrrr', this.props.location)
    return (
      <div>
        <Provider store={store}>
          <Application location={this.props.location} browserHistory={browserHistory} />
        </Provider>
      </div>
    );
  }
}


render((
    <Router history={browserHistory}>
      <Route component={App} path="/" component={App}>
        <Route name="search" path="?query:query&limit=:limit&pageSize=:pageSize" component={App}/>
      </Route>
    </Router>
  ),
  document.getElementById('grid-box')
);
