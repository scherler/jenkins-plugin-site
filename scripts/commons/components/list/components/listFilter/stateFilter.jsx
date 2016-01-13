'use strict';

var React = require('react');

var StateDropdown = require('./stateDropdown');

var StateFilter = React.createClass({

  displayName: 'StateFilter',
  propTypes: {
    filters: React.PropTypes.array,
    onChange: React.PropTypes.func.isRequired,
    didPreset: React.PropTypes.bool
  },

  getDefaultProps: function () {
    return {
      filters: [],
      didPreset: false,
      onChange: function () {}
    };
  },

  getInitialState: function () {
    return {
      filterState: {},
      open: false
    };
  },

  onChoiceChange: function (stateId, selection) {
    this.state.filterState[stateId] = selection;

    this.props.onChange(this.state.filterState);
  },

  render: function () {

    return (
      <div className="form-group filters">
        {this.props.filters.map(function (item, i) {
          return <StateDropdown key={item.name} stateId={i} filter={item} didPreset={this.props.didPreset} onChange={this.onChoiceChange}/>;
        }, this)}
      </div>
    );
  }
});

module.exports = StateFilter;
