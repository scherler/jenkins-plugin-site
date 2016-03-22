import React, { PropTypes } from 'react';
import { logger } from '../../commons';
import PureComponent from 'react-pure-render/component';

const sortItems = [{
  id: 'name',
  title: 'Name'
}, {
  id: 'requiredCore',
  title: 'Core version'
}, {
  id: 'buildDate',
  title: 'Updated'
}, {
  id: 'releaseTimestamp',
  title: 'Created'
}];

export class SortItem extends PureComponent {

  static propTypes = {
    title: PropTypes.any.isRequired,
    onClick: PropTypes.func.isRequired,
  };

  render() {
    const { title, onClick } = this.props;
    return (<a className="dropdown-item" onClick={onClick}>{title}</a>);
  }

}

export default class Sort extends PureComponent {

  state = {
    sort: 'title',
  };

  static propTypes = {
    browserHistory: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
  };

  render() {
    return (<li className="nav-item btn-group">
      <button
        className="nav-link dropdown-toggle"
        type="button"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false">
        sort: <b>{this.state.sort}</b></button>

      <div className="dropdown-menu">

        { sortItems.map((item, index) => {
          return (<SortItem key={index}
            title={item.title}
            onClick={()=> {
             this.setState({ sort: item.id });
             this.props.location.query.sort = item.id;
             logger.log(this.props.location);
             this.props.browserHistory.replace(this.props.location);
            }} />);
        })}

      </div>
    </li>);
  }
}
