import React from 'react';
import ReactDOM from 'react-dom';
import {createRenderer} from 'react-addons-test-utils';
import expect from 'expect';

import LabelWidgetItem from '../app/components/Widget/LabelWidgetItem';

let click = () => hasClicked = true;
let hasClicked = false;

let testElement = (<LabelWidgetItem
  item={{
    key: 'testLabel',
    value: 12
  }}
  onClick={click}
  />);

describe('Test whether label renders correctly', () => {

  it('Shows the correct label', () => {
    let renderer = createRenderer();
    renderer.render(testElement);
    let result = renderer.getRenderOutput();
    expect(result.type).toBe('a');
    expect(result.props.children[0].type).toBe('span');
    expect(result.props.children[0].props.children).toBe('testLabel');
  });

  it('Sets the hasClicked correct onClick', () => {
    let renderer = createRenderer();
    renderer.render(testElement);
    let result = renderer.getRenderOutput();
    result.props.onClick();
    expect(hasClicked).toBe(true);
  });

});
