pipeline {
  agent any

  environment {
    // Your Sonar token stored in Jenkins Credentials (Secret text)
    SONAR_TOKEN = credentials('Sonar-token')
  }

  stages {
    // … your existing Build/Test stages …

    stage('SonarQube Analysis') {
      steps {
        script {
          // 1. Fetch the SonarScanner installation you defined under
          //    Manage Jenkins → Global Tool Configuration → SonarQube Scanner
          def scannerHome = tool name: 'SonarQube-Scanner', type: 'hudson.plugins.sonar.SonarRunnerInstallation'
          // 2. Inject SONAR_HOST_URL & SONAR_AUTH_TOKEN into env
          withSonarQubeEnv('SonarQube') {
            // 3. Run analysis
            sh """
              ${scannerHome}/bin/sonar-scanner \
                -Dsonar.projectKey=EcommerceSite \
                -Dsonar.sources=src \
                -Dsonar.host.url=${env.SONAR_HOST_URL} \
                -Dsonar.login=${env.SONAR_TOKEN}
            """
          }
        }
      }
      post {
        always {
          // Pause pipeline to wait for Quality Gate result
          timeout(time: 5, unit: 'MINUTES') {
            waitForQualityGate abortPipeline: true
          }
        }
      }
    }
  }

  post {
    success {
      echo "✅ SonarQube analysis passed Quality Gate"
    }
    failure {
      echo "❌ Pipeline failed"
    }
  }
}
