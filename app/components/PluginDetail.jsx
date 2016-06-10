import PureComponent from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import ModalView, {Body, Header} from 'react-header-modal';
import {Icon} from 'react-material-icons-blue';
import Box from './Box';
import { categories } from './Widget/Categories';
import moment from 'moment';
import numeral from 'numeral';
import { actions, plugin as pluginSelector, createSelector, connect } from '../resources';

import { getMaintainersLinked, getLabels, getDependencies } from '../helper';

const { func, object, any, string } = PropTypes;

export class PluginDetail extends PureComponent {
  componentWillMount() {
    if (this.props.params && this.props.params.pluginName) {
      this.getPluginHelper.call(this, this.props.params);
    }
  }

  componentWillReceiveProps(nextProp) {
    if (this.props.params.pluginName !== nextProp.params.pluginName) {
      this.getPluginHelper.call(this, nextProp.params);
    }
  }

  getPluginHelper(params) {
    const { pluginName: name } = params;
    const { getPlugin } = this.props;
    getPlugin(name);
  }

  render() {
    if (!this.props.plugin || !this.props.plugin.title) {
      return null;
    }
    const {
      context: {
        router,
        },
      props: {
        plugin: {
          title,
          name,
          excerpt,
          developers,
          sha1,
          version,
          scm,
          previousVersion,
          url,
          releaseTimestamp,
          previousTimestamp,
          category,
          labels,
          dependencies,
          stats: {
            installations,
            installationsPerVersion,
            },
          wiki,
          requiredCore,
          },
        },
      } = this;
    const afterClose = () => {
      // fix for static export
      if (typeof document !== 'undefined') {
        router.goBack();
      }
    };
    let total = 0;
    const installationData = Object.keys(installations).map((entry, index) => {
      const installation = installations[entry];
      total += installation;
      const slice = {x: parseInt(entry) / 1000000000000, y: installation};
      return slice;
    });
    const versionData = Object.keys(installationsPerVersion).map((entry, index) => {
      const installation = installationsPerVersion[entry];
      const slice = {x: `${entry}`, y: installation, label: installation};
      return slice;
    });
    const formatedTotal = numeral(total).format('0.0 a');
    const scmEntry = /github.com$/.test(scm) ? {
        url: `http://${scm}/jenkinsci/${name}-plugin`,
        icon: 'github-circle',
        footer: 'scm',
        label: scm,
      } : {
        url: `http://${scm}`,
        icon: 'dnd_forwardslash',
        footer: 'scm',
        label: scm,
    };
    const boxes = [
      {
        icon: 'perm_identity',
        footer: `v. ${version}`,
        label: name,
      },
      scmEntry,
      {
        url: wiki,
        icon: 'help',
        footer: 'HELP',
        label: 'Wiki',
      },
      {
        icon: 'play_install',
        footer: 'Total Installs',
        label: formatedTotal,
      },
    ];

    const boxesButtons = [
      {
        url: url,
        icon: 'file_download',
        footer: `${moment(releaseTimestamp).format('MMM Do YYYY')}`,
        label: 'latest',
      },
      {
        url: `http://updates.jenkins-ci.org/download/plugins/${name}/`,
        icon: 'launch',
        footer: `${moment(previousTimestamp).fromNow()}: v. ${previousVersion} `,
        label: 'archives',
      },
      {
        url: `http://updates.jenkins-ci.org/download/war/${requiredCore}/jenkins.war`,
        icon: 'file_download',
        footer: 'Required Core',
        label: requiredCore,
      },
    ];
    const developerMap = getMaintainersLinked(developers, sha1).map((item, index) => {
      return (<div className="formFooter__section" key={index}>
        <div className="formFooter__item">
          {item}
        </div>
      </div>)
    });
    const labelMap = getLabels(labels);
    const dependenciesMap = getDependencies(dependencies);
    return (<ModalView hideOnOverlayClicked isVisible {...{afterClose}}>
      <Header>
        <h2>{title}</h2>
      </Header>
      <Body>
      <div>
        <div className="cardGroup">
          { boxes.map((box, index)=> {
            const assign = Object.assign({}, {key: index}, box);
            if (box.url) {
              return (<a
                key={index}
                className="card cardGroup__card"
                target="_blank"
                href={box.url}>
                <Box {...assign} />
              </a>);
            } else {
              return (<div key={index} className="card cardGroup__card">
                <Box {...assign} />
              </div>);
            }
          })}
        </div>
        <div className="featureListItem"  title="Category">
          <div className="featureListItem__icon">
            <Icon
              size={50}
              icon="business"// Icon to use
            />
          </div>
          <div className="featureListItem__description">
            <div className="formFooter" style={{alignItems: 'center'}}>
              {categories[category].name} - {categories[category].description}
            </div>
          </div>
        </div>
        <div className="featureListItem featureListItem--reverse" title="Labels">
          <div className="featureListItem__icon">
            <Icon
              size={50}
              icon="label_outline"// Icon to use
            />
          </div>
          <div className="featureListItem__description">
            <div className="formFooter" style={{alignItems: 'center'}}>
              { labelMap }
            </div>
          </div>
        </div>
        <div className="featureListItem"  title="Maintainer(s)">
          <div className="featureListItem__icon">
            <Icon
              size={50}
              icon="account_circle"// Icon to use
            />
          </div>
          <div className="featureListItem__description">
            <div className="formFooter" style={{alignItems: 'center'}}>
              { developerMap }
            </div>
          </div>
        </div>
        <div className="featureListItem featureListItem--reverse" title="Description">
          <div className="featureListItem__icon" >
            <Icon
              size={50}
              icon="subject"// Icon to use
            />
          </div>
          <div
            className="featureListItem__description"
            dangerouslySetInnerHTML={{ __html: excerpt }}/>
        </div>
        <div className="featureListItem" title="Dependencies">
          <div className="featureListItem__icon">
            <Icon
              size={50}
              icon="bookmark"// Icon to use
            />
          </div>
          <div className="featureListItem__description">
            <div className="formFooter" style={{alignItems: 'center'}}>
              { dependenciesMap }
            </div>
          </div>
        </div>
        <div className="cardGroup">
          { boxesButtons.map((box, index)=> {
            const assign = Object.assign({}, {key: index}, box);
            if (box.url) {
              return (<a
                key={index}
                className="card cardGroup__card"
                target="_blank"
                href={box.url}>
                <Box {...assign} />
              </a>);
            } else {
              return (<div key={index} className="card cardGroup__card">
                <Box {...assign} />
              </div>);
            }
          })}
        </div>

      </div>
      </Body>
    </ModalView>);
  }
}

PluginDetail.propTypes = {
  getPlugin: func,
  plugin: any,
  params: object.isRequired, // From react-router
};

PluginDetail.contextTypes = {
  router: object.isRequired,
};

const selectors = createSelector([pluginSelector], (plugin) => ({plugin}));

export default connect(selectors, actions)(PluginDetail);
