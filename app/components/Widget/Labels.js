import React, { PropTypes, Component } from 'react';
import LabelWidgetItem from './LabelWidgetItem';
import Immutable from 'immutable';

export default class LabelWidget extends Component {

  state = {
    field: 'key',
    asc: false
  };

  static propTypes = {
    labels: PropTypes.any.isRequired,
    filter: PropTypes.any.isRequired,
    setFilter: PropTypes.func.isRequired
  }

  handleClick = (data) => {
    this.props.setFilter(new Immutable.Record({
      searchField: 'labels',
      field: this.props.filter.title || 'title',
      search: [data],
      asc: this.props.filter.asc || true
    }));
  }

  render() {
    const { labels } = this.props;
    const { field, asc } = this.state;
    const sortedLabels = labels.sortBy(
      label => {
        let value = label[field];
        if(field === 'value') {
          value =  Number(value);
        }
        return value;
      },
      (label, nextLabel) => {
        if (asc) {
          if (field === 'key') {
            return nextLabel.localeCompare(label);
          } else {
            return nextLabel - label;
          }
        } else {
          if (field === 'key') {
            return label.localeCompare(nextLabel);
          } else {
            return label - nextLabel;
          }
        }
      }
    );

    return (
      <div className="filter-keys dropdown-menu">
      {
        sortedLabels.valueSeq().map(
        (item, index) => {
          return (<LabelWidgetItem key={index} index={index} item={item} onClick={this.handleClick.bind(null, item.key)}/>);
        })
      }
      </div>);
  }
}
