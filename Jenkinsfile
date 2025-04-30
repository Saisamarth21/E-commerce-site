pipeline {
  agent any

  environment {
    DOCKERHUB_CREDENTIALS = 'dockerHubCredentials'
    IMAGE_NAME            = 'saisamarth21/e-commerce:latest'
    BUILDER_NAME          = 'arm-builder'
    PLATFORM              = 'linux/arm64'
  }

  options {
    // Explicitly skip any earlier implicit checkout (optional)
    skipDefaultCheckout true
  }

  stages {
    stage('Checkout') {
      steps {
        // Check out the exact revision that triggered this build
        checkout scm
      }
    }

    stage('Setup Buildx') {
      steps {
        sh '''
          docker buildx create --name ${BUILDER_NAME} --use || true
        '''
      }
    }

    stage('Build Image') {
      steps {
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
