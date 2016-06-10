/**
 * WEBPACK CONFIG
 *
 * Notes on config properties:
 *
 * 'entry'
 * Entry point for the bundle.
 *
 * 'output'
 * If you pass an array - the modules are loaded on startup. The last one is exported.
 *
 * 'resolve'
 * Array of file extensions used to resolve modules.
 *
 * devtool: 'eval-source-map'
 * http://www.cnblogs.com/Answer1215/p/4312265.html
 * The source map file will only be downloaded if you have source maps enabled and your dev tools open.
 *
 * OccurrenceOrderPlugin
 * Assign the module and chunk ids by occurrence count. Ids that are used often get lower (shorter) ids.
 * This make ids predictable, reduces to total file size and is recommended.
 *
 * UglifyJsPlugin
 * Minimize all JavaScript output of chunks. Loaders are switched into minimizing mode.
 *    - 'compress'
 *      Compressor is a tree transformer which reduces the code size by applying various optimizations on the AST.
 *
 * 'NODE_ENV'
 * React relies on process.env.NODE_ENV based optimizations.
 * If we force it to production, React will get in an optimized manner.
 * This will disable some checks (eg. property type checks) and give you a smaller build and improved performance.
 *    Note: That JSON.stringify is needed as webpack will perform string replace "as is".
 *    In this case we'll want to end up with strings as that's what various comparisons expect, not just production.
 *    Latter would just cause an error.
 *
 * 'babel'
 * Babel enables the use of ES6 today by transpiling your ES6 JavaScript into equivalent ES5 source
 * that is actually delivered to the end user browser.
 */

/* eslint-disable no-var */
const webpack = require('webpack');
const path = require('path');
//var ejs = require('ejs');
//var fs = require('fs');

const StaticSitePlugin = require('react-static-webpack-plugin');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const stylusLoader = ExtractTextPlugin.extract('style-loader', 'css-loader!stylus-loader');
//var StaticSiteGeneratorPlugin = require('static-render-webpack-plugin');
// new StaticSiteGeneratorPlugin('bundle.js', ['/'], temp)
//var template = ejs.compile(fs.readFileSync(__dirname + '/template.ejs', 'utf-8'))
//const temp = { template: template };

const GLOBALS = {
  'process.env.NODE_ENV': JSON.stringify('production'),
  __DEV__: false
};

module.exports = {
  compress: true,
  target:  'web',
  cache:   false,
  context: __dirname,
  debug:   true,
  devtool: false,
  entry: {
    main: [ './app/index' ]
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    libraryTarget: 'umd',
    publicPath: '/',
		chunkFilename: "[name].[id].js",
  },
  node: {
		__dirname: true,
		fs:        'empty'
	},
  resolve: {
    modulesDirectories: [
			"app",
			"node_modules",
		],
    extensions: ['', '.js', '.jsx']
  },
  plugins: [
    new ExtractTextPlugin('styles.css'),
    new webpack.DefinePlugin(GLOBALS),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new StaticSitePlugin({
      src: 'main',             // Chunk or file name
      bundle: '/bundle.js',      // Path to JS bundle
      stylesheet: '/css/base.css', // Path to stylesheet (if any)
    }),
  ],
  module: {
    noParse: /\.min\.js/,
    loaders: [
      {
        test: /\.(jsx|js)$/,
        loader: 'babel',
        include: path.join(__dirname, 'app'),
        exclude: /node_modules/,
        query: {
          cacheDirectory: true,
          plugins: ['transform-runtime'],
          presets: ['es2015', 'react', 'stage-0'],
          env: {
            production: {
              presets: ['react-optimize']
            }
          }
        }
    },
    {
      test: /\.styl?$/,
      loader: stylusLoader
    },
    {
      test: /\.css$/,
      loaders: ['style', 'css?modules&importLoaders=1', 'cssnext'],
      exclude: path.join(__dirname, 'node_modules')
    }
    ]
  }
};
