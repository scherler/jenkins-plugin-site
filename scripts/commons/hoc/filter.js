import _ from 'lodash';
import React from 'react';
import Immutable from 'immutable';
import sift from 'sift';
import sortBy from '../components/list/sortBy';

const Filter = function (options, Component) {
  return React.createClass({

    getInitialState() {
      this.store = this.store || options.store || options.getStore();
      this.fetchStore = options.fetchStore;

      const infiniteInitialState = {
        params: _.merge({
          sort: 'name',
          limit: 100,
          skip: 0
        }, options.params)
      };

      return {
        [`${options.name}`]: this.store[`get${this._cap(options.name)}`](),
        isLoading: this.store.loading || !this.store.ready,
        ...infiniteInitialState
      };
    },

    componentDidMount() {
      if(this.fetchStore) {
        this.setFetchStore(this.store, this._cap(options.name));
      }
    },

    componentWillMount() {
      this.listName = options.name;
      this.filteredName = 'filtered' + this._cap(options.name);

      this.unsubscribe = this.store.listen(this.onChange);

      if(this.state[this.listName] && this.sortFc) {
        this._sort(this.state[this.listName], this.lastSortArguments);
      } else if(this.state[this.listName]) {
        this._setFiltered(this.state[this.listName]);
      }
    },

    componentWillUnmount() {
      this.unsubscribe();
    },

    onChange() {
      if(this.fetchStore) {
        const { size } = this.store[`get${this._cap(options.name)}`]();
        this.nextPageLoaded(size);
      }
      this.setState(this.getInitialState());
      this.filter();
    },

    resetPaging(query) {
      let { params } = this.state;

      params.skip = 0;
      this.setState({ params });

      // not every keydown should be a fetch
      this.deferredFetcher({ ...params, query }, true);
    },

    onFetchFilterChange(query) {
      this.resetPaging(query);
      this.filter(query);
      this.setState({ isLoading: true });
    },

    nextPageLoaded(size) {
      let { params } = this.state;
      let { skip, limit } = params;

      params.skip = skip + limit;

      this.setState({
        params,
        allLoaded: size <= 0 || size % limit !== 0,
        isInfiniteLoading: false,
        isLoading: false
      });
    },

    setFetchStore(store, uName) {
      this.setState({ isLoading: true });
      this.infiniteLoad(store[`fetch${uName}`].bind(store));
      this.setInfiniteDeferredLoader(store[`deferredFetch${uName}`].bind(store));
      this.deferredFetcher(this.state.params, true);
    },

    infiniteLoad(fetcher) {
      this.fetcher = fetcher;
    },

    setInfiniteDeferredLoader(deferredFetcher) {
      this.deferredFetcher = deferredFetcher;
    },

    handleInfiniteLoad() {
      let { params, allLoaded } = this.state;
      if(allLoaded) {
        return this.setState({isLoading: false, isInfiniteLoading: false});
      }
      this.setState({ isInfiniteLoading: true });
      this.deferredFetcher(params, true);
    },

    updateFilter() {
      if(!this.lastFilterArguments) {
        this.setListToFilter(this.state[this.listName]);
      } else {
        this.filter.apply(this, this.lastFilterArguments);
      }
    },

    setFilter(filterFc) {
      this.filterFc = filterFc;
    },

    filter() {
      if(!this.filterFc || !this.state[this.listName]) {
        return;
      }
      this.lastFilterArguments = arguments.length ? arguments : [{}];
      let filtered;

      let fc = this.filterFc.apply(this.filterFc, this.lastFilterArguments);
      let isImmutable = Immutable.List.isList(this.state[this.listName]);
      if(isImmutable) {
        filtered = Immutable.fromJS(this.state[this.listName].toJS().filter(fc));
      } else {
        filtered = this.state[this.listName].filter(fc);
      }

      if(this.sortFc) {
        this._sort(filtered, this.lastSortArguments);
      } else {
        this._setFiltered(filtered);
      }
    },

    setSort(sortFc) {
      this.sortFc = sortFc;
    },

    sort(args) {
      this._sort(this.state[this.listName], args);
    },

    _sort(list, args) {
      if(!this.sortFc || !this.state[this.listName]) {
        this._setFiltered(this.state[this.filteredName]);
      }

      this.lastSortArguments = args;

      let fc = this.sortFc.apply(this.sortFc, args);
      let sorted = list.sort(fc);

      this._setFiltered(sorted);//.slice(0, this.limit));
    },

    _setFiltered(filtered) {
      let obj = {};
      obj[this.filteredName] = filtered;
      this.setState(obj, this.filterCallback);
    },

    _cap(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },

    onFiltered(cb) {
      this.filterCallback = cb;
    },

    getFunctions() {
      let self = this;
      return {
        updateFilter() {
          return self.updateFilter();
        },
        setFilter(filterFc) {
          return self.setFilter(filterFc);
        },
        filter() {
          return self.filter.apply(self, arguments);
        },
        setSort(sortFc) {
          return self.setSort(sortFc);
        },
        sort(args) {
          return self.sort(args);
        },
        onFiltered(cb) {
          return self.onFiltered(cb);
        },
        handleInfiniteLoad() {
          return self.handleInfiniteLoad();
        },
        onFetchFilterChange(...args) {
          return self.onFetchFilterChange(...args);
        },
        clean() {
          self.store.clean();
        }
      };
    },
/*eslint-disable no-dupe-keys*/ //bug in eslint
    render() {
      return React.createElement(
        Component,
        { ...this.props, ...this.state, ...{sift: sift, sortBy: sortBy}, ...this.getFunctions() }
      );
    }
  });
};

export default _.curry(Filter);
