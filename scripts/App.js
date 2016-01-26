import React, {Component} from 'react';
import PluginsList from './plugins/view/PluginsList';

export default class App extends Component {
  render() {
    return (
      <div className='container'>
        <div style={{paddingTop: '10px'}}>
          <h1><i className='icon-jenkins'></i>Jenkins Plugins List</h1>
        </div>
        <PluginsList />
      </div>
    );
  }
}
