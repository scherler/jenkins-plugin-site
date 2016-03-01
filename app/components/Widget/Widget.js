/** @flow */
import Immutable from 'immutable';
import Entry from './Entry';
import styles from './Widget.css';
import LabelWidget from './Labels';
import Pagination from './Pagination';
import Searchbox from './Searchbox';
import Categories from './Categories';
import React, { PropTypes, Component } from 'react';
import {cleanTitle, getMaintainers, getScoreClassName} from '../../helper';
import Spinner from '../../commons/spinner';
import { VirtualScroll } from 'react-virtualized';
import classNames from 'classnames';

export default class Widget extends Component {

  static propTypes = {
    generateData: PropTypes.func.isRequired,
    setFilter: PropTypes.func.isRequired,
    browserHistory: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    totalSize: PropTypes.any.isRequired,
    getVisiblePlugins: PropTypes.any.isRequired,
    searchOptions: PropTypes.any.isRequired,
    isFetching: PropTypes.bool.isRequired,
    getVisiblePluginsLabels: PropTypes.any.isRequired,
    searchData: PropTypes.func.isRequired,
    labelFilter: PropTypes.any.isRequired
  };

  state = {
    clicked: false,
    view: 'tiles',
    sort: 'title'
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
      browserHistory,
      searchData,
      totalSize,
      isFetching,
      searchOptions,
      getVisiblePlugins,
      getVisiblePluginsLabels,
      location,
      labelFilter
    } = this.props;

    const
      filter = this.getFilter(labelFilter),
      toRange = searchOptions.limit * Number(searchOptions.page) <= Number(searchOptions.total) ?
        searchOptions.limit * Number(searchOptions.page) : Number(searchOptions.total),
      fromRange = (searchOptions.limit) * (Number(searchOptions.page) - 1);

    const { clicked } = this.state;

    const filteredSize = getVisiblePlugins instanceof Immutable.Collection
      ? getVisiblePlugins.size
      : getVisiblePlugins.length;

    const viewClass = styles[this.state.view];


    return (
      <div className={classNames(styles.ItemFinder, this.state.view, 'item-finder')} >
        <div className={classNames(styles.CategoriesBox, 'categories-box col-md-2')} >
          <Categories
            browserHistory={browserHistory}
            location={location}
            />
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
                <a className="nav-link" onClick={() => {
                  this.props.location.query= {latest: 'latest'};
                  this.props.browserHistory.replace(this.props.location);
                }}>New</a>
              </li>
              <li className="nav-item">
                <button className="nav-link" onClick={() => {
                    setFilter(new Immutable.Record({
                      searchField: 'labels',
                      field: filter.title || 'title',
                      search: '',
                      asc: filter.asc || true
                    }));
                  }}>
                  All
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
                <Searchbox browserHistory={browserHistory}
                          location={location}
                          limit={Number(searchOptions.limit)}/>
              </li>
            </ul>

            <ul className="pull-xs-right nav navbar-nav">
              <li className="nav-item">
                {totalSize > 0 &&
                  <span className="nav-link">
                    {fromRange} to&nbsp;
                    {toRange} of {totalSize}
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

              {isFetching && <Spinner>loading</Spinner>}
              {!isFetching && totalSize > 0 && !location.query.category
                && !location.query.latest && Number(searchOptions.pages) > 1 && <Pagination
                browserHistory={browserHistory}
                location={location}
                pages={Number(searchOptions.pages)}
                page={Number(searchOptions.page)}
                limit={Number(searchOptions.limit)}
              />}


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
