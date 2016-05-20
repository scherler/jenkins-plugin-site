const knowLabelsToCategories = require('');

const kownPluginsToCategories = {
  'bitbucket': 'scm',
  'clearcase': 'scm',
  'cvs': 'scm',
  'gerrit-trigger': 'scm',
  'git': 'scm',
  'github': 'scm',
  'gitlab-hook': 'scm',
  'ghprb': 'scm',
  'gitlab-plugin': 'scm',
  'mercurial': 'scm',
  'perforce': 'scm',
  'subversion': 'scm',
  'ant': 'build',
  'gradle': 'build',
  'groovy': 'build',
  'maven-plugin': 'build',
  'msbuild': 'build',
  'nodejs': 'build',
  'powershell': 'build',
  'analysis-collector': 'build',
  'checkstyle': 'build',
  'cobertura': 'build',
  'javadoc': 'build',
  'junit': 'build',
  'pmd': 'build',
  'sonar': 'build',
  'xunit': 'build',
  'deploy': 'deploy',
  'email-ext': 'deploy',
  'flexible-publish': 'deploy',
  'htmlpublisher': 'deploy',
  'instant-messaging': 'deploy',
  'jabber': 'deploy',
  'jira': 'deploy',
  'mailer': 'deploy',
  'publish-over-ssh': 'deploy',
  'redmine': 'deploy',
  'slack': 'deploy',
  'build-pipeline-plugin': 'pipelines',
  'conditional-buildstep': 'pipelines',
  'copyartifact': 'pipelines',
  'parameterized-trigger': 'pipelines',
  'workflow-aggregator': 'pipelines',
  'docker-build-publish': 'devops',
  'docker-build-step': 'devops',
  'docker-plugin': 'devops',
  'matrix-project': 'devops',
  'ssh-slaves': 'devops',
  'windows-slaves': 'devops',
  'active-directory': 'security',
  'github-oauth': 'security',
  'ldap': 'security',
  'pam-auth': 'security',
  'matrix-auth': 'security',
};

module.exports = (plugin) => {
  var category = 'other';
  if (kownPluginsToCategories[plugin.name]) {
    category = kownPluginsToCategories[plugin.name];
  } else if (plugin.labels && plugin.labels[0] && knowLabelsToCategories[plugin.labels[0]]) {
    category = knowLabelsToCategories[plugin.labels[0]];
  }
  return category;
};
