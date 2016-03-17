/** @flow */
import Immutable from 'immutable';
import Entry from './Entry';
import styles from './Widget.css';
import LabelWidget from './Labels';
import Pagination from './Pagination';
import Categories from './Categories';
import React, { PropTypes } from 'react';
import Spinner from '../../commons/spinner';
import classNames from 'classnames';
import PureComponent from 'react-pure-render/component';

export default class Widget extends PureComponent {

  static propTypes = {
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
    view: 'tiles',
    sort: 'title',
    show: 'featured'
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

    return (
      <div className={classNames(styles.ItemFinder, this.state.view, 'item-finder')} >
        <div className={classNames(styles.CategoriesBox, 'categories-box col-md-2')} >
          <Categories
            browserHistory={browserHistory}
            location={location}
            />
          { totalSize > 0 && <LabelWidget
            labels={getVisiblePluginsLabels}
            setFilter={setFilter}
            filter={filter}
            /> }
        </div>
        
        <div className={classNames(styles.ItemsList, 'items-box col-md-10')}>

          <nav id="cb-grid-toolbar"
             className="navbar navbar-light bg-faded">
            <ul className="nav navbar-nav">
              <li className={`nav-item ${this.state.show === 'featured'?'active':''}`}>
                <a className="nav-link" onClick={() => {
                  this.setState({show: 'featured'});
                }}>Featured</a>
              </li>
              <li className={`nav-item ${this.state.show === 'new'?'active':''}`}>
                <a className="nav-link" onClick={() => {
                  this.setState({show: 'new'});
                  this.props.location.query= {latest: 'latest'};
                  this.props.browserHistory.replace(this.props.location);
                }}>New</a>
              </li>
              <li className={`nav-item ${this.state.show === 'all'?'active':''}`}>
                <a className="nav-link" onClick={() => {
                    this.setState({show: 'all'});
                    setFilter(new Immutable.Record({
                      searchField: 'labels',
                      field: filter.title || 'title',
                      search: '',
                      asc: filter.asc || true
                    }));
                  }}>
                  All
                </a>
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
                  setFilter={setFilter}
                  filter={filter}
                  /> }
              </li>
            </ul>

            <ul className="pull-xs-right nav navbar-nav">
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
          <nav className="page-controls">
          <ul className="nav navbar-nav">
            <li className="nav-item filter">
              <form className="form-inline pull-xs-right" action="#">
              <input
                disabled={totalSize === 0}
                className={classNames(styles.SearchInput, 'form-control nav-link')}
                onChange={event => searchData(event.target.value)}
                onSubmit={event => searchData(event.target.value)}
                placeholder="Filter..."
              />
              </form>
            </li>
          <li className="nav-item page-picker">
            {!isFetching && totalSize > 0 && !location.query.category
              && !location.query.latest && Number(searchOptions.pages) > 1 && <Pagination
              browserHistory={browserHistory}
              location={location}
              pages={Number(searchOptions.pages)}
              page={Number(searchOptions.page)}
            />}
          </li>
          <li className="nav-item count">
            {totalSize > 0 &&
              <span className="nav-link">
                {fromRange} to&nbsp;
                {toRange} of {totalSize}
              </span>
            }
          </li>

          </ul>


          </nav>
          <div className="padded-box">
            <div id="cb-item-finder-grid-box" className={classNames(styles.GridBox, 'grid-box')} >
              <div className={classNames(styles.Grid, 'grid')} >
    
                {isFetching && <Spinner>loading</Spinner>}

    
    
                {totalSize > 0 && getVisiblePlugins.valueSeq().map(plugin => {
                  return (<Entry
                    className="Entry"
                    key={plugin.id}
                    plugin={plugin} />);
                })}
              </div>
            </div>
          </div>

          <div className="clearfix"></div>

        </div>

      </div>
      );
  }

}
