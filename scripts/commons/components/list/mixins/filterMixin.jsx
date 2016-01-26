'use strict';

var Immutable = require('immutable'),
    warning = require('../../../warning');

var FilterMixin = {

  componentDidMount: function() {
    warning.deprecated('commons/components/list/mixins/filterMixin is deprecated, use filter hoc.');
  },

  setListToFilter: function(name) {
    this.listName = name;
    this.filteredName = 'filtered' + this._cap(name);

    if (this.state[this.listName] && this.sortFc) {
      this._sort(this.state[this.listName], this.lastSortArguments);
    } else if (this.state[this.listName]) {
      this._setFiltered(this.state[this.listName]);
    }
  },

  updateFilter: function() {
    if (!this.lastFilterArguments) {
      this.setListToFilter(this.listName);
    } else {
      this.filter.apply(this, this.lastFilterArguments);
    }
  },

  setFilter: function(filterFc) {
    this.filterFc = filterFc;
  },

  //setLimit: function(limit) {
    //this.limit = limit;
  //},

  filter: function() {
    if (!this.filterFc || !this.state[this.listName]) return;
    this.lastFilterArguments = arguments.length ? arguments : [{}];

    var filtered;

    var fc = this.filterFc.apply(this.filterFc, this.lastFilterArguments);
    var isImmutable = Immutable.List.isList(this.state[this.listName]);
    if (isImmutable) {
      filtered = Immutable.fromJS(this.state[this.listName].toJS().filter(fc));
    } else {
      filtered = this.state[this.listName].filter(fc);
    }

    if (this.sortFc) {
      this._sort(filtered, this.lastSortArguments);
    } else {
      this._setFiltered(filtered);
    }
  },

  /**
   * set a comparator function to sort the list
   *
   * @see http://facebook.github.io/immutable-js/docs/#/List/sort
   * @param {Function} sortFc a comparator(valueA, valueB):
   * Returns 0 if the elements should not be swapped.
   * Returns -1 (or any negative number) if valueA comes before valueB
   * Returns 1 (or any positive number) if valueA comes after valueB
   */
  setSort: function(sortFc) {
    this.sortFc = sortFc;
  },

  sort: function(args) {
    this._sort(this.state[this.listName], args);
  },

  _sort: function(list, args) {
    if (!this.sortFc || !this.state[this.listName]) this._setFiltered(this.state[this.filteredName]);

    this.lastSortArguments = args;

    var fc = this.sortFc.apply(this.sortFc, args);
    var sorted = list.sort(fc);

    this._setFiltered(sorted);//.slice(0, this.limit));
  },

  _setFiltered: function(filtered) {
    var obj = {};
    obj[this.filteredName] = filtered;
    this.setState(obj, this.filterCallback);
  },

  _cap: function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },

  onFiltered: function(cb) {
    this.filterCallback = cb;
  },

  sift: require('sift'),

  sortBy: require('../sortBy')

};

module.exports = FilterMixin;
