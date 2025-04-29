pipeline {
  agent any
  environment {
    // Binds 'dockerhub-credentials' to DOCKERHUB_USR and DOCKERHUB_PSW
    DOCKERHUB = credentials('dockerhub-credentials')
  }
  stages {
    stage('Checkout') {
      steps {
        // Clone the repo at the commit that triggered this build
        checkout scm
      }
    }
    stage('Setup Buildx Builder') {
      steps {
        sh """
          # Create and switch to an ARM-capable Builder
          docker buildx create --name arm-builder --driver docker-container --use
        """
      }
    }
    stage('Build Image') {
      steps {
        sh """
          # Build an ARM64 image and load it into the local Docker store
          docker buildx build \
            --platform linux/arm64 \
            -t saisamarth21/e-commerce:latest \
            --load .
        """
      }
    }
    stage('Push Image') {
      steps {
        // Log in and push the built image to Docker Hub
        withEnv(["DOCKER_USER=${DOCKERHUB_USR}", "DOCKER_PASS=${DOCKERHUB_PSW}"]) {
          sh """
            echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
            docker push saisamarth21/e-commerce:latest
          """
        }
      }
    }
  }
}
