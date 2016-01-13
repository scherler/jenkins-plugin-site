import _ from 'lodash';
import Immutable from 'immutable';
import {
  collectionNames,
  capitalize,
  addQueueHandler,
  callbackName,
  createFilterFC,
  offlineStore,
  logger,
  localforage
} from '../utils';

export default function (def) {
  let dataCollection = Immutable.fromJS([]);

  if (!def.collection || !def.apiActions) {
    throw new Error('Invalid store def given.');
  }

  let names = collectionNames(def);
  let {
      collectionName: name,
      collectionNameSingular: singular,
      uCollectionName: uName,
      uCollectionNameSingular: uSingular
    } = names;

  let { cacheKey } = def;
  if (_.isString(cacheKey)) {
    cacheKey = () => def.cacheKey;
  }

  let mixin = {
    // initial state
    loading: false,
    loaded: false,
    ready: false,

    names,
    dataCollection,

    toImmutable(obj) {
      if (def.makeArray && !_.isArray(obj) && obj) {
        obj = [obj];
      }
      return Immutable.fromJS(obj);
    },

    triggerFailedLoading(action) {
      let vent = { action: action || 'failedLoading' + uName };
      this.trigger(vent);
    },

    triggerLoaded(action) {
      let vent = { action: action || 'loaded' + uName };
      vent[name] = this['get' + uName]();
      this.trigger(vent);
    },

    triggerUpdated(action, item) {
      let vent = { action: action || 'loaded' + uName };
      vent[singular] = this.toImmutable(item);
      this.trigger(vent);
    },

    loadFromCache() {
      if (!cacheKey || !cacheKey() || this.loaded) {
        return;
      }

      localforage.getItem(cacheKey(), (err, value) => {
        if (!err && value) {
          if (this.loaded) {
            return;
          }

          this.dataCollection = this.toImmutable(value);
          this.ready = true;
          logger.log(`${name} readstore: loaded data from cache.`);

          this.triggerLoaded(`loaded${uName}FromCache`);
        }
      });
    },

    storeToCache(cb) {
      if (!cacheKey || !cacheKey()) {
        return;
      }

      localforage.setItem(cacheKey(), this.dataCollection.toJSON(), (err) => {
        if (!err) {logger.log(name + ' readstore: stored data to cache.'); }
        if (cb) {cb(err); }
      });
    },

    removeFromCache(cb) {
      if (!cacheKey || !cacheKey()) {
        return;
      }

      localforage.removeItem(cacheKey(), (err) => {
        if (!err) {
          logger.log(name + ' readstore: removed data from cache.');
        }
        if (cb) {
          cb(err);
        }
      });
    },

    load() {
      if (this.loading) {
        return;
      }
      logger.log(name + ' readStore: start load');

      let shouldLoad = true;
      if (typeof this.shouldLoad === 'function') {
        shouldLoad = this.shouldLoad();
      }

      if (!shouldLoad) {
        logger.log(name + ' readstore: prevented load due shouldLoad condition.');
        return;
      }

      def.apiActions['load' + uName]();
      this.loading = true;
      this.loadFromCache();

      // bind reload on getting online again
      if (!this.boundResetOnOnline) {
        if (def.resetOnOnline !== false) {
          offlineStore.listen((offline) => {
            if (!offline) {
              this.reset(true);
            }
          });
        }
        this.boundResetOnOnline = true;
      }
    },

    reset(reload) {
      this.loading = false;
      this.loaded = false;
      this.ready = false;
      this.dataCollection = this.toImmutable([]);

      logger.log(name + ' readstore: resetted data.');
      this.triggerLoaded('resetted' + uName);
      if (reload) {
        this.load();
      }
    },

    // api handlers
    [`onLoad${uName}`]() {
      this.loading = true;
      logger.log(name + ' readstore: loading data.');

      this.startQueueing();
    },

    [`onLoaded${uName}`](data) {
      this.loading = false;
      this.loaded = true;
      this.ready = true;
      logger.log(name + ' readstore: loaded data.');

      this.dataCollection = this.toImmutable(data);
      this.storeToCache();
      this.triggerLoaded();
      this.dequeue();
    },

    [`onFailedLoading${uName}`]() {
      this.loading = false;
      this.loaded = false;

      this.triggerFailedLoading();
      logger.log(name + ' readstore: failed loading data.');
    },

    [`get${uName}`]() {
      if (!this.loaded && !this.loading) {this.load(); }

      return this.dataCollection;
    },

    [`get${uSingular}ById`](id) {
      if (!this.loaded && !this.loading) {this.load(); }

      return this.dataCollection.find(function (item) {
        return item.get('id') === id;
      });
    },

    [`get${uName}Filtered`](filter) {
      if (!this.loaded && !this.loading) {
        this.load();
      }

      let filterFC;
      if (typeof filter === 'object') {
        filterFC = createFilterFC(filter);
      }

      return this.dataCollection.filter(filterFC || filter);
    },

    // expose update functions
    [`add${uSingular}`](action, data) {
      let item = this.toImmutable(data);
      this.dataCollection = this.dataCollection.push(item);
      this.storeToCache();
      this.triggerUpdated(action, item);

      return item;
    },

    [`update${uSingular}`](action, filter, updateFC) {
      let filterFC;
      if (typeof filter === 'object') {
        filterFC = createFilterFC(filter);
      }

      let item = this.dataCollection.find(filterFC || filter);
      let index = this.dataCollection.findIndex(filterFC || filter);

      let updatedItem;
      if (item) {
        updatedItem = updateFC(item);

        this.dataCollection = this.dataCollection.set(index, updatedItem);

        this.storeToCache();
        this.triggerUpdated(action, updatedItem);
      }

      return updatedItem;
    },

    [`remove${uSingular}`](action, filter) {
      let filterFC;
      if (typeof filter === 'object') {
        filterFC = createFilterFC(filter);
      }

      let item = this.dataCollection.find(filterFC || filter);
      let index = this.dataCollection.findIndex(filterFC || filter);

      if (item) {
        this.dataCollection = this.dataCollection.splice(index, 1);

        this.storeToCache();
        this.triggerUpdated(action, item);
      }

      return item;
    },

    [uName !== uSingular ? 'get' + uSingular : 'one' + uSingular](filter) {
    if (uName !== uSingular) {
        if (!this.loaded && !this.loading) {this.load(); }

        let filterFC;
        if (typeof filter === 'object') {
          filterFC = createFilterFC(filter);
        }

        return this.dataCollection.find(filterFC || filter);
      }
    },


    queue: [],
    cacheEvents: true,

    listenToEvents(listenables) {
      _.forEach(listenables, (listanable, key) => {
        let cbname = callbackName(key),
          localname = this[cbname] ? cbname : this[key] ? key : undefined;
        if (localname) {
          let interceptedName = addQueueHandler(this, localname);
          this.listenTo(
            listenables[key], interceptedName,
            this[`${cbname}Default`] || this[`${localname}Default`] || localname);
        }
      });
    },

    shouldHandleEvent(data, evt) {
      let should = this[
        'shouldApply' + capitalize(evt && evt.name || 'unnamedEvent')
        + 'Event'] || this.shouldApplyEvent;

      return should ? should(data, evt) : true;
    },

    dequeue() {
      while (this.queue.length > 0) {
        let evt = this.queue.shift();
        logger.log(this.dataCollection + ' readstore: dequeing', evt);

        if (this.shouldHandleEvent(...evt.args)) {
          this[evt.handler](...evt.args);
        } else {
          if (this.onUnappliedEvent) {
            this.onUnappliedEvent(...evt.args);
          }
        }
      }
      this.cacheEvents = false;
    },

    startQueueing() {
      this.cacheEvents = true;
    }
  };

  mixin.debouncedReset = _.debounce(mixin.reset, def.wait || 500);

  return mixin;
}
