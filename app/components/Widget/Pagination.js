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
    this.props.browserHistory.push(this.props.location);
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
      cn1 = page - 1,
      cn2 = page - 2,
      cn3 = page - 3,
      cn4 = page - 4,
      c1 = page + 1,
      c2 = page + 2,
      c3 = page + 3,
      c4 = page + 4,
      end = pages,
      start = 1;

    return (

        <ul className="pagination">
          <li className="page-item">
            <a className="page-link" onClick={this.handleClick.bind(null, start)} aria-label="start">
              <span aria-hidden="true">&laquo;&laquo;</span>
            </a>
          </li>

          <li className="page-item">
            <a className="page-link" onClick={this.handleClick.bind(null, previous)} aria-label="previous">
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
          {cn4 > 0 && current + 1 > pages && <li className="page-item">
          <a className="page-link" onClick={this.handleClick.bind(null, cn4)} aria-label="next">
            {cn4}
          </a>
        </li>}
          
          {cn3 > 0 && current + 2 > pages && <li className="page-item">
          <a className="page-link" onClick={this.handleClick.bind(null, cn3)} aria-label="next">
            {cn3}
          </a>
        </li>}
          
          {cn2 > 0 && <li className="page-item">
          <a className="page-link" onClick={this.handleClick.bind(null, cn2)} aria-label="next">
            {cn2}
          </a>
        </li>}
          
          {cn1 > 0 && <li className="page-item">
          <a className="page-link" onClick={this.handleClick.bind(null, cn1)} aria-label="next">
            {cn1}
          </a>
        </li>}        
          
          <li className="page-item active">
            <a  className="page-link" >
              {current}<span className="sr-only">(current)</span>
            </a>
          </li>
          
          {c1 <=pages && <li className="page-item">
          <a className="page-link" onClick={this.handleClick.bind(null, c1)} aria-label="next">
            {c1}
          </a>
        </li>}
          
          {c2 <=pages && <li className="page-item">
          <a className="page-link" onClick={this.handleClick.bind(null, c2)} aria-label="next">
            {c2}
          </a>
        </li>}
          
          {c3 <=pages && current < 3 && <li className="page-item">
          <a className="page-link" onClick={this.handleClick.bind(null, c3)} aria-label="next">
            {c3}
          </a>
        </li>}
          
          {c4 <=pages && current < 2 && <li className="page-item">
          <a className="page-link" onClick={this.handleClick.bind(null, c4)} aria-label="next">
            {c4}
          </a>
        </li>}

          {current < next && next <=pages && <li className="page-item">
            <a className="page-link" onClick={this.handleClick.bind(null, next)} aria-label="next">
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>}

          {current < end && <li className="page-item">
            <a className="page-link" onClick={this.handleClick.bind(null, end)} aria-label="end">
              <span aria-hidden="true">&raquo;&raquo;</span>
            </a>
          </li>}
        </ul>);
  }
}
