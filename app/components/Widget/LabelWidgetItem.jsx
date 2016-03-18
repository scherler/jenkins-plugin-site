import React from 'react'


export default function LabelWidgetItem({index, item, onClick}) {
  /*
  let href = `#key=${item.key}`;
    href={href}
   */
  return (<a
    key={index}
    className="dropdown-item"
    onClick={onClick}>
      <span className="key">{item.key}</span>
    </a>);
}
