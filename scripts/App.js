import React, {Component} from 'react';
import PluginsList from './plugins/view/PluginsList';

export default class App extends Component {
  render() {
    return (
      <div>
        <h1>Jenkins Plugins List</h1>
        <PluginsList />
      </div>
    );
  }
}
