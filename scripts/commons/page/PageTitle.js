import React from 'react';
import classNames from 'classnames';
import BackButton from './BackButton';


const PageTitle = React.createClass({

  propTypes: {
    routes: React.PropTypes.node,
    label: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.node
    ]).isRequired,
    showBackButton: React.PropTypes.bool,
    backButtonNavigateTo: React.PropTypes.string,
    state: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      label: '',
      showBackButton: true
    };
  },

  render: function() {
    var backButtonCond = null;
    if (this.props.showBackButton) {
      backButtonCond = <backButton to={this.props.backButtonNavigateTo} routes={this.props.routes} />;
    }

    var titleClass = classNames({
      'title': true,
      'flex-grow-9': true,
      'success': this.props.state === 'success',
      'warning': this.props.state === 'warning',
      'error': this.props.state === 'error'
    });

    return (
      <div className="col-1 content-title inline-flex">
        {backButtonCond}
        <div className={titleClass} style={{overflow: 'hidden'}}>
          <span>{this.props.label}</span>
        </div>
      </div>
    );
  }
});

module.exports = PageTitle;
