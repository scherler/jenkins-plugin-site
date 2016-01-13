import React from 'react';

let ListHeaderHeroButton = React.createClass({

  propTypes: {
    onClick: React.PropTypes.func.isRequired,
    label: React.PropTypes.string.isRequired,
    iconClass: React.PropTypes.string.isRequired
  },

  getDefaultProps () {
    return {
      onClick: function () {
      },
      label: '',
      iconClass: ''
    };
  },

  getInitialState(){
    return {
      dropdownOpen: false
    };
  },

  toggleDropdown(){
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  },

  render () {
    const { children, label, iconClass } = this.props;

    // if child components are present, render this button as dropdown
    let buttonIconClass;

    let clickHandler;
    if (children) {
      clickHandler = this.toggleDropdown;
      buttonIconClass = this.state.dropdownOpen ? 'kaba-icon-closeinline' : 'kaba-icon-openinline';
    } else {
      clickHandler = this.props.onClick;
      buttonIconClass = 'kaba-icon-plus2';
    }

    return (
      <div className="list-header list-header-btn-hero list-header-btn-hero-dropdown">
        <button className='btn btn-hero' onClick={clickHandler}>
          <div className="btn-hero-icon">
            <i className={ iconClass}></i>
          </div>

          { label}

          <i className={buttonIconClass}></i>
        </button>

        {this.state.dropdownOpen && children }

      </div>
    );
  }
});

module.exports = ListHeaderHeroButton;
