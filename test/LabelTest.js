import React from 'react';
import {createRenderer} from 'react-addons-test-utils';
import expect from 'expect';

import LabelWidgetItem from '../app/components/Widget/LabelWidgetItem';

const click = () => hasClicked = true;
let hasClicked = false;

const testElement = (<LabelWidgetItem
  item={{
    key: 'testLabel',
    value: 12
  }}
  onClick={click}
  />);

describe('Test whether label renders correctly', () => {

  it('Shows the correct label', () => {
    const renderer = createRenderer();
    renderer.render(testElement);
    const result = renderer.getRenderOutput();
    expect(result.type).toBe('a');
    expect(result.props.children.type).toBe('span');
    expect(result.props.children.props.children).toBe('testLabel');
  });

  it('Sets the hasClicked correct onClick', () => {
    const renderer = createRenderer();
    renderer.render(testElement);
    const result = renderer.getRenderOutput();
    result.props.onClick();
    expect(hasClicked).toBe(true);
  });

});
