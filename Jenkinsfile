pipeline {
  agent any

  tools {
    // Use the NodeJS installation you configured
    nodejs 'NodeJS'
  }

  environment {
    // Your SonarQube project key
    SONAR_PROJECT_KEY   = 'EcommerceSite'
    // Point at the SonarQube Scanner you configured
    SONAR_SCANNER_HOME  = tool 'SonarQube-Scanner'
    // Inject your admin-level token
    SONAR_TOKEN         = credentials('sonar-admin-token')
  }

  stages {
    stage('Checkout') {
      steps {
        git branch: 'main',
            url:    'https://github.com/Saisamarth21/E-commerce-site.git'
      }
    }

    stage('Install & Build') {
      steps {
        sh 'npm ci'
        sh 'npm run build'
      }
    }

    stage('SonarQube Analysis') {
      steps {
        // Wrap in withSonarQubeEnv to inject SONAR_HOST_URL
        withSonarQubeEnv('SonarQube') {
          sh """
            ${SONAR_SCANNER_HOME}/bin/sonar-scanner \
              -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
              -Dsonar.sources=src \
              -Dsonar.host.url=${env.SONAR_HOST_URL} \
              -Dsonar.token=${SONAR_TOKEN}
          """
        }
      }
      post {
        always {
          timeout(time: 5, unit: 'MINUTES') {
            waitForQualityGate abortPipeline: true
          }
        }
      }
    }
  }

  post {
    success { echo '✅ Pipeline succeeded & Quality Gate passed!' }
    failure { echo '❌ Pipeline failed — check logs!' }
  }
}
