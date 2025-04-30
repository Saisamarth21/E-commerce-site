pipeline {
  agent any

  environment {
    DOCKERHUB_CREDENTIALS = 'dockerHubCredentials'
    IMAGE_NAME            = 'saisamarth21/e-commerce:latest'
    BUILDER_NAME          = 'arm-builder'
    PLATFORM              = 'linux/arm64'
  }

  options {
    // Prevent the implicit “checkout Jenkinsfile only”
    skipDefaultCheckout true
  }

  stages {
    stage('Checkout') {
      steps {
        // Clone the full repo at the commit that triggered this build
        checkout scm
      }
    }

    stage('Setup Buildx Builder') {
      steps {
        // Create & switch to your ARM builder (no-op if exists)
        sh '''
          docker buildx create --name ${BUILDER_NAME} --use || true
        '''
      }
    }

    stage('Build Image') {
      steps {
        // Build for ARM64 and load into local Docker
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
        // Securely log in and push to Docker Hub
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
