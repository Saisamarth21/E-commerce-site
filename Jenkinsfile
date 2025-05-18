pipeline {
  agent any

  tools {
    // Ensure this matches the name in "Global Tool Configuration"
    sonarScanner "SonarQube-Scanner"
    // You’ll need Node/NPM to build your React/Vite app
    nodejs "NodeJS-16"
  }

  environment {
    // Use the credential you added in Jenkins
    SONAR_TOKEN = credentials('Sonar-token')
  }

  stages {
    // … your existing build/test stages …

    stage('SonarQube Analysis') {
      // Requires the SonarQube plugin in Jenkins
      steps {
        // Binds SONAR_TOKEN and SONAR_HOST_URL into the shell environment
        withSonarQubeEnv('SonarQube') {
          // Install dependencies and build
          sh 'npm install'
          sh 'npm run build'

          // Run scanner against the built code
          sh """
            sonar-scanner \
              -Dsonar.projectKey=EcommerceSite \
              -Dsonar.sources=src \
              -Dsonar.host.url=${env.SONAR_HOST_URL} \
              -Dsonar.login=${env.SONAR_TOKEN}
          """
        }
      }
      post {
        // Always record the quality gate result
        always {
          timeout(time: 3, unit: 'MINUTES') {
            // Requires the "Pipeline: SonarQube" plugin
            waitForQualityGate abortPipeline: true
          }
        }
      }
    }

    // … any further stages …
  }

  post {
    success {
      echo "Pipeline succeeded, and SonarQube quality gate passed ✅"
    }
    failure {
      echo "Pipeline failed ❌"
    }
  }
}
