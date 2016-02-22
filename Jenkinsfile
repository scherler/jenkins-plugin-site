node {
  // Mark the code checkout 'stage'....
  stage 'Checkout'
  // Get some code from a GitHub repository
  // FIME: should be ... ?
  git url: 'https://github.com/scherler/jenkins-plugin-site.git', branch: 'issue/WEBSITE-87'
  // Mark the code build 'stage'....
  stage 'Build'
  sh '/usr/local/bin/npm install'
  stage 'Test'
  sh './node_modules/.bin/eslint .'
  sh '/usr/local/bin/npm run test'
  stage 'depoly'
  // Build Docker file
  docker.build('jenkinsciinfra/plugin-site').inside('-p 5000:5000'){
    curl -sSfI 0.0.0.0:5000
  }
}
