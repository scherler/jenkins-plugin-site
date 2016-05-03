import React, { PropTypes } from 'react';
import PureComponent from 'react-pure-render/component';

const items = ['Tiles', 'List', 'Table'];

export class View extends PureComponent {

  static propTypes = {
    title: PropTypes.any.isRequired,
    onClick: PropTypes.func.isRequired,
  };

  render() {
    const { title, onClick } = this.props;
    return (<a className="dropdown-item"
               onClick={onClick}>{title}</a>
    );
  }
}
export default class Views extends PureComponent {

  static propTypes = {
    browserHistory: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
  };

  render() {
    const {location, browserHistory} = this.props;
    const {view = 'Tiles'} = location.query;
    return (<li className="nav-item dropdown">
        <button
          className="nav-link  dropdown-toggle"
          type="button"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false">
          view: <b>{view}</b>
        </button>
        <div className="dropdown-menu">
          { items.map((item, index) => {
            return (<View key={index}
                          title={item}
                          onClick={()=> {
             location.query.view = item;
             browserHistory.push(location);
            }}/>);
          })}
        </div>
      </li>
    );
  }

}
