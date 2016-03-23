const async = require('async');
const flatDb = require('../server/db');
/* eslint-disable no-console */ //This is because we are using console log for communications

var dbStore = {};

async.series([
(callback) => {
  const db = './plugin-site-testing';
  const categoryFile = '../server/static/category-plugins.json';
  flatDb(db, categoryFile, (err, data) => {
    if (err) {
      done(err);
    }
    dbStore = data;
    callback();
  });
},
], () => {
  const
    q = 'ss',
    options = {
      latest: 'latest',
      sort: 'requiredCore',
      asc: false,
      page: 1,
      category: 'deployment',
      labelFilter: 'builder',
      limit: 50
  };
  dbStore.search(q, options, (err, result) => {
    console.log('it', result);
  });
});

