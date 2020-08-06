pipeline {
  agent any
  
  stages {
  
    stage('Git Checkout') {
      steps {
        git credentialsId: 'github-mahfuz', url: 'https://github.com/xels-io/XelsExchangeBackend.git'
      }
    }
    stage('Build') {
      steps {
        sh 'npm install'
      }
    }
    stage('Deploy') {
      steps {
        sshagent(['Build-Server-Pkey']) {
            sh 'ssh Administrator@13.114.52.87 "C:\\projects\\XelsExchangeBackend\\scripts\\deploy.bat"'
        }
      }
    }
    
  }
}