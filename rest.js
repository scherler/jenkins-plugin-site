/* eslint-disable no-console */ //This is because we are using console log for communications
const
  express = require('express'),
  request = require('request'),
  mongoose = require('mongoose'),
  _ = require('lodash'),
  mongoosePaginate = require('mongoose-paginate');

const
  Schema = mongoose.Schema,
  rest = express(),
  host = 'updates.jenkins-ci.org',
  url = `https://${host}/current/update-center.json`,
  backendPort = '3000',
  connection = mongoose.connection;

var Plugin;

connection.on('error', console.error);
connection.once('open', () => {
  const pluginSchema = new Schema({
    'buildDate': Date,
    'dependencies': [],
    'developers': [{
      'developerId': String,
      'email': String,
      'name': String
    }],
    'excerpt': String,
    'gav': String,
    'labels': [String],
    'name': String,
    '_updated': {type: Date, default: Date.now},
    '_created': {type: Date, default: Date.now},
    'previousTimestamp': Date,
    'previousVersion': String,
    'releaseTimestamp': Date,
    'requiredCore': String,
    'scm': String,
    'sha1': String,
    'title': String,
    'url': String,
    'version': String,
    'wiki': String
  });

  pluginSchema.plugin(mongoosePaginate);

  Plugin = mongoose.model('Plugin', pluginSchema);
});

function getOptions(req) {
  var page = req.query ? req.query.page : 1;
  var limit = req.query ? req.query.limit : 10;
  return options = {
    lean: true,
    select: 'title name, version requiredCore wiki developers sha1 excerpt',
    sort: { name: 1 },
    page: page || 1,
    limit: limit || 10
  };
}

function search(query, req, callback) {
  const options = getOptions(req);
  Plugin.paginate({}, options, callback);
}

function getAll(req, callback) {
  search({}, req, callback);
}

function setRestHeader(res) {
  res
    .header('Access-Control-Allow-Origin', '*')
    .header('Access-Control-Allow-Headers', 'X-Requested-With');
}

rest.get('/', (req, res) => {
  res.send('<a href=\'/plugins\'>Show plugins</a><a href=\'/indexDb\'>Index db</a>');
});

/* FIXME:
 * we need to decide what to do with this url (it is an update trigger).
 * Either call it from within docker image with cron on regular basis,
 * or via the React Client but with authorisation
 */
rest.get('/indexDb', (req, res) => {
  // Disable caching
  res
    .header('Cache-Control', 'no-cache, no-store, must-revalidate')
    .header('Pragma', 'no-cache')
    .header('Expires', 0);

  req
    .pipe(request(`${url}?date=${Math.round(100000 * Math.random())}`, (error, response, body) => {
    if(error) {
      console.log(error);
    } else {
      if(body) {
        var lines = body.split('\n');
        if(lines.length >= 1){
          var plugins = JSON.parse(lines[1]).plugins;
          connection.db.dropCollection('plugins', (err, result)=> {
            if (result) {
              Plugin.create(_.values(plugins));
            }
          });
        }
      }
    }
    }))
    .pipe(res);
});

rest.get('/plugins', (req, res) => {
  setRestHeader(res);

  getAll(req, (err, result) => {
    res.json(result);
  });
});
//FIXME: Adopt when moving to docker
mongoose.connect('mongodb://localhost/plugins');
rest.listen(backendPort, () => {
  console.log('Listening backend port', backendPort);
});
