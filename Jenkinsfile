pipeline {
  agent any

  environment {
    // Docker Hub credential ID you already added in Jenkins
    DOCKER_CREDENTIALS = 'dockerHubCredentials'
    // Docker image name and registry
    IMAGE_NAME = 'saisamarth21/e-commerce'
  }

  stages {
    stage('Checkout') {
      steps {
        // Pull latest code from GitHub
        checkout([$class: 'GitSCM',
                  branches: [[name: '*/main']],
                  userRemoteConfigs: [[url: 'https://github.com/Saisamarth21/E-commerce-site.git']]])
      }
    }

    stage('Build Docker Image') {
      steps {
        script {
          // Build with a unique build ID tag
          def img = docker.build("${IMAGE_NAME}:${env.BUILD_ID}")
          // Also tag as 'latest'
          img.tag('latest')
        }
      }
    }

    stage('Push to Docker Hub') {
      steps {
        script {
          // Log in, push both tags, then log out
          docker.withRegistry('', "${DOCKER_CREDENTIALS}") {
            docker.image("${IMAGE_NAME}:${env.BUILD_ID}").push()
            docker.image("${IMAGE_NAME}:latest").push()
          }
        }
      }
    }

    stage('Cleanup') {
      steps {
        // Remove images from the agent to free space
        sh "docker rmi ${IMAGE_NAME}:${env.BUILD_ID} || true"
        sh "docker rmi ${IMAGE_NAME}:latest || true"
      }
    }
  }

  post {
    always {
      // Optionally archive build logs or notify
      echo "Build ${env.BUILD_ID} finished."
    }
  }
}
