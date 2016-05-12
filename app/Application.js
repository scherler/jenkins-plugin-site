/** @flow */
import {
  actions,
  totalSize,
  isFetching,
  searchOptions,
  filterVisibleList,
  getVisiblePluginsLabels,
  createSelector,
  connect,
} from './resources';
import React, { PropTypes, Component } from 'react';
import Widget from './components/Widget';
import DevelopmentFooter from './commons/developmentFooter';

const { object, func, any, bool } = PropTypes;

export default class Application extends Component {

  componentWillMount() {
    const { location } = this.props;
    this.props.generatePluginData(location.query);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.location.query !== this.props.location.query) {
      this.props.generatePluginData(nextProps.location.query);
    }
  }

  render() {
    const {
      filterVisibleList,
      totalSize,
      searchOptions,
      getVisiblePluginsLabels,
      isFetching,
      location,
    } = this.props;

    return (<div>
      <DevelopmentFooter />
      <Widget
        searchOptions={searchOptions}
        location={location}
        router={this.context.router}
        getVisiblePlugins={filterVisibleList}
        totalSize={totalSize}
        isFetching = {isFetching}
        getVisiblePluginsLabels={getVisiblePluginsLabels}
        />
    </div>);
  }
}

Application.propTypes = {
  location: object.isRequired,
  generatePluginData: func.isRequired,
  filterVisibleList: any,
  totalSize: any.isRequired,
  getVisiblePluginsLabels: any.isRequired,
  searchOptions: any.isRequired,
  isFetching: bool.isRequired,
};

const selectors = createSelector(
  [ totalSize, isFetching, filterVisibleList, getVisiblePluginsLabels, searchOptions],
  ( totalSize, isFetching, filterVisibleList, getVisiblePluginsLabels, searchOptions) => ({
    totalSize,
    isFetching,
    filterVisibleList,
    getVisiblePluginsLabels,
    searchOptions
  })
);

export default connect(selectors, actions)(Application);
