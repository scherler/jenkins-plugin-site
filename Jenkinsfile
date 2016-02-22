node {
  // Mark the code checkout 'stage'....
  stage 'Checkout'
  // Get code from a scm repository
  checkout scm
  // Mark the code build 'stage'....
  stage 'Build'
  sh '/usr/local/bin/npm install'
  stage 'Test'
  sh './node_modules/.bin/eslint .'
  sh '/usr/local/bin/npm run test'
  stage 'depoly'
  // Build Docker file, run it and smoke test it
  docker.build('jenkinsciinfra/plugin-site').inside(){
    curl -sSfI http://0.0.0.0:5000
  }
}
