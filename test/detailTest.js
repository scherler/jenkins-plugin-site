import React from 'react';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import expect from 'expect';

import PluginDetail from '../app/components/PluginDetail';
import Box from '../app/components/Box';
import plugin from '../test-data/plugin';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('<PluginDetail />', () => {

  it('should render', () => {
    const store = mockStore({ resources: {plugins: [plugin] }});
    const wrapper = shallow(<Provider store={store}><PluginDetail /></Provider>);
    expect(wrapper.length).toBe(1);
  });

  it('should render a <Box />', () => {
    const wrapper = shallow(<Box {...{
      icon: 'perm_identity',
      footer: 'Id',
      label: 'xxx',
    }} />);
    expect(wrapper.length).toBe(1);
    const footer = wrapper.find('.card__price');
    expect(footer.length).toBe(1);
    expect(footer.node.props.children).toBe('Id');
  });

});
