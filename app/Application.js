/** @flow */
import {
  actions,
  totalSize,
  labels,
  isFetching,
  searchOptions,
  filterVisibleList,
  createSelector,
  connect,
} from './resources';
import React, { PropTypes, Component } from 'react';
import Widget from './components/Widget/Widget';
import DevelopmentFooter from './commons/developmentFooter';

const { object, func, any, bool } = PropTypes;

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
        router={this.context.router}
        getVisiblePlugins={filterVisibleList}
        totalSize={totalSize}
        isFetching = {isFetching}
      />
    </div>);
  }
}

Application.propTypes = {
  location: object.isRequired,
  generatePluginData: func.isRequired,
  generateLabelData: func.isRequired,
  filterVisibleList: any,
  labels: any.isRequired,
  totalSize: any.isRequired,
  searchOptions: any.isRequired,
  isFetching: bool.isRequired,
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
