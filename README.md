# Jenkins plugin site
This is a simple rendering of the plugin list as taken from updates.jenkins-ci.org/current/update-center.json.

# Build with React ES6 Webpack Boilerplate

Original repo: git@github.com:vasanthk/react-es6-webpack-boilerplate.git

Boilerplate for kick starting a project with the following technologies:
* [React](https://github.com/facebook/react)
* [Babel 6](http://babeljs.io)
* [Webpack](http://webpack.github.io) for bundling
* [Webpack Dev Server](http://webpack.github.io/docs/webpack-dev-server.html)
* [React Transform](https://github.com/gaearon/react-transform-hmr) for hot reloading React components in real time.

The various webpack options used have been explained in detailed as comments in the config file. Should help with understanding the nitty-gritty :)

### Run with Docker

```
docker build -t jenkins-plugin-site .
docker run -d -p 5000:5000 --name plugins jenkins-plugin-site
Point to http://0.0.0.0:5000/
```

### Usage with npm

```
npm install
npm start
Open http://localhost:5000
```

### Linting with npm

ESLint with React linting options have been enabled.

```
npm run lint
```

You can use the --fix flag in this command and it will try to fix all
offenses, whoever there maybe some more that you need to fix manually.

Remember:

```
npm run [command] [-- <args>]
```

Note the necessary --. 

```
npm run lint -- --fix
```
