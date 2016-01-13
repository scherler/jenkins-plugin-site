import _ from 'lodash';

let createFilterFC = function (obj) {
  return function (item) {
    return !_.some(obj, (v, k) => item.get(k) !== v);
  };
}
module.exports = createFilterFC;
