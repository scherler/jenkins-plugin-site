/* eslint-disable no-console */ //This is because we are using console log for communications
const
  express = require('express'),
  schedule = require('node-schedule'),
  async = require('async');

const flatDb = require('./db');
const createPluginDb = require('./createPluginsDb');

const db = '/tmp/plugin-site';
const categoryFile = `${__dirname}/static/category-plugins.json`;

const
  rest = express(),
  backendPort = '3000';

var lastModified = new Date();

schedule.scheduleJob('1 1 1 * * *', () => {
  console.log('scheduled indexing started');
  createPluginDb(db, (err) => {
    if (err) {
      callback(err);
    }
    flatDb(db, categoryFile, (err, data)=> {
      if (err) {
        callback(err);
      }
      this.dbStore = data;
      lastModified = new Date();
      console.log('scheduled indexing finished');
    });
  });
});


function getOptions(req) {
  if(!req.query) {
    return null;
  }
  var page = Number(req.query.page) || 1;
  var limit =  Number(req.query.limit) || 50;
  var category = req.query.category || null;
  var sort =  req.query.sort || 'title';
  var labelFilter = req.query.labelFilter;
  var latest =  req.query.latest;
  var asc =  req.query.asc? req.query.asc === 'true' : true;
  return options = {
    sort,
    asc,
    labelFilter,
    category,
    latest,
    page: page || 1,
    limit: limit || 10
  };
}

function setRestHeader(res) {
  res
    .header('Access-Control-Allow-Origin', '*')
    .header('Access-Control-Allow-Headers', 'X-Requested-With')
    .header('Last-modified', lastModified)
  ;
}
rest.get('/getCategories', (req, res) => {
  setRestHeader(res);
  const id = req.query ? req.query.id : '';
    this.dbStore.getCategories({id: id}, (err, data) => {
        res.send(err || data);
    });
});

rest.get('/latest', (req, res) => {
  setRestHeader(res);
  res.send(this.dbStore.latest());
});

rest.get('/labels', (req, res) => {
  setRestHeader(res);
  res.send(this.dbStore.labels());
});

rest.get('/plugins', (req, res) => {
  setRestHeader(res);
  var q = req.query && req.query.q ? req.query.q : null;
  const options = getOptions(req);
  this.dbStore.search(q, options, (err, result) => {
    res.json(result);
  });
});

rest.get('/', (req, res) => {
  res.send('<a href=\'/plugins\'>Show plugins</a>');
});

async.series([
  (callback) => {
    createPluginDb(db, (err) => {
      if (err) {
        callback(err);
      }
      flatDb(db, categoryFile, (err, data)=> {
        if (err) {
          callback(err);
        }
        this.dbStore = data;
        callback();
      });
    });
  },
  (callback) => {
    rest.listen(backendPort, () => {
      console.log('Listening backend port', backendPort);
      callback();
    });
  }
], (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('finished');
  }

});


