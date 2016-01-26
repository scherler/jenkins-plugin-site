import React, { PropTypes as P } from 'react';
import Markdown from 'remarkable';

var Remarkable = React.createClass({

  propTypes: {
    container: P.string,
    noContainer: P.bool,
    renderInline: P.bool,
    style: P.object,
    options: P.object,
    source: P.string,
    className: P.string
  },

  getDefaultProps: function() {
    return {
      noContainer: false,
      container: 'div',
      options: {},
      className: ''
    };
  },

  render: function() {
    var Container = this.props.container;

    if (this.props.noContainer) return this.content();

    return (
      <Container className={this.props.className} style={this.props.style}>
        {this.content()}
      </Container>
    );
  },

  componentWillUpdate: function(nextProps, nextState) {
    if (nextProps.options !== this.props.options) {
      this.md = new Markdown(nextProps.options);
    }
  },

  content: function() {
    if (this.props.source) {
      return <span dangerouslySetInnerHTML={{ __html: this.renderMarkdown(this.props.source) }} />;
    }
    else {
      return React.Children.map(this.props.children, child => {
        if (typeof child === 'string') {
          return <span dangerouslySetInnerHTML={{ __html: this.renderMarkdown(child) }} />;
        }
        else {
          return child;
        }
      });
    }
  },

  renderMarkdown: function(source) {
    if (!this.md) {
      this.md = new Markdown(this.props.options);
    }

    if (this.props.renderInline) return this.md.renderInline(source);

    return this.md.render(source);
  }

});

module.exports = Remarkable;
