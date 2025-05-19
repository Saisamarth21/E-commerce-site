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
        // No timeout here so the initial DB download (≈20 min) or updates run uninterrupted :contentReference[oaicite:2]{index=2}
        sh """
          ${OWASP_CLI_HOME}/bin/dependency-check.sh \
            --project "${SONAR_PROJECT_KEY}" \
            --scan . \
            --format XML \
            --format HTML \
            --out dependency-check-report
        """
      }
      post {
        always {
          // Wrap publisher in catchError to prevent any failures from failing the pipeline :contentReference[oaicite:3]{index=3}
          catchError(buildResult: 'SUCCESS', stageResult: 'SUCCESS') {
            // Parse the XML report; stopBuild=false means no automatic abort on threshold :contentReference[oaicite:4]{index=4}
            dependencyCheckPublisher(
              pattern: 'dependency-check-report/dependency-check-report.xml',
              stopBuild: false
            )
          }
          // (Optional) If you later install HTML Publisher, uncomment below to view the HTML report:
          /*
          publishHTML(target: [
            reportDir: 'dependency-check-report',
            reportFiles: 'dependency-check-report.html',
            reportName: 'OWASP HTML Report',
            keepAll: true,
            alwaysLinkToLastBuild: true
          ])
          */
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
