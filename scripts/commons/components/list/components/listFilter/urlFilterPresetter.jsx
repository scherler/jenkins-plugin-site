

/**
 * Provides functionality to preset filter and search query (token) according to
 * URL parameters.
 *
 * For the Moment, all filters on one page will react to the url parameters.
 * in taibika, there is currently no view with more than one list (and it's filter)
 *;
 */


/**
 * returns the query parameter for presetting the text getSearch or an empty string
 * if url does not preset the search token
 *
 * @param urlParams
 * @returns {*}
 */
export function getSearchPreset(urlParams) {
  return urlParams.query ? urlParams.query : '';
}

/**
 * checks whether the given filterChoice is contained in the given array of values to preselect
 *
 * @param {Object[]} choice
 * @param {String[]} valuesToPreset
 * @returns {boolean}
 */
export function isChoiceMatch(choice, valuesToPreset) {
  return valuesToPreset.some(function (valueToPreset) {
    return (choice.label === valueToPreset || choice.id === valueToPreset);
  });
}

export function presetFilters(filters, urlParams) {
  let didPreset = false;

  let preFilters = filters.map(function (filterItem) {
    let filterParamName = 'filter_' + filterItem.name;

    if (!urlParams[filterParamName]) {
      return filterItem;
    }

    let valuesToPreset = urlParams[filterParamName].split(',');

    filterItem.choices = filterItem.choices.map(function (choiceGroup) {
      return choiceGroup.map(function (choice) {
        if (isChoiceMatch(choice, valuesToPreset)) {
          choice.selected = true;
          choice.preSelected = true;
          didPreset = true;
        }
        return choice;
      });
    });
    return filterItem;

  });

  if (didPreset) {
    preFilters = filters.map(function (filterItem) {
      filterItem.choices = filterItem.choices.map(function (choiceGroup) {
        return choiceGroup.map(function (choice) {
          if (choice.selected && !choice.preSelected) {
            delete choice.selected;
          }
          return choice;
        });
      });
      return filterItem;
    });
  }

  preFilters.didPreset = didPreset;
  return preFilters;
}
