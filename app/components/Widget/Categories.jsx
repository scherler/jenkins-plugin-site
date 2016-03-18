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
    id: PropTypes.any.isRequired,
    title: PropTypes.any.isRequired,
    active: PropTypes.any.isRequired
  };

  render(){
    const { id, onClick, active, title } = this.props;
    return (<li key={id} className={classNames(styles[id], id)}>
      <a
        href={`#category=${id}`}
        className={classNames(styles.li, 'list-group-item', active)}
        onClick={onClick}
      >{title}</a>
    </li>)
  }
}

export default class Categories extends PureComponent {

  static propTypes = {
    browserHistory: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  };

  state = {
    category: 'all'
  };

  render() {
    return (<ul className='list-group'>
      <li className={classNames(styles.title, 'label')}>
        <div className={classNames(styles.li, 'list-group-item')}>Categories</div>
      </li>
      {categories.map(
        (item, index) => {
          return (<Category
            key={index}
            title={item.title}
            id={item.id}
            active={(this.state.category === item.id)?'active':''}
            onClick={()=> {
                this.state.category = item.id;
                this.props.location.query= {
                  category: item.id
                };
                logger.log(this.props.location);
                this.props.browserHistory.replace(this.props.location);
              }
            }
          />);
        }
      )}
    </ul>)
  }
}
