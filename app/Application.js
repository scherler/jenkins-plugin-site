/** @flow */
import {
  actions,
  totalSize,
  labels,
  isFetching,
  searchOptions,
  filterVisibleList,
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
    this.props.generateLabelData();
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
      isFetching,
      labels,
      location,
    } = this.props;
    if (!labels) return null;
    return (<div>
      <DevelopmentFooter />
      <Widget
        labels={labels}
        searchOptions={searchOptions}
        location={location}
        browserHistory={browserHistory}
        getVisiblePlugins={filterVisibleList}
        totalSize={totalSize}
        isFetching = {isFetching}
        />
    </div>);
  }
}

Application.propTypes = {
  generatePluginData: PropTypes.func.isRequired,
  generateLabelData: PropTypes.func.isRequired,
  browserHistory: PropTypes.object.isRequired,
  filterVisibleList: PropTypes.any.isRequired,
  totalSize: PropTypes.any.isRequired,
  labels: PropTypes.any.isRequired,
  searchOptions: PropTypes.any.isRequired,
  isFetching: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
};

const selectors = createSelector(
  [ totalSize, isFetching, labels, filterVisibleList, searchOptions],
  ( totalSize, isFetching, labels, filterVisibleList,  searchOptions) => ({
    totalSize,
    isFetching,
    labels,
    filterVisibleList,
    searchOptions
  })
);

export default connect(selectors, actions)(Application);
