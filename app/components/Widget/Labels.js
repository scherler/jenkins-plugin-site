import React, { PropTypes, Component } from 'react'

export function LabelWidgetItem ({index, item}) {
  return (<li key={index}>{item.key}: {item.value}</li>);
}

export default class LabelWidget extends Component {

  state = {
    field: 'key',
    asc: false
  };

  static propTypes = {
    labels: PropTypes.any.isRequired
  };

  render () {
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

    return (<ul>
      <li>
        <button onClick={()=>  {
          this.setState({
            field: 'key',
            asc: !asc
          });
        }}>Sort names</button>
        <button onClick={()=>  {
          this.setState({
            field: 'value',
            asc: !asc
          });
        }}>Sort popular</button>
      </li>
      {
        sortedLabels.valueSeq().map(
        (item, index) => {
          return (<LabelWidgetItem key={index} index={index} item={item}/>)
        })
      }
      </ul>);
  }
}
