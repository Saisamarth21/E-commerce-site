pipeline {
  agent any

  environment {
    IMAGE_NAME       = 'saisamarth21/e-commerce'
    REGISTRY_CRED_ID = 'DockerCred'
    CONTAINER_NAME   = 'E-commerce'
    HOST_PORT        = '2001'
    CONTAINER_PORT   = '2000'
  }

  stages {
    stage('Cleanup Existing') {
      steps {
        // Stop & remove only the E-commerce container, if present
        // Remove only the local ":latest" image, if present
        sh '''
          docker ps -q --filter "name=^/${CONTAINER_NAME}$" \
            | xargs -r docker rm -f

          docker images -q ${IMAGE_NAME}:latest \
            | xargs -r docker rmi -f
        '''
      }
    }

    stage('Checkout') {
      steps {
        git url: 'https://github.com/Saisamarth21/E-commerce-site.git', branch: 'main'
      }
    }

    stage('Build') {
      steps {
        script {
          docker.build("${IMAGE_NAME}:latest")
        }
      }
    }

    stage('Push to Docker Hub') {
      steps {
        withCredentials([usernamePassword(
          credentialsId: "${REGISTRY_CRED_ID}",
          usernameVariable: 'DOCKER_USER',
          passwordVariable: 'DOCKER_PASS'
        )]) {
          sh '''
            echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
            docker push ${IMAGE_NAME}:latest
          '''
        }
      }
    }

    stage('Deploy Latest') {
      steps {
        // Run the new "latest" image, replacing the old container
        sh '''
          docker run -d \
            --name ${CONTAINER_NAME} \
            -p ${HOST_PORT}:${CONTAINER_PORT} \
            ${IMAGE_NAME}:latest
        '''
      }
    }
  }
}
