pipeline {
  agent any

  environment {
    IMAGE_NAME = 'saisamarth21/e-commerce'
  }

  stages {
    stage('Checkout') {
      steps {
        // Pull the latest code from GitHub
        checkout scm
      }
    }

    stage('Build Docker Image') {
      steps {
        // Build and tag the image with both build ID and 'latest'
        sh '''
          docker build -t $IMAGE_NAME:$BUILD_ID .
          docker tag $IMAGE_NAME:$BUILD_ID $IMAGE_NAME:latest
        '''
      }
    }

    stage('Docker Login & Push') {
      steps {
        // Use your pre-configured Docker Hub credentials
        withCredentials([usernamePassword(
          credentialsId: 'dockerHubCredentials',
          usernameVariable: 'DOCKER_USER',
          passwordVariable: 'DOCKER_PASS'
        )]) {
          sh '''
            echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
            docker push $IMAGE_NAME:$BUILD_ID
            docker push $IMAGE_NAME:latest
            docker logout
          '''
        }
      }
    }

    stage('Cleanup') {
      steps {
        // Free up space on the agent
        sh '''
          docker rmi $IMAGE_NAME:$BUILD_ID || true
          docker rmi $IMAGE_NAME:latest    || true
        '''
      }
    }
  }

  post {
    always {
      echo "Build ${env.BUILD_ID} completed."
    }
  }
}
