const knowLabelsToCategories = require('./knownLabelsToCategory');
const kownPluginsToCategories = require('./knownPluginsToCategory');

module.exports = (plugin) => {
  var category = 'other';
  if (kownPluginsToCategories[plugin.name]) {
    category = kownPluginsToCategories[plugin.name];
  } else if (plugin.labels && plugin.labels[0] && knowLabelsToCategories[plugin.labels[0]]) {
    category = knowLabelsToCategories[plugin.labels[0]];
  }
  return category;
};
