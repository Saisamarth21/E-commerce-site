pipeline {
  agent any

  tools {
    // Install Node.js via the NodeJS Plugin
    nodejs 'NodeJS' 
  }

  environment {
    // Your SonarQube project key
    SONAR_PROJECT_KEY = 'EcommerceSite'
    // Look up the SonarQube Scanner installation by name
    SONAR_SCANNER_HOME = tool 'SonarQubeScanner'
    // Fetch your token from Jenkins credentials
    SONAR_TOKEN = credentials('Sonar-token')
  }

  stages {
    stage('Checkout') {
      steps {
        git branch: 'main',
            url: 'https://github.com/Saisamarth21/E-commerce-site.git',
            // optional: credentialsId: 'github-cred'
      }
    }

    stage('Install & Build') {
      steps {
        sh 'npm ci'   // installs dependencies
        sh 'npm run build'
      }
    }

    stage('SonarQube Analysis') {
      steps {
        // 1. Expose SONAR_HOST_URL & SONAR_AUTH_TOKEN
        withSonarQubeEnv('SonarQube') {
          // 2. Run the scanner
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
          // Wait (up to 5m) for Quality Gate result
          timeout(time: 5, unit: 'MINUTES') {
            waitForQualityGate abortPipeline: true
          }
        }
      }
    }
  }

  post {
    success { echo '✅ Pipeline succeeded & Quality Gate passed' }
    failure { echo '❌ Pipeline failed — check logs!' }
  }
}
