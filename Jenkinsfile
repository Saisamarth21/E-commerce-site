pipeline {
  agent any

  tools {
    // Use the NodeJS installation you configured
    nodejs 'NodeJS'
  }

  environment {
    // SonarQube settings
    SONAR_PROJECT_KEY   = 'EcommerceSite'
    SONAR_SCANNER_HOME  = tool 'SonarQube-Scanner'
    SONAR_TOKEN         = credentials('sonar-admin-token')
    // OWASP Dependency‑Check installation
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
        // Allow up to 30 minutes for the OWASP Dependency-Check (first run ~20m)
        timeout(time: 30, unit: 'MINUTES') {
          // Run the CLI scan against the workspace
          sh """
            ${OWASP_CLI_HOME}/bin/dependency-check.sh \
              --project "${SONAR_PROJECT_KEY}" \
              --scan . \
              --format HTML \
              --out dependency-check-report
          """
        }
      }
      post {
        always {
          // Publish the HTML report so it’s visible in the build UI
          publishHTML([
            reportDir:      'dependency-check-report',
            reportFiles:    'dependency-check-report.html',
            reportName:     'OWASP Dependency‑Check Report',
            keepAll:        true,
            alwaysLinkToLastBuild: true,
            allowMissing:   false
          ])
        }
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
