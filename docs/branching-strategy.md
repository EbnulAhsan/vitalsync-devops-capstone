# Branching and Environment Promotion Strategy

VitalSync uses three long-lived environment branches:

- dev: Development integration branch and default pull request target.
- stage: Staging release-candidate branch.
- prod: Production release branch.

## Promotion Flow

feature/* -> dev -> stage -> prod

## Deployment Controls

- Changes reaching dev do not deploy automatically. Development deployment requires a manually triggered workflow.
- Changes reaching stage do not deploy automatically. Staging deployment requires a manually triggered workflow.
- Opening a pull request against prod automatically triggers the production delivery workflow.
- Production deployment does not require a separate manual deployment action.

## Merge Strategy

- Application changes are developed in short-lived feature branches.
- Feature branches are merged into dev through pull requests.
- Validated changes are promoted from dev to stage through pull requests.
- Release candidates are promoted from stage toward prod through pull requests.
- Direct application changes to stage and prod are discouraged.
- Pull request history provides an auditable promotion trail.

## Environment Mapping

- dev branch maps to the Development Kubernetes environment.
- stage branch maps to the Staging Kubernetes environment.
- prod branch maps to the Production Kubernetes environment.

## GitOps Responsibility

CI/CD workflows build and publish versioned Docker images and update the environment-specific desired state stored in Git. Argo CD reconciles that desired state into the AWS-hosted Kubernetes cluster.
