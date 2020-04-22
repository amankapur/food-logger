pipeline {
	agent any
  stages {
  	stage('checkout') {
      steps {
  		  checkout scm
      }
  	}
    stage('build') {
      steps {
        // echo '$PATH'
        // sh 'PATH="/usr/local/bin:${PATH}"'
        sh script: 'echo $PATH'
      	sh 'python3 -m virtualenv --python=python3 ENV'
      	sh 'source ENV/bin/activate'
      	sh 'pip3 install -r requirements.txt'
      	sh 'cd static'
      	sh 'npm install'
      	sh 'npm run build'
      }
    }
  }
}
