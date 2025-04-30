pipeline {
  agent any

  environment {
    DOCKERHUB_CREDENTIALS = 'dockerHubCredentials'
    IMAGE_NAME            = 'saisamarth21/e-commerce:latest'
    BUILDER_NAME          = 'arm-builder'
    PLATFORM              = 'linux/arm64'
    BUILDX_VERSION        = 'v0.23.0'
  }

  options {
    // Prevent the implicit “checkout only Jenkinsfile”
    skipDefaultCheckout true
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install Buildx Plugin') {
      steps {
        sh '''
          # Ensure CLI plugins dir exists
          mkdir -p ~/.docker/cli-plugins
          # Download the matching binary for Jenkins agent architecture
          curl -SL https://github.com/docker/buildx/releases/download/${BUILDX_VERSION}/buildx-${BUILDX_VERSION}.linux-amd64 \
            -o ~/.docker/cli-plugins/docker-buildx
          chmod +x ~/.docker/cli-plugins/docker-buildx

          # Verify installation
          docker buildx version
        '''
      }
    }

    stage('Setup Buildx Builder') {
      steps {
        sh '''
          # Create or reuse the builder instance
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
