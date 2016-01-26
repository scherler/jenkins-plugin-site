import Reflux from 'reflux';
import _ from 'lodash';
import readStore from '../mixins/readStore';

function createImmutableReadStore(def) {
  if(!_.has(def, 'collection') || !_.has(def, 'apiActions')) {
    throw new Error('please provide a collection and apiActions property');
  }

  def.mixins = def.mixins || [];
  def.mixins.push(readStore(def));

  let store = Reflux.createStore(def);
  if (def.apiActions['load' + store.names.uCollectionName]) {
    store.listenToMany(def.apiActions);
  }

  return store;
}

module.exports = createImmutableReadStore;
