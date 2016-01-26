import React from 'react';
import router from '../router/router';

let BackButton = function Back(props) {
  return (
    <div className='nav-back'>
      <a className='btn btn-fill' onClick={() => {
        props.to
          ? router.navigate(props.to)
          : window.history.back();
      }}>
        <i className="icon-back"/>
      </a>
    </div>
  );
};

module.exports = BackButton;
