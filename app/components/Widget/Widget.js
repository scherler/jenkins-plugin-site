/** @flow */
import Immutable from 'immutable';
import Entry from './Entry';
import styles from './Widget.css';
import LabelWidget from './Labels';
import React, { PropTypes, Component } from 'react';
import {cleanTitle, getMaintainers, getScoreClassName} from '../../helper';
import { VirtualScroll } from 'react-virtualized';
import classNames from 'classnames';

export default class Widget extends Component {

  static propTypes = {
    generateData: PropTypes.func.isRequired,
    setFilter: PropTypes.func.isRequired,
    totalSize: PropTypes.any.isRequired,
    getVisiblePlugins: PropTypes.any.isRequired,
    getVisiblePluginsLabels: PropTypes.any.isRequired,
    searchData: PropTypes.func.isRequired,
    labelFilter: PropTypes.any.isRequired
  };

  state = {
    clicked: false,
    view: 'tiles',
    sort: 'title',
    category: 'all'
  };

  filterSet(search, filter) {
    this.props.setFilter(new Immutable.Record({
      search,
      searchField: 'labels',
      field: filter.title || 'title',
      asc: filter.asc || true
    }));

  }

  getFilter(labelFilter) {
    let filter;
    if (labelFilter instanceof Function) {
      filter = labelFilter();
    } else {
      filter = labelFilter;
    }
    return filter;
  }

  render() {

    const {
      generateData,
      setFilter,
      searchData,
      totalSize,
      getVisiblePlugins,
      getVisiblePluginsLabels,
      labelFilter
    } = this.props;

    const filter = this.getFilter(labelFilter);

    const { clicked } = this.state;

    const filteredSize = getVisiblePlugins instanceof Immutable.Collection
      ? getVisiblePlugins.size
      : getVisiblePlugins.length;

    const viewClass = styles[this.state.view];


    return (
      <div className={classNames(styles.ItemFinder, this.state.view, 'item-finder')} >
        <div className={classNames(styles.CategoriesBox, 'categories-box col-md-2')} >
          <ul className="list-group">
            <li className={classNames(styles.title, 'label')}>
              <div className={classNames(styles.li, 'list-group-item')}>Categories</div></li>
            <li className={classNames(styles.scm, 'scm')}>
              <a
                href="#category=scm"
                className={classNames(styles.li, 'list-group-item', (this.state.category === 'scm')?'active':'')}
                onClick={()=>
                  {
                    {this.state.category = 'scm';}
                    {this.filterSet(['scm-related', 'scm'], labelFilter);}
                  }
                }
              >SCM connectors</a></li>
            <li className={classNames(styles.build, 'build')}>
              <a href="#category=build"
                className={classNames(styles.li, 'list-group-item', (this.state.category === 'build')?'active':'')}
              onClick={()=>
                {
                  {this.state.category = 'build';}
                  {this.filterSet(['builder', 'buildwrapper'], labelFilter);}
                }
              }
              >Build and analytics</a></li>
            <li className={classNames(styles.deployment, 'deployment')}>
              <a href="#category=deployment"
                 className={classNames(styles.li, 'list-group-item', (this.state.category === 'deployment')?'active':'')}
              onClick={()=>
              {
                {this.state.category = 'deployment';}
                {this.filterSet(['cli', 'deployment'], labelFilter);}
              }
            }>Deployment</a></li>
            <li className={classNames(styles.pipelines, 'pipelines')}>
              <a href="#category=pipelines"
                className={classNames(styles.li, 'list-group-item')}>
                Pipelines</a>
            </li>
            <li className={classNames(styles.containers, 'containers')}>
              <a href="#category=containers"
                 className={classNames(styles.li, 'list-group-item')}>
                 Containers
              </a></li>
            <li className={classNames(styles.security, 'security')}>
              <a href="#category=security"
                className={classNames(styles.li, 'list-group-item', (this.state.category === 'security')?'active':'')}
              onClick={()=>
              {
                {this.state.category = 'security';}
                {this.filterSet(['user', 'security'], labelFilter);}
              }
            }>Users and security</a></li>
            <li className={classNames(styles.general, 'general')}>
              <a href="#category=general"
                className={classNames(styles.li, 'list-group-item')}>
                General purpose</a>
            </li>
          </ul>
          { totalSize > 0 && <LabelWidget
            labels={getVisiblePluginsLabels}
            onClick={(event)=>  {
              setFilter(new Immutable.Record({
                searchField: 'labels',
                field: filter.title || 'title',
                search: [event.target.innerText],
                asc: filter.asc || true
              }));}}
            /> }
        </div>

        <div className={classNames(styles.ItemsList, 'items-box col-md-10')}>

          <nav id="cb-grid-toolbar"
             className='navbar navbar-light bg-faded'>
            <ul className="nav navbar-nav">
              <li className="nav-item active">
                <a className="nav-link">Featured</a>
              </li>
              <li className="nav-item">
                <a className="nav-link">New</a>
              </li>
              <li className="nav-item">
                <button className="nav-link dropdown-toggle"
                   data-toggle="dropdown"
                   aria-haspopup="true"
                   aria-expanded="false">
                   Tags
               </button>
              </li>
              <li className="nav-item btn-group">
                <button
                  className="nav-link dropdown-toggle"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false">
                  Tags
                </button>
                { totalSize > 0 && <LabelWidget
                  labels={getVisiblePluginsLabels}
                  onClick={(event)=>  {
                    setFilter(new Immutable.Record({
                      searchField: 'labels',
                      field: filter.title || 'title',
                      search: [event.target.innerText],
                      asc: filter.asc || true
                    }));}}
                  /> }
              </li>
              <li className="nav-item btn-group">
                <a className="nav-link dropdown-toggle">
                  Technologies
                </a></li>
              <li className="nav-item">
                <button
                  className="btn btn-sm"
                  onClick={()=>  generateData()}>
                  getPlugins</button></li>
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
                  className={classNames(styles.SearchInput, 'form-control nav-link')}
                  onChange={event => searchData(event.target.value)}
                  onSubmit={event => searchData(event.target.value)}
                  placeholder='Filter...'
                />
                </form>
              </li>
              <li className="nav-item btn-group">
                <button
                  className="nav-link dropdown-toggle"
                  type="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false">
                  sort: <b>{this.state.sort}</b></button>
                <div className="dropdown-menu">
                  <a className="dropdown-item" href="#sort=name"
                    onClick={()=> {
                    this.setState({ sort: 'name' });
                    setFilter(new Immutable.Record({
                      field: 'name',
                      asc: !filter.asc
                    }));}}>Name</a>
                  <a className="dropdown-item" href="#sort=version"
                    onClick={()=> {
                    this.setState({ sort: 'core' });
                    setFilter(new Immutable.Record({
                      field: 'requiredCore',
                      asc: !filter.asc
                    }));}}>Core version</a>
                  <a className="dropdown-item" href="#sort=table"
                    onClick={()=>  {this.setState({ sort: 'rating' });}}>Ratings</a>
                  <a className="dropdown-item" href="#sort=buildDate"
                    onClick={()=> {
                      this.setState({ sort: 'updated' });
                      setFilter(new Immutable.Record({
                        field: 'buildDate',
                        asc: !filter.asc
                      }));}}>Updated</a>
                  <a className="dropdown-item" href="#sort=releaseTimestamp"
                    onClick={()=> {
                      this.setState({ sort: 'created' });
                      setFilter(new Immutable.Record({
                        field: 'releaseTimestamp',
                        asc: !filter.asc
                      }));}}>Created</a>
                </div>
              </li>

              <li className="nav-item dropdown">
                <button
                  className="nav-link  dropdown-toggle"
                  type="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false">
                  view: <b>{this.state.view}</b>
                </button>
              <div className="dropdown-menu">
                <a className="dropdown-item" href="#view=tiles"
                  onClick={()=>  {this.setState({ view: 'tiles' });}}>Tiles</a>
                <a className="dropdown-item" href="#view=list"
                  onClick={()=>  {this.setState({ view: 'list' });}}>List</a>
                <a className="dropdown-item" href="#view=table"
                  onClick={()=>  {this.setState({ view: 'table' });}}>Table</a>
              </div>
            </li>

            </ul>
          </nav>

          <div id="cb-item-finder-grid-box" className={classNames(styles.GridBox, 'grid-box')} >
            <div className={classNames(styles.Grid, 'grid')} >

              {totalSize > 0 && getVisiblePlugins.valueSeq().map(plugin => {
                return (<Entry
                  className="Entry"
                  key={plugin.id}
                  plugin={plugin} />);
              })}

            </div>
          </div>

          <div className="clearfix"></div>

        </div>

      </div>
      );
  }

}
