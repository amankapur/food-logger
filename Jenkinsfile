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
    stage('deploy:staging') {
      steps {
        sh """
          cd
          git clone https://github.com/amankapur/food-logger
          cd food-logger
          pip3 install virtualenv
          python3 -m virtualenv --python=python3 ENV
          source ENV/bin/activate
          pip3 install wheel
          pip3 install flaskr-1.0.0-py3-none-any.whl
          export FLASK_APP=flaskr
          flask init-db
          pip3 install waitress
          waitress-serve --call 'flaskr:create_app'
        """
      }
    }
  }
}
