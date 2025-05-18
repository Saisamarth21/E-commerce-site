pipeline {
  agent any

  tools {
    // Make 'node' and 'npm' available via the NodeJS plugin
    nodejs 'NodeJS'
  }

  environment {
    // SonarQube project key (adjust if you named it differently in SonarQube)
    SONAR_PROJECT_KEY = 'EcommerceSite'
    // Look up the Scanner installation named exactly “SonarQube-Scanner”
    SONAR_SCANNER_HOME = tool 'SonarQube-Scanner'
    // Fetch your Sonar auth token from Credentials (ID “Sonar-token”)
    SONAR_TOKEN       = credentials('Sonar-token')
  }

  stages {
    stage('Checkout') {
      steps {
        // Clone your React–Vite repo
        git branch: 'main',
            url:    'https://github.com/Saisamarth21/E-commerce-site.git'
      }
    }

    stage('Install & Build') {
      steps {
        // Install dependencies and build the app
        sh 'npm ci'
        sh 'npm run build'
      }
    }

    stage('SonarQube Analysis') {
      steps {
        // Inject SONAR_HOST_URL & SONAR_AUTH_TOKEN from your “SonarQube” server config
        withSonarQubeEnv('SonarQube') {
          // Run the Scanner CLI
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
          // Wait up to 5 minutes for the Quality Gate result
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
      echo '❌ Pipeline failed — check the logs!'
    }
  }
}
