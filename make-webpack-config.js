/* eslint-disable no-var */
var webpack = require('webpack');
var path = require('path');

function extsToRegExp(exts) {
  return new RegExp('\\.(' + exts.map(function(ext) {
    return ext.replace(/\./g, '\\.') + '(\\?.*)?';
  }).join('|') + ')$');
}
function loadersByExtension(obj) {
  var loaders = [];
  // var extensions = Object.keys(obj).map(function(key) {
  //   return key.split('|');
  // }).reduce(function(arr, a) {
  //   arr.push.apply(arr, a);
  //   return arr;
  // }, []);
  Object.keys(obj).forEach(function(key) {
    var exts = key.split('|');
    var value = obj[key];
    if(Array.isArray(value)) {
      loaders.push({
        extensions: exts,
        test: extsToRegExp(exts),
        loaders: value
      });
    } else if (typeof value === 'string') {
      loaders.push({
        extensions: exts,
        test: extsToRegExp(exts),
        loader: value
      });
    } else {
      value.extensions = exts;
      value.test = extsToRegExp(exts);

      loaders.push(value);
    }
  });
  return loaders;
}

function getJenkinsBuildInformation() {
  return {
    timeStamp: new Date().toISOString(),
    revision: process.env.GIT_COMMIT || 'HEAD',
    branch: process.env.GIT_BRANCH || 'develop',
    jenkinsTag: process.env.BUILD_TAG || 'local',
    //jenkinsUrl: process.env.BUILD_URL || undefined,
    version: require('./package.json').version
  };
}

module.exports =  function (options) {
  var rootPath = __dirname +'/';
  var root = path.join(rootPath, "scripts");
  var extensions = ["", ".web.js", ".js", ".jsx"];
  var loaders = {
    "coffee": "coffee-redux-loader",
    "jsx": options.hotComponents ? ["react-hot-loader", "babel-loader"] : "babel-loader",
    "js": {exclude: /node_modules/, loader: 'babel-loader'},
    "json": "json-loader",
    "json5": "json5-loader",
    "txt": "raw-loader",
    "png|jpg|jpeg|gif|svg": "url-loader?limit=10000",
    "woff|woff2": "url-loader?limit=100000",
    "ttf|eot": "file-loader",
    "wav|mp3": "file-loader",
    "html": "html-loader",
    "md|markdown": ["html-loader", "markdown-loader"]
  };
var alias = {
  "react": rootPath + "node_modules/react", // don't use deeper react module (i.e. taibika-client/node_modules/react)
  "lodash": rootPath + "node_modules/lodash", // don't use modern version as default (not compat)
  "moment": rootPath + "node_modules/moment/moment.js", // reduce to one - as used in taibika-client too
  "reflux": rootPath + "node_modules/reflux/src/index.js", // reduce to one - as used in taibika-client too
  "immutable": rootPath + "node_modules/immutable/dist/immutable.js", // reduce to one - as used in taibika-client too
  "jquery": rootPath + "false.js", // shim away for i18next

  // remove react router
  "react-router": rootPath + "false.js",
  "react-router-old": rootPath + "false.js"
};
var aliasLoader = {};
var plugins = [
  new webpack.PrefetchPlugin("react"),
  new webpack.PrefetchPlugin("react/lib/ReactComponentBrowserEnvironment"),
  new webpack.DefinePlugin({"global.GENTLY": false}),
  new webpack.DefinePlugin({
    'process.env': JSON.stringify({
      debug: options.debug,
      NODE_ENV: (options.debug ? 'development' : 'production'),
      buildRevisionInfo: getJenkinsBuildInformation()
    })
  }),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin()
];

  return {
    debug: options.debug,
    devtool: 'source-map',
    entry: [
      'webpack-dev-server/client?http://localhost:5000',
      'webpack/hot/dev-server',
      './scripts/index'
    ],
    resolveLoader: {
      root: path.join(rootPath, "node_modules"),
      alias: aliasLoader
    },
    output: {
      path: rootPath,
      filename: 'bundle.js',
      publicPath: '/static/'
    },
    resolve: {
      root: root,
      extensions: options.extensions,
      alias: alias
    },
    plugins: plugins,
    node: {
      console: false,
      process: true,
      global: true,
      buffer: true,
      __filename: "mock",
      __dirname: false
    },
    module: {
      loaders: loadersByExtension(loaders)
    }
  };
};
/*
[
  {
    test: /\.jsx?$/,
    loaders: ['babel'],
    include: path.join(__dirname, 'scripts')
  }
]
*/
