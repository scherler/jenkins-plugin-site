import Entry from './Entry';
import styles from './Widget.css';
import LabelWidget from './Labels';
import Pagination from './Pagination';
import Categories from './Categories';
import Sort from './Sort';
import Views from './Views';
import React, { PropTypes } from 'react';
import Spinner from '../../commons/spinner';
import classNames from 'classnames';
import PureComponent from 'react-pure-render/component';

export default class Widget extends PureComponent {

  static propTypes = {
    location: PropTypes.object.isRequired,
    totalSize: PropTypes.any.isRequired,
    getVisiblePlugins: PropTypes.any.isRequired,
    searchOptions: PropTypes.any.isRequired,
    isFetching: PropTypes.bool.isRequired,
    getVisiblePluginsLabels: PropTypes.any.isRequired,
  };

  state = {
    show: 'featured'
  };

  render() {

    const {
      totalSize,
      isFetching,
      searchOptions,
      getVisiblePlugins,
      getVisiblePluginsLabels,
      location
    } = this.props;

    const { router } = this.context;

    const {view = 'Tiles'} = location.query;

    const
      toRange = searchOptions.limit * Number(searchOptions.page) <= Number(searchOptions.total) ?
        searchOptions.limit * Number(searchOptions.page) : Number(searchOptions.total),
      fromRange = (searchOptions.limit) * (Number(searchOptions.page) - 1);

    return (
      <div className={classNames(styles.ItemFinder, view, 'item-finder')} >
        <div className={classNames(styles.CategoriesBox, 'categories-box col-md-2')} >
          <Categories
            router={router}
            location={location}
            />
        </div>
        
        <div className={classNames(styles.ItemsList, 'items-box col-md-10')}>

          <nav id="cb-grid-toolbar"
             className="navbar navbar-light bg-faded">
            <ul className="nav navbar-nav">
              <li className={`nav-item ${this.state.show === 'featured'?'active':''}`}>
                <a className="nav-link" onClick={() => {
                  this.setState({show: 'featured'});
                  location.query={};
                  router.replace(location);
                }}>Featured</a>
              </li>
              <li className={`nav-item ${this.state.show === 'new' ? 'active' : ''}`}>
                <a className="nav-link" onClick={() => {
                  this.setState({show: 'new'});
                  location.query= {latest: 'latest'};
                  router.replace(location);
                }}>New</a>
              </li>

              { totalSize > 0 && <LabelWidget
                router={router}
                location={location}
                labels={getVisiblePluginsLabels}
                /> }
            </ul>

            <ul className="pull-xs-right nav navbar-nav">
              <Sort
                router={router}
                location={location}
              />
              <Views
                router={router}
                location={location}
              />

            </ul>
          </nav>
          <nav className="page-controls">
          <ul className="nav navbar-nav">
            <li className="nav-item filter">
              <form
                className="form-inline pull-xs-right" action="#"
                onSubmit={event => {
                  event.preventDefault();
                  location.query.q = event.target[0].value;
                  location.query.limit = searchOptions.limit;
                  router.replace(location);
                }}
              >
              <input
                defaultValue={location.query.q}
                className={classNames(styles.SearchInput, 'form-control nav-link')}
                onChange={event => {
                  location.query.q = event.target.value;
                  location.query.limit = searchOptions.limit;
                  router.replace(location);
                }}
                placeholder="Filter..."
              />
              </form>
            </li>
          <li className="nav-item page-picker">
            {!isFetching && totalSize > 0 && !location.query.category
              && !location.query.latest && Number(searchOptions.pages) > 1 && <Pagination
              router={router}
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
                    key={plugin.name}
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

Widget.contextTypes = {
  router: PropTypes.object.isRequired,
};
