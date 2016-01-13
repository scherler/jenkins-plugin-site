import React from 'react';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import listColumnDefinition from './listColumnDefinition.jsx';
import listFooter from './listFooter.jsx';
//import {emptyList} from './emptyList';
var emptyList = require('./emptyList.jsx');

const { oneOfType, array, object, func, bool, string } = React.PropTypes;

const List = React.createClass({

  propTypes: {
    items: oneOfType([ array, object ]).isRequired,
    hasEntries: bool.isRequired,
    headers: array.isRequired,
    mapItem: func.isRequired,
    emptyListText: string,
    noSearchResultText: string
  },

  getDefaultProps () {
    return {
      items: [],
      headers: [],
      emptyListText: 'emptyListText',
      noSearchResultText: 'noSearchResultText',
      mapItem: () => null
    };
  },

  mapper (items) {
    const { mapItem } = this.props;

    let nodes = items.map(mapItem);
    if (nodes.toJS) nodes = nodes.toJS();

    return { nodes, nothingFound: !nodes.length };
  },

  render () {
    const {
      hasEntries,
      items,
      headers,
      emptyListText,
      noSearchResultText
    } = this.props;
    const { nodes, nothingFound } = this.mapper(items);

    return (
      <CSSTransitionGroup transitionEnterTimeout={100} transitionLeaveTimeout={100} transitionName="list-item" component="ul">
        <listColumnDefinition headers={headers} />
        { nothingFound && <emptyList
          noEntries={!hasEntries}
          emptyListText={emptyListText}
          noSearchResultText={noSearchResultText}
          /> }
        { !nothingFound && nodes }
        { !nothingFound && <listFooter columns={headers.length} /> }
      </CSSTransitionGroup>
    );
  }
});

module.exports = List;
