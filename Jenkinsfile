pipeline {
	agent any
  environment {
    PATH = "PATH=/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
  }
  stages {
  	stage('checkout') {
      steps {
  		  checkout scm
      }
  	}
    stage('build') {
      steps {
        sh script: 'echo $PATH'
        // sh 'PATH="/usr/local/bin:${PATH}"'
        // sh script: 'echo $PATH'
      	sh 'virtualenv ENV'
      	sh 'source env/bin/activate'
      	sh 'pip install -r requirements.txt'
      	sh 'cd static'
      	sh 'npm install'
      	sh 'npm run build'
      }
    }
    stage('run') {
      steps {
        sh 'python app.py'
      }
    }
  }
}
