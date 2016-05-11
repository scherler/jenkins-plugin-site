import PureComponent from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import ModalView from 'react-header-modal';

const { object } = PropTypes;

export class PluginDetail extends PureComponent {
  render() {
    return (<ModalView
      hideOnOverlayClicked
      title="Hi, xxx modal"
      body="Simple Text"
    />);
  }
}

PluginDetail.propTypes = {
  plugin: object,
};

export default PluginDetail;
