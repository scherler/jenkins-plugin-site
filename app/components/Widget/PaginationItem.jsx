import React from 'react'

export default function PaginationItem({index, item, onClick}) {
  let href = `#key=${item.key}`;
  return (<a
    href={href}
    key={index}
    className="dropdown-item"
    onClick={onClick}>
      <li className="disabled">
        <a href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a>
      </li>
      <span className="key">{item.key}</span> <span className="count">{item.value}</span>
    </a>);
}
