import React, { Component, PropTypes } from 'react';

class Filters extends Component {

  renderOptionGroup(group) {
      const { toggleFilter, appliedFilters } = this.props;
      return group.map((item, idx) => {
          const { attribute, value } = item;
          const isActive = active(appliedFilters, attribute, value);
          const style = {
              background: isActive ? 'yellow': 'white'
          };
          return <div key={idx} style={style} onClick={() => toggleFilter(attribute, value)}>
              {item.value}
          </div>;
      });

  }

  sortItems() {
      const { sortItems, applySort } = this.props;
      const handleSortChange = (e) => {
          if (!e.target.value) return;
          const idx = e.target.value;
          applySort(sortItems[idx]);
      };
      return <select onChange={(e) => handleSortChange(e)} >
          <option value="" disabled>Sort Functions</option>
          {sortItems.map((item, idx) => {
              return <option key={idx} value={idx}>{item.title}</option>;
          })}
      </select>;
  }

  renderRecurse(children) {
      const { toggleFilter, appliedFilters } = this.props;
      return <ul>
          {children.map(child => {
              const { value, count, attribute } = child;
              const style = active(appliedFilters, attribute, value) ? {
                  background: 'yellow'
              } : {};
              return <li>
                  <div style={style} onClick={() => toggleFilter(attribute, value)} >{value} ({count})</div>
                  {child.children && this.renderRecurse(child.children)}
              </li>;
          })}
      </ul>;
  }

  renderTopLevel(topObj) {
      const { value, children } = topObj;
      return <div>
          <header>{value}</header>
          {this.renderRecurse(children)}
      </div>;
  }
  render() {
      const { optionGroups } = this.props;
      // so there is only one option group
      const items = optionGroups[0].values.map(item => this.renderTopLevel(item));

      return <div className="filters">{items}</div>;
  }
}
