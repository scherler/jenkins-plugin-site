import restAPI from './restApi';
import createApiActions from '../../commons/utils/createApiActions';

let
  plugins = createApiActions('plugins', restAPI),
  actions = {
    plugin: plugins
  };


export default actions;
