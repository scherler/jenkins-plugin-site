import React from 'react'

export default function LabelWidgetItem({index, item, onClick}) {
  let href = `#key=${item.key}`;
  return (<a
    href={href}
    key={index}
    className="dropdown-item"
    onClick={onClick}>
      <span className="key">{item.key}</span> <span className="count">{item.value}</span>
    </a>);
}
