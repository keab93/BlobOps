pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Rebuild & Deploy') {
            steps {
                sh 'docker compose down'
                sh 'docker compose up --build -d'
            }
        }
    }
}
