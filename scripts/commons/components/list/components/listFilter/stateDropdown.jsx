import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import env from '../../../../utils/env';

var StateGroup = React.createClass({
  displayName: 'StateGroup',

  propTypes: {
    groupId: React.PropTypes.number.isRequired,
    groupName: React.PropTypes.string.isRequired,
    choices: React.PropTypes.array,
    onChange: React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      groupId: '-1',
      choices: [],
      onChange: function() {}
    };
  },

  componentWillMount: function() {
    var state = {};

    for (var i = 0, len = this.props.choices.length; i < len; i++) {
      state[i] = this.props.choices[i].selected || false;
    }

    this.setState({checked: state});
    this.props.onChange(this.props.groupId, state);
  },

  componentWillReceiveProps: function(props) {
    var state;

    if (props.activeGroup !== null && props.activeGroup !== this.props.groupId) {
      state = this.state.checked;
      for (var m in state) {
        state[m] = false;
      }
      this.setState({checked: state});
    }
    // having a preset case
    else if (props.activeGroup === null) {
      state = {};

      for (var i = 0, len = props.choices.length; i < len; i++) {
        state[i] = props.choices[i].selected || false;
      }

      this.setState({checked: state});
      this.props.onChange(this.props.groupId, state);
    }
  },

  onCheck: function(i) {
    this.state.checked[i] = !this.state.checked[i];

    this.setState({checked: this.state.checked});
    this.props.onChange(this.props.groupId, this.state.checked);
  },

  render: function () {
    return (
      <li className="state-group">
        <ul>
          {this.props.choices.map(function(item, i) {
            var id = this.props.groupName + '_' + this.props.groupId + '_' + i;
            var boundClick = this.onCheck.bind(this, i, id, item);

            return (
              <li className='checkbox' key={id}>
                <input id={id} type='checkbox' onChange={boundClick} checked={this.state.checked[i]}/>
                <label htmlFor={id}>{item.label}</label>
              </li>
            );
          }, this)}
          <li className='separator'></li>
        </ul>
      </li>
    );
  }
});

/**
 * Renders a selection dropdown.
 * (one per filter criteria)
 */
var StateDropdown = React.createClass({

  displayName: 'StateDropdown',

  propTypes: {
    stateId: React.PropTypes.number,
    filter: React.PropTypes.object,
    onChange: React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      stateId: -1,
      filter: {},
      onChange: function() {}
    };
  },

  getInitialState: function() {

    return {
      open: false,
      activeGroup: null,
      groupState: {},
      didPreset: false
    };
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.didPreset && !this.state.didPreset) {
      this.setState({
        didPreset: nextProps.didPreset,
        activeGroup: null
      });
    }
  },

  toggle: function() {
    this.setState({ open: !this.state.open });
  },

  handleOutsideClick: function (event) {
    function isNodeInRoot(node, root) {
      while (node) {
        if (node === root) {
          return true;
        }
        node = node.parentNode;
      }

      return false;
    }

    if (this.state.open) {
      if (!isNodeInRoot(event.target, ReactDOM.findDOMNode(this))) {
        this.setState({ open: !this.state.open });
      }
    }
  },

  componentWillMount: function () {
    if (env.isBrowser && window) window.addEventListener('click', this.handleOutsideClick, false);
  },

  componentWillUnmount: function() {
    if (env.isBrowser && window) window.removeEventListener('click', this.handleOutsideClick, false);
  },

  onChoiceGroupChange: function(groupId, state, silent) {
    var nothingSelected = !_.some(state, function(i) { return i; });

    this.state.groupState[groupId] = state;

    if (nothingSelected) {
      var adjGroup = groupId === 0 ? groupId + 1: 0;
      _.forEach(this.state.groupState[adjGroup], function(i, key) {
        this.state.groupState[adjGroup][key] = true;
      }.bind(this));

      this.setState({
        activeGroup: adjGroup
      });
    } else {
      this.setState({
        activeGroup: groupId
      });
    }

    if (!silent) this.props.onChange(this.props.stateId, this.state.groupState);
  },

  getButtonLabel: function() {
    var label = _.chain(this.state.groupState[this.state.activeGroup])
      .map(( i, k ) => i === true? this.props.filter.choices[this.state.activeGroup][k].label: '')
      .filter(lbl => lbl && lbl.length > 0)
      .value()
      .join(', ');

    if (label.length <= 0) {
      label = '...';
    }

    return label;
  },

  render: function () {
    var dropdownClass = this.state.open ? 'dropdown-menu open' : 'dropdown-menu';
    var buttonClass = this.state.open ? 'dropdown-open' : 'dropdown-close';

    var label = null;
    if (this.props.filter.label) label = <label>{this.props.filter.label}</label>;

    return (
      <div className='dropdown filter-dropdown'>
        {label}
        <button className={ 'btn btn-white ' + buttonClass  } onClick={this.toggle}>{this.getButtonLabel()}</button>
        <ul role='menu' className={dropdownClass}>
          {this.props.filter.choices.map(function(item, i) {

            return (<StateGroup key={this.props.filter.name + '_stategroup_' + i}
                    groupId={i} groupName={this.props.filter.name} activeGroup={this.state.activeGroup}
                    choices={item} onChange={this.onChoiceGroupChange} />);
          }, this)}
        </ul>
      </div>
    );
  }
});

module.exports = StateDropdown;
