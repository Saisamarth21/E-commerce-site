pipeline {
  agent any

  environment {
    IMAGE_NAME         = 'saisamarth21/e-commerce'
    REGISTRY_CREDENTIAL = 'DockerCred'
    CONTAINER_NAME     = 'E-commerce'
    HOST_PORT          = '2001'
    CONTAINER_PORT     = '2000'
  }

  stages {
    stage('Cleanup Existing') {
      steps {
        script {
          // 1) Stop & remove any existing container named "E-commerce"
          sh "docker ps -q --filter \"name=^/${CONTAINER_NAME}$\" | xargs -r docker rm -f"

          // 2) Remove any existing local image "saisamarth21/e-commerce:latest"
          sh "docker images -q ${IMAGE_NAME}:latest | xargs -r docker rmi -f"
        }
      }
    }

    stage('Checkout') {
      steps {
        // 3) Pull the latest code
        git url: 'https://github.com/Saisamarth21/E-commerce-site.git', branch: 'main'
      }
    }

    stage('Build') {
      steps {
        // 4) Build & tag fresh image as "latest"
        script {
          docker.build("${IMAGE_NAME}:latest")
        }
      }
    }

    stage('Push to Docker Hub') {
      steps {
        // 5) Login & push :latest
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

    stage('Deploy Latest') {
      steps {
        // 6) Run new container on port mapping HOST:CONTAINER
        sh """
          docker run -d \
            --name ${CONTAINER_NAME} \
            -p ${HOST_PORT}:${CONTAINER_PORT} \
            ${IMAGE_NAME}:latest
        """
      }
    }
  }
}
