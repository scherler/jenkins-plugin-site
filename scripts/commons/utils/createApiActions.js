import Reflux from 'reflux';

function upperCase(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function createApiActions(listname, api) {
  let upperCasedName = upperCase(listname);
  let actionNames = ['load' + upperCasedName, 'loaded' + upperCasedName, 'failedLoading' + upperCasedName];

  let actions = Reflux.createActions(actionNames);
  // extend load action
  actions['load' + upperCasedName].preEmit = function (query) {
    if (api['fetch' + upperCasedName]) {
      api['fetch' + upperCasedName](query, (err, data) => {
        if (err) {
          return actions['failedLoading' + upperCasedName](err);
        }

        actions['loaded' + upperCasedName](data);
      });
    } else {
      api['get' + upperCasedName]((err, data) => {
        if (err) {
          return actions['failedLoading' + upperCasedName](err);
        }

        actions['loaded' + upperCasedName](data);
      });
    }
  };
  return actions;
}
