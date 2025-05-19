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
        catchError(buildResult: 'SUCCESS', stageResult: 'SUCCESS') {
          sh """
            ${OWASP_CLI_HOME}/bin/dependency-check.sh \
              --project "${SONAR_PROJECT_KEY}" \
              --scan . \
              --format XML \
              --format HTML \
              --out dependency-check-report
          """
          dependencyCheckPublisher(
            pattern: 'dependency-check-report/dependency-check-report.xml',
            stopBuild: false
          )
        }
      }
    }

    stage('SonarQube Analysis') {
      when {
        expression { currentBuild.currentResult == 'SUCCESS' }
      }
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

    // ─────────────────────────────────────────────────────────────
    // New: Build & Tag Docker Image
    // ─────────────────────────────────────────────────────────────
    stage('Build Docker Image') {
      when {
        expression { currentBuild.currentResult == 'SUCCESS' }
      }
      steps {
        script {
          // Build and tag with build number
          dockerImage = docker.build(
            "saisamarth21/e-commerce:1.0.${env.BUILD_NUMBER}"
          )
        }
      }
    }

    // ─────────────────────────────────────────────────────────────
    // New: Push Image to Docker Hub
    // ─────────────────────────────────────────────────────────────
    stage('Push to Docker Hub') {
      when {
        expression { currentBuild.currentResult == 'SUCCESS' }
      }
      steps {
        script {
          // Automatically logs in using the DockerCred credential ID
          docker.withRegistry('', 'DockerCred') {
            // Push the tagged image
            dockerImage.push()
            // Optionally also push 'latest'
            dockerImage.push('latest')
          }
        }
      }
    }
  }

  post {
    success {
      echo '✅ Pipeline succeeded & Quality Gate passed!'
    }
    failure {
      echo '❌ Pipeline failed — check logs!'
    }
  }
}
