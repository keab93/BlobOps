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
            }}
        stage('Smoke Test') {
            steps {
		sh(script: '''#!/usr/bin/env bash
set -euxo pipefail
for i in $(seq 1 10); do
    code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/)
    printf 'Attempt %s: HTTP %s\n' "$i" "$code"
    if [ "$code" = 200 ]; then
        printf 'Smoke test passed!\n'
        exit 0
    fi
    sleep 5
done
printf 'Smoke test failed after 10 attempts.\n'
exit 1
		''')
		}

        }
    }
}
