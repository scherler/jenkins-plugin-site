import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import styles from './Widget.css';
import { logger } from '../../commons';

const categories = [{
  "id": "scm",
  "title": "SCM Connectors"
}, {
  "id": "build",
  "title": "Build and Analysis"
}, {
  "id": "deployment",
  "title": "Deployment"
}, {
  "id": "pipelines",
  "title": "Pipelines"
}, {

  "id": "containers",
  "title": "Containers"
}, {
  "id": "security",
  "title": "Users and Security"
}, {
  "id": "general",
  "title": "General Purpose"
}];

export class Category extends Component {

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

export default class Categories extends Component {

  static propTypes = {
    browserHistory: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  };

  state = {
    category: 'all'
  };

  render() {
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
            active={(this.state.category === item.id)?'active':''}
            onClick={()=> {
                this.state.category = item.id;
                delete this.props.location.query.q;
                delete this.props.location.query.page;
                delete this.props.location.query.limit;
                this.props.location.query.category = item.id;
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
