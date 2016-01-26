'use strict';

var React = require('react'),
    moment = require('moment');

module.exports = React.createClass({

  propTypes: {
    date: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.instanceOf(Date)
    ]).isRequired,
    showDateBefore: React.PropTypes.number,
    parseAgo: React.PropTypes.func,
    parseDate: React.PropTypes.func,
    style: React.PropTypes.object
  },

  getDefaultProps: function() {
    return {
      showDateBefore: 14,
      parseAgo: function(str) { return str; },
      parseDate: function(str) { return str; },
      style: {}
    };
  },

  componentDidMount: function() {
    var self = this;

    this.interval = setInterval(function() {
      self.forceUpdate();
    }, 60000);
  },

  componentWillUnmount: function() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  },

  render: function () {
    var dateToShow = moment(this.props.date);
    var showAsDate = dateToShow.diff(moment(), 'days') >= this.props.showDateBefore;

    var result = '';

    if (showAsDate) {
      result = this.props.parseDate(dateToShow.format('lll'));
    } else {
      result = this.props.parseAgo(dateToShow.fromNow(true));
    }

    return <span style={this.props.style}>{result}</span>;
  }

});
