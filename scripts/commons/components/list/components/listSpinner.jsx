import React from 'react';
import pure from 'react-mini/pure';

//import Spinner from '../../../atoms/spinner';
const SpinnerAtom = require('../../../atoms/spinner');

const spinnerStyle = {
  fontSize: 22,
  marginRight: 'auto',
  marginLeft: 'auto'
};

const flex = 'flex align-items-center';

const Spinner = pure( ( { height } ) => {
  const style = {
    height: height
  };

  return <div className={flex} style={style}><SpinnerAtom style={spinnerStyle}/></div>
});

module.exports = Spinner;
