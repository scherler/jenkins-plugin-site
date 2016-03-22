import React, { PropTypes} from 'react';
import styles from './Widget.css';
import {cleanTitle, getMaintainers  } from '../../helper';
import PureComponent from 'react-pure-render/component';
import classNames from 'classnames';

export class Icon extends PureComponent {

  static propTypes = {
    title: PropTypes.any.isRequired,
    type: PropTypes.any,
  };

  render() {

    const {type = ''} = this.props;
    let { title } = this.props;

    title = title
      .replace('Jenkins ','')
      .replace('jenkins ','')
      .replace(' Plugin','')
      .replace(' Plug-in','')
      .replace(' lugin','');

    const colors = ['#6D6B6D','#DCD9D8','#D33833','#335061','#81B0C4','#709aaa','#000'];
    const color = colors[(title.length % 7)]; //pick color based on chars in the name to make semi-random, but fixed color per-plugin
    const iconClass=`i ${type};
    color = ${color}`;

    const firstLetter = title.substring(0,1).toUpperCase();
    const firstSpace = title.indexOf(' ') + 1;
    const nextIndx = (firstSpace === 0)?
      1: firstSpace;
    const nextLetter = title.substring(nextIndx,nextIndx + 1);

    return (<i className={iconClass} style={{background: color}}>
        <span className="first">{firstLetter}</span>
        <span className="next">{nextLetter}</span>
      </i>
    );
  }
}

export default class Entry extends PureComponent {

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
            <Icon title={plugin.get('title')} />
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
