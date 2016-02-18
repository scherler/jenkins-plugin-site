import React, { PropTypes, Component } from 'react';
import LabelWidgetItem from './LabelWidgetItem';

export default class LabelWidget extends Component {

  state = {
    field: 'key',
    asc: false
  };

  static propTypes = {
    labels: PropTypes.any.isRequired,
    onClick: PropTypes.func
  };

  render() {
    const { labels, onClick } = this.props;
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
          return (<LabelWidgetItem key={index} index={index} item={item} onClick={onClick}/>);
        })
      }
      </div>);
  }
}
