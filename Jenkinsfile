pipeline {
  agent any

  tools {
    nodejs 'NodeJS'
  }

  environment {
    // Docker Hub repository (must exactly match your Hub namespace)
    DOCKER_HUB_REPO     = 'saismarth21/e-commerce'
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
      when { expression { currentBuild.currentResult == 'SUCCESS' } }
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

    stage('Build Docker Image') {
      when { expression { currentBuild.currentResult == 'SUCCESS' } }
      steps {
        script {
          // Define and build a single tag based on the Jenkins build number
          def imgTag = "${DOCKER_HUB_REPO}:1.0.${env.BUILD_NUMBER}"
          dockerImage = docker.build(imgTag)
        }
      }
    }

    stage('Trivy Scan') {
      when { expression { currentBuild.currentResult == 'SUCCESS' } }
      steps {
        script {
          def imgTag = "${DOCKER_HUB_REPO}:1.0.${env.BUILD_NUMBER}"
          sh """
            trivy \
              --severity HIGH,CRITICAL \
              --no-progress \
              image \
              --format table \
              --output trivy-scan-report.txt \
              ${imgTag}
          """
        }
      }
      post {
        always {
          archiveArtifacts artifacts: 'trivy-scan-report.txt', fingerprint: true
        }
      }
    }

    stage('Push to Docker Hub') {
      when { expression { currentBuild.currentResult == 'SUCCESS' } }
      steps {
        script {
          docker.withRegistry('https://index.docker.io/v1/', 'DockerCred') {
            // Push only the build-number tag
            dockerImage.push()
          }
        }
      }
    }
  }

  post {
    success {
      echo '✅ Pipeline succeeded & image pushed with build number tag!'
    }
    failure {
      echo '❌ Pipeline failed — check logs!'
    }
  }
}
