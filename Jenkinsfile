pipeline {
  agent any
  environment {
    IMAGE_NAME = 'saisamarth21/e-commerce'
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
          dockerImage = docker.build("${IMAGE_NAME}:latest")
        }
      }
    }
    stage('Login & Push') {
      steps {
        withCredentials([usernamePassword(
          credentialsId: "${REGISTRY_CREDENTIAL}", 
          usernameVariable: 'DOCKER_USER', 
          passwordVariable: 'DOCKER_PASS'
        )]) {
          sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
          sh "docker tag ${IMAGE_NAME}:latest ${IMAGE_NAME}:${BUILD_NUMBER}"
          sh "docker push ${IMAGE_NAME}:${BUILD_NUMBER}"
          sh "docker push ${IMAGE_NAME}:latest"
        }
      }
    }
    stage('Cleanup') {
      steps {
        sh "docker rmi ${IMAGE_NAME}:latest || true"
        sh "docker rmi ${IMAGE_NAME}:${BUILD_NUMBER} || true"
      }
    }
  }
}
