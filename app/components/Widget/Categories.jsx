import React, { PropTypes } from 'react';
import classNames from 'classnames';
import styles from './Widget.css';
import { logger } from '../../commons';
import PureComponent from 'react-pure-render/component';

const notMatchingCategories = {
  management: {
    name: 'Management',
    description: 'plugins that add management features for administrators to Jenkins'
  },
  optimization: {
    name: 'Optimization',
    description: `plugins that add advanced functions or improve existing functions’
      performance in Jenkins`
  },
};

export const categories = {
  scm: {
    name: 'Source Code Management',
    description: 'plugins for pulling your code out of source control',
  },
  build: {name: 'Build Tools', description: 'plugins that allow users to build their code'},
  test: {name: 'Test tools', description: 'plugins for testing your code'},
  report: {name: 'Reporting tools', description: 'plugins for reports around your code'},
  deploy: {
    name: 'Deployment',
    description: 'plugins that allow users to deploy applications from Jenkins'
  },
  devops: {name: 'DevOps', description: 'plugins that allows to work with container'},
  security: {name: 'Security', description: 'plugins for securing your code and Jenkins itself'},
  pipelines: {name: 'Pipelines', description: 'plugins that enable continuous delivery in Jenkins'},
  agents: {
    name: 'Build Agents',
    description: 'plugins that allow users to connect their build agents to Jenkins'
  },
  mobile: {name: 'Mobile', description: 'plugins around mobile development ios, android, etc.'},
  other: {name: 'General Purpose', description: 'general purpose plugins'}
};

export class Category extends PureComponent {

  static propTypes = {
    onClick: PropTypes.func.isRequired,
    tooltip: PropTypes.any.isRequired,
    remove: PropTypes.func.isRequired,
    id: PropTypes.any.isRequired,
    title: PropTypes.any.isRequired,
    active: PropTypes.any.isRequired
  };

  render() {
    const { id, onClick, active, title, remove, tooltip } = this.props;
    return (<li key={id} className={classNames(styles[id], id)}
    title={tooltip}>
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
      {Object.keys(categories).map(
        (key, index) => {
          const item = categories[key];
          return (<Category
            key={index}
            title={item.name}
            tooltip={item.description}
            id={key}
            active={(location.query.category === key) ? 'active' : ''}
            remove={ (e) => {
                e.preventDefault();
                delete location.query.category;
                router.replace(location);
              }
            }
            onClick={()=> {
                location.query = {category: key};
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
