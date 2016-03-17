const flatDb = require('./db');
const async = require('async');
const createPluginDb = require('./createPluginsDb');

const db = '/tmp/plugin-site';
const categoryFile = '/home/thorsten/src/cloudbees/jenkins-infra/plugin-site/server/static/category-plugins.json';

var data;

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
        this.data = data;
        callback();
      })
    });
  },
  (callback) => {
    /*
     console.log('data', this.data.search({
     q: 'git'
     }, {
     limit: 10,
     page: 1
     }));
     */
    this.data.getCategories({id: 'build'}, (err, data) => {
      console.log('data', data);
    });

    //console.log('data',  this.data.latest());
  }
]);


