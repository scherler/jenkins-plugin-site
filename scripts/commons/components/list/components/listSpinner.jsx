import React from 'react';
import pure from 'react-mini/pure';

//import Spinner from '../../../atoms/spinner';
const Spinner = require('../../../atoms/spinner');

const spinnerStyle = {
  fontSize: 22,
  marginRight: 'auto',
  marginLeft: 'auto'
};

const flex = 'flex align-items-center';

export default pure( ( { height } ) => {
  const style = {
    height: height
  };

  return <div className={flex} style={style}>xxx<Spinner style={spinnerStyle}/></div>
});
