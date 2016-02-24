node {
  // Mark the code checkout 'stage'....
  stage 'commit - Checkout'
  // Get code from a scm repository
  checkout scm
  // Mark the code build 'stage'....
  stage 'commit - Build'
  sh '/usr/local/bin/npm install'
  stage 'commit - Test'
  sh './node_modules/.bin/eslint .'
  sh '/usr/local/bin/npm run test'
  stage 'deploy'
  // Build Docker file, run it and smoke test it
  docker.build('jenkinsciinfra/plugin-site')
  stage 'smoke'
  echo 'Test whether you can start it'
}
