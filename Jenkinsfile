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
        // sh script: 'echo $PATH'
        sh """
          pip3 install virtualenv
          python3 -m virtualenv --python=python3 ENV
          source ENV/bin/activate
          pip3 install -r requirements.txt
          cd static
          npm install
          npm run build
        """
      }
    }
    stage('test') {
      steps {
        sh """
          source ENV/bin/activate
          python3 test.py
        """
      }
    }
  }
}
