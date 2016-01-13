import _ from 'lodash';

export default function (obj) {
  return function (item) {
    return !_.some(obj, (v, k) => item.get(k) !== v);
  };
}
