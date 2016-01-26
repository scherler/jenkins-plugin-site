import React from 'react';
import ColumnDefinition from './listColumnDefinition';
import Footer from './listFooter';
//import {emptyList} from './emptyList';
import Empty from './emptyList';

const { oneOfType, array, object, func, bool, string } = React.PropTypes;

const List = React.createClass({

  propTypes: {
    collection: oneOfType([ array, object ]).isRequired,
    hasEntries: bool.isRequired,
    headers: array.isRequired,
    mapItem: func.isRequired,
    emptyListText: string,
    noSearchResultText: string
  },

  getDefaultProps () {
    return {
      collection: [],
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
      collection,
      hasEntries,
      headers,
      emptyListText,
      noSearchResultText
    } = this.props;
    const { nodes, nothingFound } = this.mapper(collection);

    return (
      <ul style={{
         position: 'relative',
         display: 'table',
         borderCollapse: 'collapse',
         width: '100%',
         listStyleType: 'none',
         margin: 0,
         padding: 0,
       }}>
        <ColumnDefinition headers={headers} />
        { nothingFound && <Empty
          noEntries={!hasEntries}
          emptyListText={emptyListText}
          noSearchResultText={noSearchResultText}
          /> }
        { !nothingFound && nodes }
        { !nothingFound && <Footer columns={headers.length} /> }
      </ul>
    );
  }
});

module.exports = List;
