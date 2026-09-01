# VitalSync DevOps Capstone

VitalSync DevOps Capstone is an end-to-end delivery implementation for an existing full-stack health tracking application.

This repository demonstrates a complete promotion path across Development, Staging, and Production environments using CI/CD, containerization, Kubernetes, and Argo CD GitOps.

## Application Components

- Frontend: Next.js, React, TypeScript, Tailwind CSS
- Backend: Node.js, Express, TypeScript, Prisma
- Database: PostgreSQL
- Containerization: Docker
- Container Registry: GitHub Container Registry
- CI/CD: GitHub Actions
- Orchestration: Kubernetes on AWS
- GitOps: Argo CD

## Required Environment Promotion Flow

feature/* -> dev -> stage -> prod

- Development deployment is manually triggered.
- Staging deployment is manually triggered.
- Production deployment is automatically triggered when a pull request is opened against the prod branch.
- Kubernetes exposure uses Services only.
- Kubernetes Ingress is intentionally excluded by assignment requirement.
- Argo CD reconciles the desired state declared in Git.

## Repository Structure

vitalsync-devops-capstone/
|-- frontend/
|-- backend/
|-- .github/workflows/
|-- kubernetes/
|   |-- dev/
|   |-- stage/
|   `-- prod/
|-- argocd/
|-- docs/
|-- evidence/
`-- README.md

## Branching Strategy

The repository uses three long-lived environment branches:

- dev: Development integration and validation
- stage: Staging and release-candidate validation
- prod: Production release branch

Feature changes are introduced through short-lived feature/* branches and promoted through pull requests.

## Image Versioning

Docker images will use environment and commit-identifiable tags instead of relying only on latest.

Examples:

ghcr.io/ebnulahsan/vitalsync-frontend:dev-<short-sha>

ghcr.io/ebnulahsan/vitalsync-backend:prod-<short-sha>

## Assignment Status

Initial project source import is in progress. CI/CD workflows, Docker images, Kubernetes manifests, AWS deployment, and Argo CD delivery will be added incrementally with auditable Git history.