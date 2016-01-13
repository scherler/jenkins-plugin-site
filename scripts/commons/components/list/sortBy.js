/**
 * factory for a comparator function you may use as default for filterMixin (via setSort)
 * @param {string} field property to sort by
 * @param {boolean} reverse if true sort in reverse order
 * @param primer ?????????
 * @see http://facebook.github.io/immutable-js/docs/#/List/sort
 * @returns {Function} a function comparing a and b (Returns 0 if the elements should not be swapped,
 * Returns -1 (or any negative number) if valueA comes before valueB
 * Returns 1 (or any positive number) if valueA comes after valueB)
 */
module.exports = function (field, reverse, primer) {
  function getImmputableField(x) {
    return (field.indexOf('.')) ? x.getIn(field.split('.')) : x.get(field);
  }
  let getField = function (x) {
    return x.get ? getImmputableField(x) : x[field];
  };
  let key = function (x) {
    return primer ? primer(getField(x)) : getField(x);
  };

  return function (a, b) {
    let A = key(a),
      B = key(b);
    return ((A > B) ? -1 : ((A < B) ? 1 : 0)) * [-1, 1][+!!reverse];
  };
};
