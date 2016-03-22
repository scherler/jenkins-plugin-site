const fs = require('fs');
const async = require('async');
const queryFields = ['excerpt', 'name', 'title'];

function createResponseResults(docs) {
  return {
    docs,
    limit: docs.length,
    total: docs.length,
    start: 0,
    end: docs.length,
    page: 1,
    pages: 1
  };
}

// It instantiates a local database asynchronously.
module.exports = flatDb = (filename, categoryFile, callback) => {
  var dbStore;
  async.series([
    (cb) => {
      fs.readFile(filename, {encoding: 'utf8'}, (err, data) => {
        if (err)
          return cb(err, null);

        // Parse data
        const rawData = JSON.parse(data);
        dbStore = Object.keys(rawData).map(key => rawData[key]);

        // Adds various library-specific data handles
        dbStore._filename = filename;

        dbStore.latest = () => createResponseResults(
          dbStore.sort((a, b) => a.buildDate.localeCompare(b.buildDate)).slice(0, 10));

        dbStore.search = (query, options, caback) => {
          options = options || {};
          var
            limit = options.limit || 20,
            page = options.page || 1,
            category = options.category,
            sortField = options.sort || 'name',
            labelFilter = options.labelFilter,
            asc = options.asc || true,
            start = (page - 1) * limit,
            end = limit * (page),
            pages, total;

          var result;

          if (category) {
            const categories = dbStore.rawCategories;
            const elementPos = categories
              .map((x) => {
                return x.id;
              })
              .indexOf(category);
             if (elementPos > -1) {
               const pluginsId = categories[elementPos].plugins;
               result = pluginsId.map((pluginName) => dbStore.filter(
                 (plugin) => {
                   return plugin.name === pluginName;
                 })
               ).map(key => key[0]);

             } else  {
               result = dbStore;
             }
          } else {
            result = dbStore;
          }


          if (query) {
            result = result.filter((item) => {
              return queryFields.map(field => item[field].includes(query)).indexOf(true) > -1;
            });

          }
          if (labelFilter) {
            result = result.filter((item) => {
              return item.labels && item.labels.some(searchFilter => {
                return ( labelFilter=== searchFilter);
              });
            });
          }
          result = result.sort((plugin, nextPlugin) => {
            if (!asc) {
              return nextPlugin[sortField].localeCompare(plugin[sortField]);
            } else {
              return plugin[sortField].localeCompare(nextPlugin[sortField]);
            }
          });
          total = result.length;
          pages = Math.floor(total / limit) || 1;
          caback(null, {
            limit,
            start,
            end,
            total,
            page,
            pages,
            docs: result.slice(start, end),
          });
        };

        dbStore.getCategories = (options, caback) => {
          if (!caback && typeof options === 'function') {
            caback = options;
            options = {};
          }

          const categories = dbStore.rawCategories;

          if (options.id) {
            const elementPos = categories
              .map((x) => {
                return x.id;
              })
              .indexOf(options.id);
            if (elementPos < 0) {
              caback('no category with that id found!');
            }
            const pluginsId = categories[elementPos].plugins;
            const result = pluginsId.map((pluginName) => dbStore.filter(
              (plugin) => {
                return plugin.name === pluginName;
              })
            ).map(key => key[0]);
            caback(null, createResponseResults(result));
          } else {
            var response = {};
            async.forEach(categories, (category, caback) => {
              response[category.id] = category.plugins.map(
                (pluginName) => dbStore.filter(
                  (plugin) => {
                    return plugin.name === pluginName;
                  }));
              caback();
            }, (err) => {
              caback(err, response);
            });
          }

        };


        cb();


      });
    }, (cb) => {
      fs.readFile(categoryFile, 'utf8', (err, contents) => {
        dbStore.rawCategories = JSON.parse(contents);
        cb();
      });
    }
  ], () => {
    // Make _filename and save non-enumerable so that they dont mess up dbStore.length
    Object.defineProperties(dbStore, {
      '_filename': {
        enumerable: false
      },
      'save': {
        enumerable: false
      },
      'search': {
        enumerable: false
      },
      'latest': {
        enumerable: false
      },
      'getCategories': {
        enumerable: false
      },
      'rawCategories': {
        enumerable: false
      }
    });
    callback(null, dbStore);
  });

};
