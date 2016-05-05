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
    browserHistory: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    totalSize: PropTypes.any.isRequired,
    labels: PropTypes.any.isRequired,
    getVisiblePlugins: PropTypes.any.isRequired,
    searchOptions: PropTypes.any.isRequired,
    isFetching: PropTypes.bool.isRequired,
  };

  state = {
    show: 'featured'
  };

  render() {

    const {
      browserHistory,
      totalSize,
      isFetching,
      searchOptions,
      getVisiblePlugins,
      labels,
      location
    } = this.props;

    const {view = 'Tiles'} = location.query;

    const
      toRange = searchOptions.limit * Number(searchOptions.page) <= Number(searchOptions.total) ?
        searchOptions.limit * Number(searchOptions.page) : Number(searchOptions.total),
      fromRange = (searchOptions.limit) * (Number(searchOptions.page) - 1);

    return (
    <div className={classNames('box')}>
      <div className={classNames('jumbotron plugins')}>
        <div className={classNames('container')}>
        <div className={classNames('row')}>
          <div className={classNames('col-md-3')}></div>
          <div className={classNames('col-md-6')}>
              <form
                action="#"
                onSubmit={event => {
                  event.preventDefault();
                  location.query.q = event.target[0].value;
                  location.query.limit = searchOptions.limit;
                  browserHistory.push(location);
                }}
              >
              <input
                defaultValue={location.query.q}
                className={classNames(styles.SearchInput, 'form-control nav-link')}
                onChange={event => {
                  location.query.q = event.target.value;
                  location.query.limit = searchOptions.limit;
                  browserHistory.push(location);
                }}
                placeholder="Find plugins..."
              />
              </form>          
          </div>
        </div>
        </div>
      </div>
      <div className={classNames(styles.ItemFinder, view, 'item-finder')} >
        <div className={classNames(styles.CategoriesBox, 'categories-box col-md-2')} >
          <Categories
            browserHistory={browserHistory}
            location={location}
            />
              { totalSize > 0 && location.query.category === 'general' && <LabelWidget
                browserHistory={browserHistory}
                location={location}
                labels={labels}
                /> }
        </div>
        
        <div className={classNames(styles.ItemsList, 'items-box col-md-10')}>

          <nav id="cb-grid-toolbar"
             className="navbar navbar-light bg-faded">
            <ul className="nav navbar-nav">
              <li className="nav-item page-picker">
                {!isFetching && totalSize > 0 &&
                  Number(searchOptions.pages) > 1 && <Pagination
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

            <ul className="pull-xs-right nav navbar-nav">
              <Sort
                browserHistory={browserHistory}
                location={location}
              />
              <Views
                browserHistory={browserHistory}
                location={location}
              />

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
    </div>
      );
  }

}
