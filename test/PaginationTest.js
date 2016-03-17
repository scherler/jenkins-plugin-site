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
    expect(result.type).toBe('ul');
    expect(result.props.children.length).toBe(13);
  });
  it('Should not throw an exception onClick', () => {
    const renderer = createRenderer();
    renderer.render(testElement);
    const result = renderer.getRenderOutput();
    result.props.children[0].props.children.props.onClick();
  });



});
