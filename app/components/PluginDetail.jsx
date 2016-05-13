import PureComponent from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import ModalView, {Body, Header} from 'react-header-modal';
import {Icon} from 'react-material-icons-blue';
import Chart from './Chart';
import Box from './Box';
import numeral from 'numeral';
import { actions, plugin as pluginSelector, createSelector, connect } from '../resources';

const { func, object, any, string } = PropTypes;

export class PluginDetail extends PureComponent {
  componentWillMount() {
    if (this.props.params && this.props.params.pluginName) {
      const name = this.props.params.pluginName;
      const { getPlugin } = this.props;
      getPlugin(name);
    }
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
          url,
          stats: {
            installations,
            installationsPerVersion,
            },
          wiki,
          requiredCore,
          },
        params: {
          pluginName
          }
        },
      } = this;
    const afterClose = () => {
      router.goBack();
    };
    let total  = 0;
    const installationData = Object.keys(installations).map((entry, index) => {
      const installation = installations[entry];
      total  += installation;
      const slice = {x: parseInt(entry) / 1000000000000, y: installation};
      return slice;
    });
    const versionData = Object.keys(installationsPerVersion).map((entry, index) => {
      const installation = installationsPerVersion[entry];
      const slice = {x: `${entry}`, y: installation, label: installation};
      return slice;
    });
    const formatedTotal = numeral(total).format('0.0 a');
    const boxes = [
      {
        icon: 'perm_identity',
        footer: 'ID',
        label: name,
      },
      {
        url: wiki,
        icon: 'help',
        footer: 'HELP',
        label: 'Wiki',
      },
      {
        url: url,
        icon: 'file_download',
        footer: 'HPI',
        label: 'latest',
      },
      {
        url: `http://updates.jenkins-ci.org/download/plugins/${name}/`,
        icon: 'launch',
        footer: 'HPI',
        label: 'archives',
      },
      {
        url: `http://updates.jenkins-ci.org/download/war/${requiredCore}/jenkins.war`,
        icon: 'file_download',
        footer: 'Required Core',
        label: requiredCore,
      },
      {
        icon: 'play_install',
        footer: 'Total Installs',
        label: formatedTotal,
      },
    ];
    return (<ModalView hideOnOverlayClicked isVisible {...{afterClose}}>
      <Header>
        <h2>{title}</h2>
      </Header>
      <Body>
      <div>
        <div className="cardGroup">
          { boxes.map((box, index)=> {
            const assign = Object.assign({}, { key: index }, box);
            if (box.url) {
              return (<a
                key={index}
                className="card cardGroup__card"
                target="_blank"
                href={box.url} >
                <Box {...assign} />
              </a>);
            } else {
              return (<div key={index} className="card cardGroup__card">
                <Box {...assign} />
              </div>);
            }
          } )}
        </div>
        <div className="featureListItem">
          <div className="featureListItem__icon">
            <Icon
              size={50}
              icon="subject"// Icon to use
            />
          </div>
          <div
            className="featureListItem__description"
            dangerouslySetInnerHTML={{ __html: excerpt }} />
        </div>
        <div className="formFooter">
          <div className="formFooter__section">
            <Chart label="Version of plugin" data={versionData}/>
          </div>
          <div className="formFooter__section">
            <Chart data={installationData}/>
          </div>
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
