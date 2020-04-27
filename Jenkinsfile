pipeline {
	agent any
  // environment {
  //   PATH = "/home/ubuntu/.local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin"
  // }
  stages {
  	stage('checkout') {
      steps {
  		  checkout scm
      }
  	}
    stage('build') {
      steps {
        sh script: 'echo $PATH'
        sh """
          pip3 install virtualenv
          python3 -m virtualenv --python=python3 ENV
          source ENV/bin/activate
          pip3 install -r requirements.txt
          cd static
          npm install
          npm run build
          cd static/js/
          npm install
          npm run build
        """
      }
    }
  }
}
