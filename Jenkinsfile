pipeline {
  agent any                                      // Allocate an executor and workspace on any available agent :contentReference[oaicite:6]{index=6}
  options { skipDefaultCheckout(true) }          // Prevent the automatic SCM checkout :contentReference[oaicite:7]{index=7}
  stages {
    stage('Checkout') {
      steps {
        // Ensure we're on the latest main
        sh 'git pull origin main'
      }
    }
    stage('Create Builder') {
      steps {
        // Initialize a new Buildx builder and switch to it
        sh 'docker buildx create --name arm-builder --use'
      }
    }
    stage('Use Builder') {
      steps {
        // Explicitly select the named builder for subsequent commands
        sh 'docker buildx use arm-builder'
      }
    }
    stage('Build Image') {
      steps {
        // Build for ARM64 and load into local Docker
        sh 'docker buildx build --platform linux/arm64 -t saisamarth21/e-commerce:latest --load .'
      }
    }
    stage('Push Image') {
      steps {
        // Push the freshly built image to Docker Hub
        sh 'docker push saisamarth21/e-commerce:latest'
      }
    }
  }
}
