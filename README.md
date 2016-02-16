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

### Testing

We have created different test environments that you can us during development.

#### TDD support via watch

```
npm run test:watch
```

Can be used for TDD with a rapid feedback loop (as soon you save all tests will run)

#### Debug Tests in a Browser

Mocha tests typically use require statements and often access the file system,
so running them directly in the browser is challenging.
The next best thing is to use node-inspector, which connects a version of the
Chrome dev tools to the Node runtime used by Mocha.

To use this (only once):

```
npm install -g node-inspector

```
Then you can use:

```
npm run test:debug
```

Then run node-inspector. It will prompt you to open a browser at a debug URL.
From there, you can set breakpoints and inspect variables in the same way
you would in the Chrome Dev Tools.
