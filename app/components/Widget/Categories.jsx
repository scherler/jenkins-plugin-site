import React, { PropTypes } from 'react';
import classNames from 'classnames';
import styles from './Widget.css';
import { logger } from '../../commons';
import PureComponent from 'react-pure-render/component';

const categories = [{
  id: 'scm',
  title: 'SCM Connectors'
}, {
  id: 'build',
  title: 'Build and Analysis'
}, {
  id: 'deployment',
  title: 'Deployment'
}, {
  id: 'pipelines',
  title: 'Pipelines'
}, {

  id: 'containers',
  title: 'Containers'
}, {
  id: 'security',
  title: 'Users and Security'
}, {
  id: 'general',
  title: 'General Purpose'
}];

export class Category extends PureComponent {

  static propTypes = {
    onClick: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
    id: PropTypes.any.isRequired,
    title: PropTypes.any.isRequired,
    active: PropTypes.any.isRequired
  };

  render() {
    const { id, onClick, active, title, remove } = this.props;
    return (<li key={id} className={classNames(styles[id], id)}>
      {active && <span
        onClick={remove}
        className="glyphicon glyphicon-remove">remove Filter</span>}
      <a
        className={classNames(styles.li, 'list-group-item', active)}
        onClick={onClick}
      >{title} </a>
    </li>);
  }
}

export default class Categories extends PureComponent {

  static propTypes = {
    router: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  };

  render() {
    const {location, router} = this.props;
    return (<ul className="list-group">
      <li className={classNames(styles.title, 'label')}>
        <div className={classNames(styles.li, 'list-group-item')}>Categories</div>
      </li>
      {categories.map(
        (item, index) => {
          return (<Category
            key={index}
            title={item.title}
            id={item.id}
            active={(location.query.category === item.id) ? 'active' : ''}
            remove={ (e) => {
                e.preventDefault();
                delete location.query.category;
                router.replace(location);
              }
            }
            onClick={()=> {
                location.query = {category: item.id};
                logger.log(location);
                router.replace(this.props.location);
              }
            }
          />);
        }
      )}
    </ul>);
  }
}
