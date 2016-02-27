import React from 'react';
import ReactDOM from 'react-dom';
import {createRenderer} from 'react-addons-test-utils';
import expect from 'expect';
import { assert} from 'chai';

import Searchbox from '../app/components/Widget/Searchbox';

const testElement = (<Searchbox browserHistory={{}}
  location={{query: {q: 'extrem'}}}
  limit={11}/>);

describe('Test whether searchbox renders correctly', () => {

  it('Shows the correct query and limit', () => {
    const renderer = createRenderer();
    renderer.render(testElement);
    const result = renderer.getRenderOutput();
    expect(result.type).toBe('div');
    expect(result.props.children[0].type).toBe('input');
    expect(result.props.children[0].props.defaultValue).toBe('extrem');
    expect(result.props.children[1].type).toBe('input');
    expect(result.props.children[1].props.defaultValue).toBe(11);
    expect(result.props.children[2].type).toBe('button');
  });

  it('Should throw an exception onClick', () => {
    const renderer = createRenderer();
    renderer.render(testElement);
    const result = renderer.getRenderOutput();
    const throwing = () => {
      result.props.children[2].props.onClick('xxx', 69);
    };
    assert.throws(throwing, 'Cannot read property \'value\' of undefined');
  });

});
