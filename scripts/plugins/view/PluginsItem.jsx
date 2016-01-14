import React from 'react';
import pure from 'react-mini/pure'

/*
buildDate: "Mar 03, 2011"
dependencies: Array[0]
developers: Array[1]
excerpt: "This (experimental) plug-in exposes the jenkins build extension points (SCM, Build, Publish) to a groovy scripting environment that has some DSL-style extensions for ease of development."
gav: "jenkins:AdaptivePlugin:0.1"
labels: Array[2]
name: "AdaptivePlugin"
releaseTimestamp: "2011-03-03T16:49:24.00Z"
requiredCore: "1.398"
scm: "github.com"
sha1: "il8z91iDnqVMu78Ghj8q2swCpdk="
title: "Jenkins Adaptive DSL Plugin"
url: "http://updates.jenkins-ci.org/download/plugins/AdaptivePlugin/0.1/AdaptivePlugin.hpi"
version: "0.1"
wiki: "https://wiki.jenkins-ci.org/display/JENKINS/Jenkins+Adaptive+Plugin"
*/

const PluginItem = pure(({ plugin, modifySite }, me) => (
  <li style={{display: 'table-row'}}>
    <div className="col-md-4" style={{display: 'table-cell'}}>
      {plugin.name}
    </div>
    <div className="col-md-8" style={{display: 'table-cell'}}>
      {plugin.title}
    </div>
  </li>
));

module.exports = PluginItem;
