module.exports = {
  components: require('./components'),
  hoc: require('./hoc'),
  mixins: {
     readStore: require('./mixins/readStore')
  },
  router: require('./router/router'),
  utils: require('./utils'),
  warning: require('./warning')
};
