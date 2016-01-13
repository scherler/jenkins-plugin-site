import React from 'react';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import { listColumnDefinition as ColumnDefinition } from './listColumnDefinition';
import { Footer as listFooter } from './listFooter';
import { Empty as emptyList } from './emptyList';

const { oneOfType, array, object, func, bool, string } = React.PropTypes;

export default React.createClass({

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
        <ColumnDefinition headers={headers} />
        { nothingFound && <Empty
          noEntries={!hasEntries}
          emptyListText={emptyListText}
          noSearchResultText={noSearchResultText}
          /> }
        { !nothingFound && nodes }
        { !nothingFound && <Footer columns={headers.length} /> }
      </CSSTransitionGroup>
    );
  }
});
