/**
 * Builds a listFilter sift query based on a number of attributes to filter
 * and a filterString query which might consist of multiple filter tokens
 * separated by spaces.
 *
 * All query tokens must be found in any of the given attributes in the target object.
 */
let buildSearchQuery = function (filterAttributes, filterString) {
  if (!filterString || filterString.length === 0) {
    return {$and: []};
  }

  let listFilterQuery = [];

  let filterTokens = filterString.split(' ');
  filterTokens.forEach(function (token) {
    if (token.length === 0) {
      //ignore spaces
      return;
    }

    let listFilterRegex = token.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
    let tokenSubQuery = {$or: []};
    filterAttributes.forEach(function (filterAttribute) {
      let attributeFilter = {};
      attributeFilter[filterAttribute] = {$regex: listFilterRegex, $options: 'i'};
      tokenSubQuery.$or.push(attributeFilter);
    });

    listFilterQuery.push(tokenSubQuery);
  });

  if (listFilterQuery.length > 1) {
    return { $and: listFilterQuery };
  }
  if (listFilterQuery.length === 1) {
    return listFilterQuery[0];
  }
  else {
    return { $and: [] };
  }
};

let buildStateQuery = function (filters, filterState) {
  let stateFilterQuery = {
    $and: []
  };

  // all dropdowns
  for (let m in filterState) {
    let filter = filters[m],
        state = filterState[m];

    // one dropdown
    for (let n in state) {
        let choices = filter.choices[n];
        let selection = state[n];

        let subQuery = { $or: [] };

        // selection in dropdown
        for (let o in selection) {
          if (selection[o]) {
            // possible candidate for query
            let filtered = choices[o];

            // build subquery
            let query = null;
            if (filtered.query) {
              query = filtered.query;
            } else if (filtered.exists !== undefined && filtered.field) {
              query = {};
              query[filtered.field] = { $exists: filtered.exists };
            } else if (filtered.value !== undefined && filtered.field) {
              query = {};
              query[filtered.field] = filtered.value;
            }

            // add the subquery
            if (query) {
              subQuery.$or.push(query);
            }
          }
        }

        if (subQuery.$or.length) {
          stateFilterQuery.$and.push(subQuery);
        }
    }
  }
  return stateFilterQuery;
};

module.exports = {
  buildSearchQuery: buildSearchQuery,
  buildStateQuery: buildStateQuery
};
