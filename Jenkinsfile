pipeline {
  agent any

  tools {
    // Make 'node' and 'npm' available via the NodeJS plugin
    nodejs 'NodeJS'
  }

  environment {
    // Your SonarQube project key
    SONAR_PROJECT_KEY = 'EcommerceSite'
    // Look up the SonarQube Scanner installation
    SONAR_SCANNER_HOME = tool 'SonarQubeScanner'
    // Fetch your Sonar auth token from Credentials
    SONAR_TOKEN = credentials('Sonar-token')
  }

  stages {
    stage('Checkout') {
      steps {
        // Clone your React–Vite repo
        git branch: 'main',
            url: 'https://github.com/Saisamarth21/E-commerce-site.git'
      }
    }

    stage('Build') {
      steps {
        // Install deps and build
        sh 'npm ci'
        sh 'npm run build'
      }
    }

    stage('SonarQube Analysis') {
      steps {
        // Inject SONAR_HOST_URL & SONAR_AUTH_TOKEN
        withSonarQubeEnv('SonarQube') {
          // Run the scanner CLI
          sh """
            ${SONAR_SCANNER_HOME}/bin/sonar-scanner \
              -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
              -Dsonar.sources=src \
              -Dsonar.host.url=${env.SONAR_HOST_URL} \
              -Dsonar.login=${SONAR_TOKEN}
          """
        }
      }
      post {
        always {
          // Wait up to 5 minutes for Quality Gate
          timeout(time: 5, unit: 'MINUTES') {
            waitForQualityGate abortPipeline: true
          }
        }
      }
    }
  }

  post {
    success {
      echo '✅ Pipeline succeeded & Quality Gate passed'
    }
    failure {
      echo '❌ Pipeline failed — check the logs for details'
    }
  }
}
