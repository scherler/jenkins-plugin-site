import React, { PropTypes } from 'react';
import { logger } from '../../commons';
import PureComponent from 'react-pure-render/component';

export default class Pagination extends PureComponent {

  static propTypes = {
    browserHistory: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    pages: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired
  }

  handleClick = (data) => {
    this.props.location.query.page = data;
    logger.log(this.props.location);
    this.props.browserHistory.replace(this.props.location);
  }

  render() {
    const {
      page,
      pages
    } = this.props;

    const
      previous = page - 1,
      next = page + 1,
      current = page,
      end = pages,
      start = 1;

    return (
      <nav>
        <ul className="pagination">
          {current > start && <li>
            <a onClick={this.handleClick.bind(null, start)} aria-label="start">
              <span aria-hidden="true">&laquo;&laquo;</span>
            </a>
          </li>}

          {current > previous && previous > 0 &&<li>
            <a onClick={this.handleClick.bind(null, previous)} aria-label="previous">
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>}

          <li className="active"><a >{current}<span className="sr-only">(current)</span></a></li>

          {current < next && next <=pages && <li>
            <a onClick={this.handleClick.bind(null, next)} aria-label="next">
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>}

          {current < end && <li>
            <a onClick={this.handleClick.bind(null, end)} aria-label="end">
              <span aria-hidden="true">&raquo;&raquo;</span>
            </a>
          </li>}
        </ul>
      </nav>);
  }
}
