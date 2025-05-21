pipeline {
  agent any

  tools {
    nodejs 'NodeJS'
  }

  environment {
    SONAR_PROJECT_KEY   = 'EcommerceSite'
    SONAR_SCANNER_HOME  = tool 'SonarQube-Scanner'
    SONAR_TOKEN         = credentials('sonar-admin-token')
    OWASP_CLI_HOME      = tool 'OWASP'
    DOCKER_HUB_REPO     = 'saisamarth21/e-commerce'
  }

  stages {
    stage('Checkout') {
      steps {
        git branch: 'main',
            url:    'https://github.com/Saisamarth21/E-commerce-site.git'
      }
    }

    stage('Install & Build') {
      steps {
        sh 'npm ci'
        sh 'npm run build'
      }
    }

    stage('OWASP Dependency Check') {
      steps {
        catchError(buildResult: 'SUCCESS', stageResult: 'SUCCESS') {
          sh """
            ${OWASP_CLI_HOME}/bin/dependency-check.sh \
              --project "${SONAR_PROJECT_KEY}" \
              --scan . \
              --format XML \
              --format HTML \
              --out dependency-check-report
          """
          dependencyCheckPublisher(
            pattern: 'dependency-check-report/dependency-check-report.xml',
            stopBuild: false
          )
        }
      }
    }

    stage('SonarQube Analysis') {
      when { expression { currentBuild.currentResult == 'SUCCESS' } }
      steps {
        withSonarQubeEnv('SonarQube') {
          sh """
            ${SONAR_SCANNER_HOME}/bin/sonar-scanner \
              -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
              -Dsonar.sources=src \
              -Dsonar.host.url=${env.SONAR_HOST_URL} \
              -Dsonar.token=${SONAR_TOKEN}
          """
        }
      }
      post {
        always {
          timeout(time: 5, unit: 'MINUTES') {
            waitForQualityGate abortPipeline: true
          }
        }
      }
    }

    stage('Build Docker Image') {
      when { expression { currentBuild.currentResult == 'SUCCESS' } }
      steps {
        script {
          def imgTag = "${DOCKER_HUB_REPO}:1.0.${env.BUILD_NUMBER}"
          dockerImage = docker.build(imgTag)
        }
      }
    }

    stage('Trivy Scan') {
      when { expression { currentBuild.currentResult == 'SUCCESS' } }
      steps {
        script {
          def imgTag = "${DOCKER_HUB_REPO}:1.0.${env.BUILD_NUMBER}"
          sh """
            trivy \
              --severity HIGH,CRITICAL \
              --no-progress \
              image \
              --format table \
              --output trivy-scan-report.txt \
              ${imgTag}
          """
        }
      }
      post {
        always {
          archiveArtifacts artifacts: 'trivy-scan-report.txt', fingerprint: true
        }
      }
    }

    stage('Push to Docker Hub') {
      when { expression { currentBuild.currentResult == 'SUCCESS' } }
      steps {
        script {
          docker.withRegistry('', 'DockerCred') {
            dockerImage.push()
          }
        }
      }
    }

    stage('Commit K8s Manifest') {
      when { expression { currentBuild.currentResult == 'SUCCESS' } }
      steps {
        script {
          // 1) Define the new image tag
          def newTag = "${DOCKER_HUB_REPO}:1.0.${env.BUILD_NUMBER}"

          // 2) Clone the manifests repo (public read, credential only for push)
          checkout([
            $class: 'GitSCM',
            branches: [[ name: '*/main' ]],
            userRemoteConfigs: [[
              url:           'https://github.com/Saisamarth21/Kubernetes-Manifest-Files.git',
              credentialsId: 'GitHubCred'
            ]]
          ])

          // 3) Update deployment.yaml's image line in-place
          sh """
            sed -i 's#^\\s*image:.*#        image: ${newTag}#' \
            K8s-ecommerce-site/deployment.yaml
          """

          // 4) Configure Git user for the commit
          sh 'git config user.email "jenkins@your.domain"'
          sh 'git config user.name  "Jenkins CI"'

          // 5) Commit & push the change
          sh """
            git add K8s-ecommerce-site/deployment.yaml
            git commit -m "chore(k8s): bump ecommerce image to ${newTag}"
            git push origin main
          """
        }
      }
    }

    stage('Cleanup') {
      when { expression { currentBuild.currentResult == 'SUCCESS' } }
      steps {
        script {
          def imgTag = "${DOCKER_HUB_REPO}:1.0.${env.BUILD_NUMBER}"
          sh "docker rmi ${imgTag} || true"
        }
      }
    }
  }

  post {
    success {
      emailext(
        attachLog: true,
        attachmentsPattern: 'dependency-check-report/*.html, dependency-check-report/*.xml, trivy-scan-report.txt',
        from:    'saisamarthu@gmail.com',
        to:      'saisamarthu@gmail.com',
        subject: "✅ Build #${env.BUILD_NUMBER} of ${env.JOB_NAME} Succeeded",
        mimeType: 'text/html',
        body: """
          <html>
            <body>
              <h2 style="color: green;">Build Succeeded!</h2>
              <p><strong>Project:</strong> ${env.JOB_NAME}</p>
              <p><strong>Build Number:</strong> ${env.BUILD_NUMBER}</p>
              <p><strong>Build URL:</strong> <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>
              <p><strong>Preview Site:</strong> <a href="https://test.saisamarth.duckdns.org/">https://test.saisamarth.duckdns.org/</a></p>
            </body>
          </html>
        """
      )
    }
    failure {
      emailext(
        attachLog: true,
        attachmentsPattern: 'dependency-check-report/*.html, dependency-check-report/*.xml, trivy-scan-report.txt',
        from:    'saisamarthu@gmail.com',
        to:      'saisamarthu@gmail.com',
        subject: "❌ Build #${env.BUILD_NUMBER} of ${env.JOB_NAME} Failed",
        mimeType: 'text/html',
        body: """
          <html>
            <body>
              <h2 style="color: red;">Build Failed!</h2>
              <p><strong>Project:</strong> ${env.JOB_NAME}</p>
              <p><strong>Build Number:</strong> ${env.BUILD_NUMBER}</p>
              <p><strong>Build URL:</strong> <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>
              <p>Please review the console output and attached reports for details.</p>
            </body>
          </html>
        """
      )
    }
  }
}
