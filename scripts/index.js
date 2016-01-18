import React from 'react';
import {render} from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import configureStore from './plugins/stores/configureStore';


const store = configureStore();

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('grid-box')
);
