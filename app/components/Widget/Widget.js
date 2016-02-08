/** @flow */
import Immutable from 'immutable'
import Entry from './Entry'
import styles from './Widget.css'
import LabelWidget from './Labels'
import React, { PropTypes, Component } from 'react'
import {cleanTitle, getMaintainers, getScoreClassName} from '../../helper'
import { VirtualScroll } from 'react-virtualized'
import classNames from 'classnames'

export default class Widget extends Component {

  static propTypes = {
    generateData: PropTypes.func.isRequired,
    setFilter: PropTypes.func.isRequired,
    totalSize: PropTypes.any.isRequired,
    getVisiblePlugins: PropTypes.any.isRequired,
    getVisiblePluginsLabels: PropTypes.any.isRequired,
    searchData: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    labelFilter: PropTypes.any.isRequired
  };

  state = {
    clicked: false,
    view:'tiles',
    sort:'name'
  };

  render () {

    const {
      generateData,
      setFilter,
      rowRenderer,
      searchData,
      title,
      totalSize,
      getVisiblePlugins,
      getVisiblePluginsLabels,
      labelFilter
    } = this.props;

    let filter;
    if (labelFilter instanceof Function) {
      filter = labelFilter();
    } else {
      filter = labelFilter;
    }

    const { clicked } = this.state;

    const filteredSize = getVisiblePlugins instanceof Immutable.Collection
      ? getVisiblePlugins.size
      : getVisiblePlugins.length

    const viewClass = styles[this.state.view]
    
    return (
      <div>
      <h1>!!!!!</h1>
      <div className={classNames(styles.ItemFinder, viewClass, 'item-finder')} >
        {true && <div>
          <span>{title} !!!!!</span>
            <button onClick={()=>  {
              this.setState({
                clicked: !clicked
              });
            }}>Light switch</button>

            { clicked && <span> on</span> }
            { !clicked && <span> off</span> }

          <button onClick={()=>  {
              setFilter(new Immutable.Record({
                field: 'name',
                asc: !filter.asc
              }));
            }}>switch sort on 'name'</button>
          <button onClick={()=>  {
              setFilter(new Immutable.Record({
                field: 'title',
                asc: !filter.asc
              }));
            }}>switch sort on 'title'</button>
          <button onClick={()=>  {
              setFilter(new Immutable.Record({
                field: 'releaseTimestamp',
                asc: !filter.asc
              }));
            }}>switch sort on 'releaseTimestamp'</button>
        </div>}
        <div className={classNames(styles.CategoriesBox, 'categories-box col-md-2')} >
          <ul className="list-group">
            <li className={classNames(styles.scm, 'scm')}>
              <a className={classNames(styles.li, 'list-group-item')}>SCM connectors</a></li>
            <li className={classNames(styles.build, 'build')}>
              <a className={classNames(styles.li, 'list-group-item')}>Build and analytics</a></li>
            <li className={classNames(styles.deployment, 'deployment')}>
              <a className={classNames(styles.li, 'list-group-item')}>Deployment</a></li>
            <li className={classNames(styles.pipelines, 'pipelines')}>
              <a className={classNames(styles.li, 'list-group-item')}>Pipelines</a></li>
            <li className={classNames(styles.containers, 'containers')}>
              <a className={classNames(styles.li, 'list-group-item')}>Containers</a></li>
            <li className={classNames(styles.security, 'security')}>
              <a className={classNames(styles.li, 'list-group-item')} onClick={()=>  {
              setFilter(new Immutable.Record({
                searchField: 'labels',
                field: filter.title || 'title',
                search: ['user', 'security'],
                asc: filter.asc || true
              }));
            }}>Users and security</a></li>
            <li className={classNames(styles.general, 'general')}>
              <a className={classNames(styles.li, 'list-group-item')}>General purpose</a></li>
          </ul>
          { totalSize > 0 && <LabelWidget
            labels={getVisiblePluginsLabels}
            onClick={(event)=>  {
              setFilter(new Immutable.Record({
                searchField: 'labels',
                field: filter.title || 'title',
                search: [event.target.innerText],
                asc: filter.asc || true
              }))}}
            /> }
        </div>

        <div className={classNames(styles.ItemsList, 'items-box col-md-10')}>

          <nav id="cb-grid-toolbar" className='navbar navbar-light bg-faded'>
            <ul className="nav navbar-nav">
              <li className="nav-item active"><a className="nav-link">Featured</a></li>
              <li className="nav-item"><a className="nav-link">New</a></li>
              <li className="nav-item"><a className="nav-link">All</a></li>
              <li className="nav-item btn-group"><a className="nav-link dropdown-toggle">Tags</a></li>
              <li className="nav-item btn-group"><a className="nav-link dropdown-toggle">Technologies</a></li>
              <li className="nav-item"><button className="btn btn-sm" onClick={()=>  generateData()}>getPlugins</button></li>
            </ul>

            <ul className="pull-xs-right nav navbar-nav">
              <li className="nav-item">
                {totalSize > 0 &&
                  <span className="nav-link">
                    {filteredSize} of {totalSize}
                  </span>
                }
              </li>
              <li className="nav-item">
                <form className="form-inline pull-xs-right" action='#'>
                <input
                  disabled={totalSize === 0}
                  className={classNames(styles.SearchInput, "form-control")}
                  onChange={event => searchData(event.target.value)}
                  onSubmit={event => searchData(event.target.value)}
                  placeholder='Filter...'
                />
                </form>
              </li>
              <li className="nav-item btn-group">
                <a className="nav-link dropdown-toggle">Sort</a>
              </li>
              <li className="nav-item btn-group">
                <a className="nav-link dropdown-toggle">Filter</a>
              </li>
              <li className="nav-item btn-group dropdown">
                <a className="nav-link dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">View</a>
                <div className="dropdown-menu" aria-labelledby="dLabel">
                
                  <a className="dropdown-item" href="#">Regular link</a>
                  <a className="dropdown-item disabled" href="#">Disabled link</a>
                  <a className="dropdown-item" href="#">Another link</a>
                
                </div>

              </li>
              
              <li className="nav-item dropdown">
                <button className="nav-link  dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  View
                </button>
              <div className="dropdown-menu">
                <a className="dropdown-item" href="#view=tiles" 
                  onClick={()=>  {this.setState({ view: 'tiles' });}}>Tiles</a>
                <a className="dropdown-item" href="#view=list"
                  onClick={()=>  {this.setState({ view: 'list' });}}>List</a>
                <a className="dropdown-item" href="#view=table">
                  onClick={()=>  {this.setState({ view: 'table' });}}>Table</a>
              </div>
            </li>
              
              
              
              
            </ul>
          </nav>

          <div id="cb-item-finder-grid-box" className={classNames(styles.GridBox, 'grid-box')} >
            <div className={classNames(styles.Grid, 'grid')} >

              {totalSize > 0 && getVisiblePlugins.valueSeq().map(plugin => {
                return <Entry
                  className="Entry"
                  key={plugin.id}
                  plugin={plugin} />
              })}

            </div>
          </div>

          <div className="clearfix"></div>

        </div>

      </div>
      </div>
      )
  };

}
