pipeline {
    agent any

    stages {

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t vitalsync-backend:latest .'
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                docker rm -f vitalsync-backend-auto || true

                docker run -d \
                  --name vitalsync-backend-auto \
                  --network vitalsync-network \
                  -e DATABASE_URL="postgresql://postgres:12345@vitalsync-postgres:5432/vitalsync_db?schema=public" \
                  -e PORT=5000 \
                  -e NODE_ENV=production \
                  -p 5001:5000 \
                  vitalsync-backend:latest
                '''
            }
        }

    }
}