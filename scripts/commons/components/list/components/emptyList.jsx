import React from 'react';
import pure from 'react-mini/pure';
import env from '../../../utils/env';
import {vars as v, colors as c} from '../../../style';
import autoprefix from 'auto-prefixer';

if (env.isBrowser)
  require('../../../style/layout.styl');

const border = {
  boxShadow: 'inset 0px 0px 0px 1px ' + c.lightGray
};
const iStyle = autoprefix({
  ...border,
  marginLeft: '0.5em',
  display: 'inline-flex',
  marginRight: '0.5em',
  marginTop: '.5em',
  padding: '0.5em'
});
const liStyle = {
  ...border,
  width: '100%',
  height: 70,
  background: 'none',
  position: 'absolute',
  color: c.textGray,
  fontSize: v.fontSize.icon
};

const style = {
  margin: 0,
  padding: 0,
  display: 'inline-block',
  fontFamily: v.font.serif,
  fontSize: v.fontSize.content
};

export default pure(({
  noEntries,
  emptyListText,
  noSearchResultText,
  styles,
  className
  }) => {
  let mergedStyle = autoprefix({
    ...liStyle,
    ...styles
  });
  let text = emptyListText || 'list.noEntries';
  if (!noEntries)
    text = noSearchResultText || 'list.nothingFound';
  let mergedClassName = className || '';
  mergedClassName += ' flex align-items-center';

  return (
    <li key='empty-state' className={mergedClassName} style={mergedStyle}>
      <i className='icon-issue-closed' style={iStyle}/>
      <p style={style}>{text}</p>
    </li>
  );
});
