pipeline {
  agent any
  environment {
    IMAGE_NAME         = 'saisamarth21/e-commerce'
    REGISTRY_CREDENTIAL = 'DockerCred'
  }
  stages {
    stage('Checkout') {
      steps {
        git url: 'https://github.com/Saisamarth21/E-commerce-site.git', branch: 'main'
      }
    }

    stage('Build Docker Image') {
      steps {
        script {
          // Build and tag only "latest"
          dockerImage = docker.build("${IMAGE_NAME}:latest")
        }
      }
    }

    stage('Login & Push') {
      steps {
        // Log into Docker Hub and push the single "latest" tag
        withCredentials([usernamePassword(
          credentialsId: "${REGISTRY_CREDENTIAL}",
          usernameVariable: 'DOCKER_USER',
          passwordVariable: 'DOCKER_PASS'
        )]) {
          sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
          sh "docker push ${IMAGE_NAME}:latest"
        }
      }
    }

    stage('Deploy') {
      steps {
        // Stop & remove any existing container, then run the new "latest" image
        sh "docker rm -f E-commerce || true"
        sh "docker run -d --name E-commerce -p 2001:2000 ${IMAGE_NAME}:latest"
      }
    }

    stage('Cleanup') {
      steps {
        // Optionally remove the local image to save space
        sh "docker rmi ${IMAGE_NAME}:latest || true"
      }
    }
  }
}
