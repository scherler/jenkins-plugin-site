import React from 'react';
import {createRenderer} from 'react-addons-test-utils';
import expect from 'expect';

import Pagination from '../app/components/Widget/Pagination';

const testElement = (<Pagination
  browserHistory={{
    replace: (location) => {
      expect(location.query.q).toBe('extrem');
    }}
  }
  location={{query: {q: 'extrem'}}}
  limit={10}
  total={100}
  pages={10}
  page={1}
  />);

describe('Test whether pagination renders correctly', () => {

  it('Shows the correct query and limit', () => {
    const renderer = createRenderer();
    renderer.render(testElement);
    const result = renderer.getRenderOutput();
    expect(result.type).toBe('nav');
    expect(result.props.children.type).toBe('ul');
    expect(result.props.children.props.children.length).toBe(5);
    expect(result.props.children.props.children[3].type).toBe('li');
    expect(result.props.children.props.children[3].props.children.type).toBe('a');
  });

  it('Should not throw an exception onClick', () => {
    const renderer = createRenderer();
    renderer.render(testElement);
    const result = renderer.getRenderOutput();
    result.props.children.props.children[3].props.children.props.onClick();
  });

});
