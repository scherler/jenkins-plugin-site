import { plugin as restApiActions } from '../rest/restApiActions';
import createImmutableReadStore from '../../commons/utils/createImmutableReadStore';

let store = createImmutableReadStore({
  apiActions: restApiActions,
  collection: 'plugins',

  init() {}
});

module.exports = store;
