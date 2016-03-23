/** @flow */
import {
  actions,
  totalSize,
  isFetching,
  searchOptions,
  filterVisibleList,
  getVisiblePluginsLabels
} from './resources';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import React, { PropTypes, Component } from 'react';
import Widget from './components/Widget';
import DevelopmentFooter from './commons/developmentFooter';

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
      browserHistory,
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
        browserHistory={browserHistory}
        getVisiblePlugins={filterVisibleList}
        totalSize={totalSize}
        isFetching = {isFetching}
        getVisiblePluginsLabels={getVisiblePluginsLabels}
        />
    </div>);
  }
}

Application.propTypes = {
  generatePluginData: PropTypes.func.isRequired,
  browserHistory: PropTypes.object.isRequired,
  filterVisibleList: PropTypes.any.isRequired,
  totalSize: PropTypes.any.isRequired,
  getVisiblePluginsLabels: PropTypes.any.isRequired,
  searchOptions: PropTypes.any.isRequired,
  isFetching: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
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
