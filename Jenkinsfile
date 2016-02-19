node {
   // Mark the code checkout 'stage'....
   stage 'Checkout'

   // Get some code from a GitHub repository
   // FIME: should be ... ?
   git url: 'https://github.com/scherler/jenkins-plugin-site.git', branch: 'issue/WEBSITE-87'
   // Mark the code build 'stage'....
   stage 'Build'
   // Build Docker file
   docker.build('jenkinsciinfra/plugin-site').run('-p 5000:5000')
}
