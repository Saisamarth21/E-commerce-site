pipeline {
  agent any

  environment {
    DOCKERHUB_CREDENTIALS = 'dockerHubCredentials'
    IMAGE_NAME            = 'saisamarth21/e-commerce:latest'
    BUILDER_NAME          = 'arm-builder'
    PLATFORM              = 'linux/arm64'
  }

  options {
    skipDefaultCheckout()     // Disable lightweight checkout
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Setup Buildx Builder') {
      steps {
        // Create (or reuse) and select your ARM builder instance
        sh 'docker buildx create --name ${BUILDER_NAME} --use || true'
      }
    }

    stage('Build Image') {
      steps {
        // Build for Linux/ARM64 and load into local Docker
        sh '''
          docker buildx build \
            --platform ${PLATFORM} \
            -t ${IMAGE_NAME} \
            --load .
        '''
      }
    }

    stage('Push Image') {
      steps {
        // Login with Jenkins-stored credentials and push
        withCredentials([usernamePassword(
          credentialsId: "${DOCKERHUB_CREDENTIALS}",
          usernameVariable: 'DOCKER_USER',
          passwordVariable: 'DOCKER_PASS'
        )]) {
          sh '''
            echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
            docker push ${IMAGE_NAME}
          '''
        }
      }
    }
  }
}
