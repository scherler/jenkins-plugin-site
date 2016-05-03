import React, { PropTypes } from 'react';
import { logger } from '../../commons';
import PureComponent from 'react-pure-render/component';

const items = [{
  id: 'title',
  state: 'name',
  title: 'Name'
}, {
  id: 'requiredCore',
  state: 'core',
  title: 'Core version'
}, {
  id: 'buildDate',
  state: 'updated',
  title: 'Updated'
}, {
  id: 'releaseTimestamp',
  state: 'created',
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

  static propTypes = {
    browserHistory: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
  };

  render() {
    const {location, browserHistory} = this.props;
    const {asc = false, sort = 'title'} = location.query;
    return (<li className="nav-item btn-group">
      <button
        className="nav-link dropdown-toggle"
        type="button"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false">
        sort: <b>{items.find(item => item.id === sort).title}</b></button>

      <div className="dropdown-menu">

        { items.map((item, index) => {
          return (<SortItem key={index}
            title={item.title}
            onClick={()=> {
             location.query.sort = item.id;
             location.query.asc = !(asc === 'true');
             logger.log(location);
             browserHistory.push(location);
            }} />);
        })}

      </div>
    </li>);
  }
}
