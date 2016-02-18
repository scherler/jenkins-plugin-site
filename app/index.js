import createAppStore from './createAppStore';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import Application from './Application';
import React from 'react';

const store = createAppStore();

render((
    <div>
      <Provider store={store}>
        <Application/>
      </Provider>
    </div>
  ),
  document.getElementById('grid-box')
);
