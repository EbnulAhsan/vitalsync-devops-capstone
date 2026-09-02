# VitalSync DevOps Capstone

A production-style CI/CD, containerization, Kubernetes, and GitOps delivery implementation for the **VitalSync full-stack health tracking platform**.

This repository demonstrates a complete and auditable promotion path across **Development**, **Staging**, and **Production** environments. It uses GitHub Actions for continuous integration and environment-aware delivery, Docker and GitHub Container Registry for versioned application images, Kubernetes for workload and service delivery, and Argo CD for GitOps reconciliation on an AWS-hosted K3s cluster.

> The assignment reference application was replaced with the existing VitalSync full-stack application to demonstrate the same required DevOps controls against a more realistic frontend, backend, database, authentication, and dashboard workload.

---

## Repository

- **GitHub:** https://github.com/EbnulAhsan/vitalsync-devops-capstone
- **Frontend:** Next.js
- **Backend:** Node.js, Express, TypeScript, Prisma
- **Database:** PostgreSQL
- **Container Registry:** GitHub Container Registry, GHCR
- **Kubernetes distribution:** K3s
- **GitOps controller:** Argo CD
- **Cloud environment:** AWS EC2

---

## Assignment Coverage

This project implements all required delivery areas:

1. Long-lived `dev`, `stage`, and `prod` branches
2. Continuous integration on pushes and pull requests
3. Manually triggered Development deployment
4. Manually triggered Staging deployment
5. Automatically triggered Production deployment when a pull request is opened against `prod`
6. Separate Development and Production Docker build strategies
7. Commit-identifiable image tags
8. Kubernetes Deployments and Services without Ingress
9. Environment isolation through Kubernetes namespaces
10. Argo CD reconciliation for Development, Staging, and Production
11. End-to-end verification of registration, login, health check, and dashboard access

---

## Architecture

```text
Developer / Feature Work
          |
          v
      dev branch
          |
          | Manual GitHub Actions deployment
          v
  GHCR dev-<commit> images
          |
          v
 kubernetes/dev manifests
          |
          v
 Argo CD -> vitalsync-dev
          |
          | Validated promotion
          v
     stage branch
          |
          | Manual GitHub Actions deployment
          v
 GHCR stage-<commit> images
          |
          v
kubernetes/stage manifests
          |
          v
Argo CD -> vitalsync-stage
          |
          | Pull request opened against prod
          v
Automatic Production workflow
          |
          v
 GHCR prod-<commit> images
          |
          v
 kubernetes/prod manifests
          |
          v
 Argo CD -> vitalsync-prod
```

Each environment contains an isolated PostgreSQL, backend, and frontend deployment. Kubernetes Services provide internal database connectivity and NodePort access for the application. No Ingress resource is used, as required by the assignment.

---

## Branching and Promotion Strategy

### Long-lived branches

- **`dev`**: integration branch for active development and Development validation
- **`stage`**: validated candidate branch for Staging and Production promotion
- **`prod`**: production release history and pull request promotion target
- **`main`**: retained as an additional repository branch, but the assessed environment path is `dev -> stage -> prod`

### Intended promotion path

```text
feature work -> dev -> stage -> pull request against prod
```

Development and Staging do not deploy merely because code reaches their branches. A human must explicitly run the relevant GitHub Actions workflow. Production follows the assignment's non-negotiable rule: deployment starts automatically when a pull request is **opened against the `prod` branch**.

Pull requests provide an inspectable production promotion record. GitHub Actions bot commits provide an auditable link between a source commit, its container image version, and the desired Kubernetes state stored in Git.

---

## Continuous Integration

Workflow:

```text
.github/workflows/ci.yml
```

The `VitalSync CI` workflow runs on pushes and pull requests involving:

- `dev`
- `stage`
- `prod`

### Frontend validation

- Installs dependencies with `npm ci`
- Runs frontend linting
- Builds the Next.js application

### Backend validation

- Installs dependencies with `npm ci`
- Generates the Prisma Client
- Runs backend linting
- Builds the TypeScript backend

### Docker build validation

After frontend and backend validation succeed, CI validates four container builds:

- Frontend Development image
- Frontend Production image
- Backend Development image
- Backend Production image

CI does not push these validation images. Publishing is handled only by the environment delivery workflows. A failed lint, application build, Prisma generation, or Docker build causes the workflow to fail visibly in GitHub Actions.

### Validation decision

The project uses linting, application compilation, Prisma Client generation, and complete Docker build validation as the required CI gate. These checks verify that both application components compile and that all Development and Production container definitions remain buildable before delivery.

---

## Continuous Delivery

### Development: manual deployment

Workflow:

```text
.github/workflows/publish-dev-images.yml
```

Trigger:

```yaml
on:
  workflow_dispatch:
```

A human starts this workflow from GitHub Actions. The workflow:

1. Checks out the `dev` branch
2. Builds frontend and backend using `Dockerfile.dev`
3. Pushes images to GHCR with `dev-<short-commit-sha>` tags
4. Updates image tags in `kubernetes/dev`
5. Creates a GitHub Actions bot commit on `dev`
6. Allows Argo CD to reconcile the Development environment

Verified Development version:

```text
dev-a25768b
```

Verified GitOps manifest commit:

```text
28297f6
```

### Staging: manual deployment

Workflow:

```text
.github/workflows/publish-stage-images.yml
```

Trigger:

```yaml
on:
  workflow_dispatch:
```

A human starts this workflow after selecting a validated Staging candidate. The workflow:

1. Checks out the `stage` branch
2. Builds optimized frontend and backend images using `Dockerfile.prod`
3. Configures the frontend to use the Staging backend
4. Pushes images with `stage-<short-commit-sha>` tags
5. Updates image tags in `kubernetes/stage`
6. Creates a GitHub Actions bot commit on `stage`
7. Allows Argo CD to reconcile the Staging environment

Verified Staging version:

```text
stage-3507d90
```

Verified GitOps manifest commit:

```text
b42707d
```

### Production: automatic deployment on PR open

Workflow:

```text
.github/workflows/deploy-prod-on-pr.yml
```

Trigger:

```yaml
on:
  pull_request:
    branches:
      - prod
    types:
      - opened
```

Opening a pull request against `prod` automatically:

1. Checks out the validated `stage` source
2. Builds optimized frontend and backend Production images
3. Pushes images with `prod-<short-commit-sha>` tags
4. Updates `kubernetes/prod` image references
5. Creates a GitHub Actions bot GitOps commit
6. Allows Argo CD to reconcile Production automatically

No separate manual deployment action is required after the production pull request is opened.

Verified Production workflow runs:

- Pull request `#4`: successful
- Pull request `#5`: successful

Latest verified Production version:

```text
prod-53f2c13
```

Latest verified Production GitOps bot commit:

```text
e5fec93
```

---

## Production GitOps Branch Decision

The Production Argo CD application tracks:

```yaml
targetRevision: stage
path: kubernetes/prod
```

This is an intentional implementation decision based on the assignment requirement that Production deployment occur as a consequence of a pull request being **opened**, rather than after the pull request is merged.

The `stage` branch represents the validated release candidate. When a pull request is opened against `prod`, the Production workflow builds from that validated source and commits the resulting immutable Production image references under `kubernetes/prod`. Argo CD observes that Git change and deploys it immediately. The pull request and subsequent merge still preserve the formal production promotion and release history in `prod`.

This design separates two concerns:

- The pull request against `prod` is the automatic release trigger and review record
- The GitOps manifest commit is the desired-state signal consumed by Argo CD

The approach was selected to satisfy the exact trigger timing while retaining an auditable relationship among the pull request, source commit, image tag, GitOps commit, and running workload.

---

## Containerization Strategy

### Frontend Development image

File:

```text
frontend/Dockerfile.dev
```

Characteristics:

- `NODE_ENV=development`
- Full dependency installation
- Runs the Next.js development server
- Binds to `0.0.0.0`
- Runs as the non-root `node` user

### Frontend Production image

File:

```text
frontend/Dockerfile.prod
```

Characteristics:

- Multi-stage build
- Builds optimized Next.js standalone output
- Copies only required runtime artifacts
- Uses a dedicated non-root `nextjs` user
- Runs `node server.js`

### Backend Development image

File:

```text
backend/Dockerfile.dev
```

Characteristics:

- `NODE_ENV=development`
- Full dependencies
- Prisma Client generation
- Runs the backend development command
- Runs as the non-root `node` user

### Backend Production image

File:

```text
backend/Dockerfile.prod
```

Characteristics:

- Multi-stage build
- Generates Prisma Client
- Compiles TypeScript into `dist`
- Prunes development dependencies
- Copies only required runtime artifacts
- Runs as the non-root `node` user
- Starts with `node dist/server.js`

---

## Image Versioning

Images are stored in GitHub Container Registry:

```text
ghcr.io/ebnulahsan/vitalsync-frontend
ghcr.io/ebnulahsan/vitalsync-backend
```

Tag pattern:

```text
<environment>-<7-character-commit-sha>
```

Examples:

```text
dev-a25768b
stage-3507d90
prod-53f2c13
```

The running image can therefore be mapped directly to its environment and source commit. The workflows also attach OCI labels for:

- Repository source URL
- Source revision
- Image version
- Deployment environment

No deployment depends only on a mutable `latest` tag.

---

## Kubernetes Delivery

Manifests are organized by environment:

```text
kubernetes/
├── dev/
│   ├── namespace.yaml
│   ├── postgres.yaml
│   ├── backend.yaml
│   └── frontend.yaml
├── stage/
│   ├── namespace.yaml
│   ├── postgres.yaml
│   ├── backend.yaml
│   └── frontend.yaml
└── prod/
    ├── namespace.yaml
    ├── postgres.yaml
    ├── backend.yaml
    └── frontend.yaml
```

### Namespaces

```text
vitalsync-dev
vitalsync-stage
vitalsync-prod
```

### Resources per environment

- PostgreSQL Deployment
- PostgreSQL ClusterIP Service
- Backend Deployment
- Backend Service
- Frontend Deployment
- Frontend Service

Only Kubernetes workload and networking resources required by the assignment are used. **No Ingress resource is implemented.**

### Production services

```text
postgres             ClusterIP   5432/TCP
vitalsync-backend    NodePort    5000:30052/TCP
vitalsync-frontend   NodePort    3000:30082/TCP
```

### Secrets

Each environment uses an independent Kubernetes Secret. Production uses:

```text
vitalsync-prod-secrets
```

Keys:

```text
database-url
jwt-access-secret
postgres-password
```

Secret values are created directly in the cluster and are not committed to Git.

---

## Argo CD GitOps

Application declarations:

```text
argocd/dev-application.yaml
argocd/stage-application.yaml
argocd/prod-application.yaml
```

Environment mapping:

```text
vitalsync-dev   -> dev branch   -> kubernetes/dev   -> vitalsync-dev
vitalsync-stage -> stage branch -> kubernetes/stage -> vitalsync-stage
vitalsync-prod  -> stage branch -> kubernetes/prod  -> vitalsync-prod
```

Each Argo CD Application enables:

```yaml
syncPolicy:
  automated:
    prune: true
    selfHeal: true
  syncOptions:
    - CreateNamespace=true
```

- **Automated sync** reconciles Git changes without direct workload mutation
- **Prune** removes resources deleted from the desired state
- **Self-heal** corrects cluster drift
- **CreateNamespace** permits environment namespace creation when needed

Argo CD is the system responsible for reconciling the declared Git state with the running Kubernetes cluster.

---

## AWS and Runtime Environment

The demonstration environment runs on an AWS EC2 instance using K3s.

Verified infrastructure:

```text
Instance ID: i-084adc2b98585d54e
Region: ap-southeast-1
K3s node role: control-plane
K3s status: Ready
Kubernetes version: v1.36.4+k3s1
```

At the time of demonstration, the application was reachable through:

```text
Production frontend: http://47.129.153.103:30082
Production backend:  http://47.129.153.103:30052
Health endpoint:     http://47.129.153.103:30052/health
```

> The public IP is part of a temporary assignment environment and may become unavailable after the EC2 instance is stopped, restarted, or removed.

AWS Security Group access to the application NodePorts was restricted to the tester's public IPv4 address using `/32` rules during verification.

---

## Verified Production State

Argo CD:

```text
NAME             SYNC STATUS   HEALTH STATUS
vitalsync-prod   Synced        Healthy
```

Kubernetes workloads:

```text
postgres             1/1   Running   0 restarts
vitalsync-backend    1/1   Running   0 restarts
vitalsync-frontend   1/1   Running   0 restarts
```

Runtime application images:

```text
ghcr.io/ebnulahsan/vitalsync-backend:prod-53f2c13
ghcr.io/ebnulahsan/vitalsync-frontend:prod-53f2c13
```

Backend health response:

```json
{
  "success": true,
  "status": "healthy"
}
```

Functional checks completed:

- Production frontend returned HTTP `200 OK`
- Production backend health endpoint returned HTTP `200 OK`
- User registration succeeded
- User login succeeded
- Authenticated dashboard loaded successfully
- PostgreSQL, backend, and frontend remained Ready with zero restarts during final verification

---

## Repository Structure

```text
.
├── .github/
│   └── workflows/
│       ├── ci.yml
│       ├── publish-dev-images.yml
│       ├── publish-stage-images.yml
│       └── deploy-prod-on-pr.yml
├── argocd/
│   ├── dev-application.yaml
│   ├── stage-application.yaml
│   └── prod-application.yaml
├── backend/
│   ├── Dockerfile.dev
│   ├── Dockerfile.prod
│   ├── prisma/
│   └── src/
├── frontend/
│   ├── Dockerfile.dev
│   ├── Dockerfile.prod
│   ├── app/
│   └── public/
├── kubernetes/
│   ├── dev/
│   ├── stage/
│   └── prod/
└── README.md
```

---

## Reproducing the Delivery Flow

### 1. Validate a change

Push a change or open a pull request involving `dev`, `stage`, or `prod`. The `VitalSync CI` workflow validates frontend, backend, and Docker builds.

### 2. Deploy Development manually

From GitHub Actions:

```text
Actions -> Publish Development Images -> Run workflow
```

The workflow publishes `dev-<sha>` images and updates `kubernetes/dev`.

### 3. Deploy Staging manually

After promoting validated code to `stage`:

```text
Actions -> Publish Staging Images -> Run workflow
```

The workflow publishes `stage-<sha>` images and updates `kubernetes/stage`.

### 4. Deploy Production automatically

Open a pull request with:

```text
base: prod
compare: stage
```

Opening the pull request automatically runs `Deploy Production on PR`, publishes `prod-<sha>` images, updates `kubernetes/prod`, and causes Argo CD to reconcile Production.

---

## Useful Verification Commands

Run these commands from a host with cluster access.

### Argo CD applications

```bash
kubectl get applications -n argocd
```

### Production pods and services

```bash
kubectl get pods -n vitalsync-prod
kubectl get services -n vitalsync-prod
```

### Production runtime images

```bash
kubectl get deployment vitalsync-backend vitalsync-frontend \
  -n vitalsync-prod \
  -o jsonpath='{range .items[*]}{.metadata.name}{" => "}{.spec.template.spec.containers[0].image}{"\n"}{end}'
```

### Backend health

```bash
curl -i http://localhost:30052/health
```

### Verify that no Ingress manifests exist

```bash
grep -R "kind: Ingress" kubernetes || true
```

---

## Evidence Checklist

The following evidence is appropriate for assignment review:

- GitHub branch list showing `dev`, `stage`, and `prod`
- Successful `VitalSync CI` workflow with frontend, backend, and Docker jobs
- Manually triggered Development workflow success
- Manually triggered Staging workflow success
- Automatically triggered Production workflow from a pull request opened against `prod`
- GHCR or runtime evidence showing commit-identifiable image tags
- Kubernetes resource inventory showing Deployments and Services without Ingress
- Argo CD applications showing Development, Staging, and Production as `Synced` and `Healthy`
- Production pods showing `1/1 Running` and zero restarts
- Production Services showing NodePorts `30052` and `30082`
- Backend `/health` response showing HTTP `200 OK`
- Production dashboard visible in a browser
- AWS EC2 and K3s node evidence

---

## Engineering Decisions Summary

### Why use VitalSync instead of the reference chat application?

The delivery requirements are application-independent. VitalSync provides a more realistic full-stack workload with authentication, a database, migrations, health checks, and an authenticated dashboard. This provides stronger evidence that the delivery platform works beyond a minimal demo.

### Why are Development and Staging deployments manual?

The assignment requires a human decision before code reaches these running environments. `workflow_dispatch` provides an explicit, auditable action in GitHub Actions while preserving automated build, publication, manifest update, and GitOps reconciliation after approval.

### Why does Production deploy on PR open?

The production workflow listens specifically for `pull_request` events targeting `prod` with type `opened`. This directly implements the required behavior and avoids a separate manual production deployment action.

### Why use commit SHA image tags?

A tag such as `prod-53f2c13` identifies both the environment and the exact source revision. This supports traceability, incident investigation, repeatable rollbacks, and auditability months after deployment.

### Why use separate Dev and Prod Dockerfiles?

Development images prioritize rapid iteration and development commands. Production images prioritize optimized builds, minimal runtime artifacts, pruned dependencies, and non-root execution.

### Why use NodePort instead of Ingress?

Ingress was explicitly out of scope. NodePort Services provide adequate network exposure for the assignment demonstration while remaining within the required Kubernetes resource model.

### Why use Argo CD automated sync after manual Dev and Stage approval?

The human decision controls whether an image is published and whether Git desired state changes. After that decision, Argo CD automatically reconciles the approved Git state. This preserves both the manual environment gate and the GitOps requirement.

---

## Security Considerations

- Application containers run as non-root users
- Kubernetes Secret values are not committed to Git
- Development, Staging, and Production use isolated namespaces and Secrets
- GitHub Actions uses the short-lived repository `GITHUB_TOKEN`
- Workflow permissions are limited to the access required by each workflow
- GHCR image references are versioned and auditable
- Production dependencies are pruned from the backend runtime image
- AWS NodePort access was restricted to a specific tester IPv4 address during demonstration

For a longer-lived production system, additional controls would include TLS, a managed load balancer, External Secrets, persistent managed PostgreSQL, image vulnerability scanning, network policies, monitoring, alerting, backups, and formal protected-branch review policies.

---

## Current Status

**Required technical delivery is complete and verified.**

The project has demonstrated a real end-to-end change path through Development, Staging, and Production under the required manual and automatic trigger rules, with versioned images, Kubernetes delivery, and Argo CD reconciliation.
