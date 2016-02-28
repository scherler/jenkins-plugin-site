import React, { PropTypes, Component } from 'react';
import styles from './Widget.css';
import {cleanTitle, getMaintainers, getScoreClassName} from '../../helper';
import classNames from 'classnames';


export default class Entry extends Component {

  static propTypes = {
    plugin: PropTypes.any.isRequired
  };

  render() {
    const {plugin} = this.props;
    return (
      <div
        key={plugin.get('sha1')}
        className={classNames(styles.Item,'Entry-box')}
        >

        <a href={plugin.get('wiki')} className={classNames('item','Entry',styles.Tile)}>
          <div className={classNames(styles.Icon,'Icon')}>
            {plugin.get('iconDom')}
          </div>

          <div className={classNames(styles.Title,'Title')}>
            <h4>{cleanTitle(plugin.get('title'))}</h4>
          </div>
          <div className={classNames(styles.Version,'Version')}>
            <span className={classNames(styles.v,'v')}>{plugin.get('version')}</span>
            <span className="jc">
              <span className="j">Jenkins</span>
              <span className="c">{plugin.get('requiredCore')}+</span>
              </span>
          </div>

          <div className={classNames(styles.Wiki,'Wiki')}>
            {plugin.get('wiki')}
          </div>

          <div className={classNames(styles.Excerpt,'Excerpt')}>
            {plugin.get('excerpt')}
          </div>

          <div className={classNames(styles.Authors,'Authors')}>
            {getMaintainers(plugin.get('developers'),plugin.get('sha1'))}
          </div>

        </a>
      </div>
    );
  }
}
