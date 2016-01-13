import React from 'react';
import pure from 'react-mini/pure';
import env from '../../../utils/env';

export default pure( ( {
  noEntries,
  emptyListText,
  noSearchResultText,
  styles,
  className
  } ) => {
  let text = emptyListText || 'list.noEntries';
  if (!noEntries) text = noSearchResultText || 'list.nothingFound';
  let mergedClassName = className || '';
  mergedClassName += ' flex align-items-center';

  return (
    <li key='empty-state' className={mergedClassName} style={styles}>
      <i className='icon-confused'/><p style={style}>{text}</p>
    </li>);
});
