import React from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';
import TestUtils, {createRenderer} from 'react-addons-test-utils';
import { assert} from 'chai';
import expect from 'expect';

import Entry from '../app/components/Widget/Entry';

const Record = Immutable.Record({
  id: null,
  name: null,
  title: '',
  buildDate: null,
  releaseTimestamp: null,
  version: null,
  wiki: '',
  excerpt: '',
  iconDom: null,
  requiredCore: null,
  developers: [],
  labels: [],
  dependencies: []
});

const plugin = {
    buildDate: 'Mar 03, 2011',
    dependencies: [0],
    developers: [1],
    excerpt: 'This (experimental) plug-in exposes the jenkins build extension points (SCM, Build, Publish) to a groovy scripting environment that has   some DSL-style extensions for ease of development.',
    gav: 'jenkins:AdaptivePlugin:0.1',
    labels: ['xxx', 'yyy'],
    name: 'AdaptivePlugin',
    releaseTimestamp: '2011-03-03T16:49:24.00Z',
    requiredCore: '1.398',
    scm: 'github.com',
    sha1: 'il8z91iDnqVMu78Ghj8q2swCpdk=',
    title: 'Jenkins Adaptive DSL Plugin',
    url: 'http://updates.jenkins-ci.org/download/plugins/AdaptivePlugin/0.1/AdaptivePlugin.hpi',
    version: '0.1',
    wiki: 'https://wiki.jenkins-ci.org/display/JENKINS/Jenkins+Adaptive+Plugin'
  };

const
  testElement = (<Entry plugin={new Record(plugin)} />);

describe('Test whether one plugin entry renders correctly', () => {

  const renderer = createRenderer();

  before('render and locate element', () => renderer.render(testElement));

  it('Shows the correct entry', () => {
    const
      result = renderer.getRenderOutput(),
      children = result.props.children;
    expect(result.type).toBe('div');
    expect(result.props.className).toBe('Entry-box');
    expect(children.props.children.length).toBe(7);

    expect(children.props.children[2].props.className).toBe('Title');
    expect(children.props.children[2].props.children.props.children).toBe('Adaptive DSL');

  });

  it('Should throw an exception when not using Immutable', () => {
    const throwing = () => {
      renderer.render(<Entry plugin={plugin} />);
    };
    assert.throws(throwing, 'plugin.get is not a function');
  });

  it('Should throw an exception when NPE', () => {
    const throwing = () => {
      renderer.render(<Entry />);
    };
    assert.throws(throwing, 'Cannot read property \'get\' of undefined');
  });

});
