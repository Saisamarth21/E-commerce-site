pipeline {
  agent any

  tools {
    nodejs 'NodeJS'
  }

  environment {
    SONAR_PROJECT_KEY   = 'EcommerceSite'
    SONAR_SCANNER_HOME  = tool 'SonarQube-Scanner'
    SONAR_TOKEN         = credentials('sonar-admin-token')
    OWASP_CLI_HOME      = tool 'OWASP'
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

    stage('OWASP Dependency Check') {
      steps {
        // Run without a timeout so the initial DB download (≈20 min) can finish
        sh """
          ${OWASP_CLI_HOME}/bin/dependency-check.sh \
            --project "${SONAR_PROJECT_KEY}" \
            --scan . \
            --format HTML \
            --out dependency-check-report
        """
      }
      post {
        always {
          // Publish via the plugin's publisher step
          dependencyCheckPublisher pattern: 'dependency-check-report/dependency-check-report.html'
        }
      }
    }

    stage('SonarQube Analysis') {
      steps {
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
