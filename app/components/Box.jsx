import React, { PropTypes } from 'react';
import { Icon } from 'react-material-icons-blue';

const { any, string } = PropTypes;

const Box = ({ icon, label, footer }) => (
  <div >
    <div className="card__description cardGroup__cardDescription">
      <div className="icon fa fa-trophy card__descriptionIcon">
        <Icon icon={icon} size={50} />
      </div>
      <div className="card__descriptionText">
        { label }
      </div>
    </div>
    <div className="card__price">
      { footer }
    </div>
  </div>
);

Box.propTypes = {
  icon: string.isRequired,
  label: any.isRequired,
  label: string.isRequired,
  url: string,
};
export default Box;