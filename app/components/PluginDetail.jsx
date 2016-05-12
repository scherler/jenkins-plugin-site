import PureComponent from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import ModalView, {Body, Header} from 'react-header-modal';
import { actions, plugin as pluginSelector, createSelector, connect } from '../resources';

const { func, object, any } = PropTypes;

export class PluginDetail extends PureComponent {
  componentWillMount() {
     if (this.props.params && this.props.params.pluginName) {
       const name = this.props.params.pluginName;
       const { getPlugin } = this.props;
       getPlugin(name);
     }
  }

  render() {
    if (!this.props.plugin || !this.props.plugin.name) {
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
          stats,
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
    console.log(stats, 'plugin')
    return (<ModalView hideOnOverlayClicked isVisible {...{ afterClose }}>
      <Header>
        <h2>{title}</h2>
      </Header>
      <Body>
      <ul>
        <li>Name: {name}</li>
        <li>Links: <a target="_blank" href={wiki}>Wiki</a></li>
        <li>requiredCore:&nbsp;
          <a
            target="_blank"
            href={`http://updates.jenkins-ci.org/download/war/${requiredCore}/jenkins.war`}
          >
            {requiredCore}
          </a>
        </li>
        <li>hpi:&nbsp;
          <a
            href={url}
          >
            latest
          </a>&nbsp;
          <a
            href={`http://updates.jenkins-ci.org/download/plugins/${name}/`}
          >
            archives
          </a>
        </li>
        <li>Excerpt: {excerpt}</li>
      </ul>
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

const selectors = createSelector([pluginSelector], (plugin) => ({ plugin }));

export default connect(selectors, actions)(PluginDetail);
