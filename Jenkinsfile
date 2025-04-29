pipeline {
  agent any
  options {
    // Prevent Jenkins from doing an automatic checkout
    skipDefaultCheckout true
  }
  environment {
    // Use the Jenkins credential ID for your Docker Hub login
    DOCKERHUB = credentials('dockerhub-credentials')
  }
  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }
    stage('Install Buildx') {
      steps {
        sh '''
          mkdir -p "$HOME/.docker/cli-plugins"
          curl -sSL \
            https://github.com/docker/buildx/releases/download/v0.10.4/buildx-v0.10.4.linux-amd64 \
            -o "$HOME/.docker/cli-plugins/docker-buildx"
          chmod +x "$HOME/.docker/cli-plugins/docker-buildx"
          docker buildx version
          docker buildx create --use
        '''
      }
    }
    stage('Build & Push') {
      steps {
        withEnv(["DOCKER_USER=${DOCKERHUB_USR}", "DOCKER_PASS=${DOCKERHUB_PSW}"]) {
          sh '''
            # Log in to Docker Hub
            echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin

            # Build and push the ARM64 image in one step
            docker buildx build \
              --platform linux/arm64 \
              -t saisamarth21/e-commerce:latest \
              --push .
          '''
        }
      }
    }
  }
}
