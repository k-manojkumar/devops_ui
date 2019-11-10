pipeline {
  agent {
    label 'master'
  }
  environment {
    registry = 'manojkumark/devops_ui'
    registryCredential = 'DockerCreds'
    dockerImage = ''
    PROJECT_ID = 'devops-258421'
    CLUSTER_NAME = 'standard-cluster-1'
    LOCATION = 'europe-north1-a'
    CREDENTIALS_ID = 'ManojGCP'
  }
  stages {
    stage ('Sonar Scan'){
        steps{
            script{
                def scannerHome = tool 'SonarScanner';
                withSonarQubeEnv('DevOps'){
                    echo "${scannerHome}"
                    //sh '$(scannerHome)/bin/sonar-scanner -Dproject.settings=./sonar-project.properties'
                } 
            }
        }
    }

    stage ('compile'){
        steps{
            sh 'npm -v'
            sh 'npm i'
            sh 'npm run build'
        }
    }  
    stage ('Docker Build'){
      steps{
        sh 'whoami'
      	echo 'Build Docker Image with tag ${BUILD_NUMBER}'
        script {
          dockerImage = docker.build registry + ":${BUILD_NUMBER}"
        }
      }
    }
    stage ('Docker Publish'){
      steps{
        script {
            docker.withRegistry( '', registryCredential ) {
            dockerImage.push()
            }
          }          
      }
      post {
          always{
              sh 'docker rmi ${registry}:${BUILD_NUMBER} || exit 0'
          }
      }
    }
    stage ('Deploy Container'){
      steps{
        sh "sed -i 's/VERSION/${BUILD_NUMBER}/g' k8s/deploy.yaml"
        step([$class: 'KubernetesEngineBuilder', projectId: env.PROJECT_ID, clusterName: env.CLUSTER_NAME, location: env.LOCATION, manifestPattern: 'k8s/deploy.yaml', credentialsId: env.CREDENTIALS_ID, verifyDeployments: true])
           
      }
    }
  }
}