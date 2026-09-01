# 🧠 VitalSync Backend

> **A secure, scalable, modular health tracking REST API built with Node.js, Express.js, TypeScript, Prisma ORM, PostgreSQL, JWT Authentication, Zod Validation, and clean backend architecture.**

VitalSync Backend powers the VitalSync full-stack health tracking application.  
It provides secure APIs for user authentication, profile management, BMI tracking, water intake, sleep tracking, weight tracking, goals management, and dashboard health summaries.

This backend is designed with a clean modular structure, service layer, controller layer, Prisma database integration, JWT protected routes, global error handling, and request validation.

---

## 🌿 About VitalSync

**VitalSync** is a modern health tracking application where users can monitor their daily wellness data from one place.

Users can track:

- 🧮 BMI
- 💧 Water intake
- 🌙 Sleep duration
- ⚖️ Weight changes
- 🎯 Health goals
- 👤 Profile information
- 📊 Dashboard health summary

---

## 🚀 Backend Features

### 🔐 Authentication Module

- User registration
- User login
- Password hashing with bcrypt
- JWT access token generation
- Protected route authentication
- Secure token-based API access

---

### 👤 Profile Module

- Get logged-in user profile
- Update profile information
- Supports:
  - Full name
  - Gender
  - Date of birth
  - Height
  - Activity level
  - Avatar URL

---

### 🧮 BMI Module

- Calculate BMI from height and weight
- Auto-detect BMI category
- Save BMI records
- Get BMI history
- Auto-save related weight history

BMI categories:

- UNDERWEIGHT
- NORMAL
- OVERWEIGHT
- OBESE

---

### 💧 Water Tracker Module

- Add water intake
- Get today's water total
- Get water intake history
- Calculate total water in ml and liters

---

### 🌙 Sleep Tracker Module

- Add sleep duration
- Add sleep quality
- Get today's sleep total
- Get sleep history
- Convert sleep minutes into hours

---

### ⚖️ Weight Tracker Module

- Add weight records
- Add optional notes
- Get latest weight
- Get weight history

---

### 🎯 Goals Module

Users can create and manage health goals for:

- WATER
- SLEEP
- WEIGHT
- CALORIES

Goal operations:

- Create goal
- Get all goals
- Get single goal
- Update goal
- Complete goal
- Delete goal

Goal status:

- ACTIVE
- COMPLETED
- FAILED

---

### 📊 Dashboard Summary Module

Single API endpoint that returns a complete health overview:

- User profile
- Latest BMI
- Latest weight
- Today's water intake
- Today's sleep duration
- Active goals

---

## 🛠️ Tech Stack

### Backend Core

- 🟩 **Node.js**
- 🚀 **Express.js**
- 🟦 **TypeScript**
- 🧬 **Prisma ORM**
- 🐘 **PostgreSQL**

### Security & Validation

- 🔐 **JWT Authentication**
- 🔒 **bcryptjs Password Hashing**
- ✅ **Zod Request Validation**
- 🛡️ **Protected Route Middleware**

### Backend Architecture

- Modular folder structure
- Controller layer
- Service layer
- Route layer
- Global error handler
- Custom AppError class
- catchAsync utility
- Prisma database client
- Clean API response format

### DevOps & Infrastructure

- 🐳 **Docker & Docker Compose**
- ☁️ **AWS EC2 (Ubuntu 24.04)**
- 🌐 **Nginx Reverse Proxy**
- 🔧 **Jenkins CI/CD**
- 🔔 **GitHub Webhooks**

---

## 📁 Project Structure

```txt
vitalsync-backend
├─ prisma
│  ├─ migrations
│  └─ schema.prisma
│
├─ src
│  ├─ config
│  │  └─ prisma.ts
│  │
│  ├─ error
│  │  └─ AppError.ts
│  │
│  ├─ middlewares
│  │  ├─ auth.middleware.ts
│  │  ├─ globalErrorHandler.ts
│  │  ├─ notFound.ts
│  │  └─ validateRequest.ts
│  │
│  ├─ modules
│  │  ├─ auth
│  │  │  ├─ auth.controller.ts
│  │  │  ├─ auth.route.ts
│  │  │  ├─ auth.service.ts
│  │  │  └─ auth.validation.ts
│  │  │
│  │  ├─ profile
│  │  │  ├─ profile.controller.ts
│  │  │  ├─ profile.route.ts
│  │  │  ├─ profile.service.ts
│  │  │  └─ profile.validation.ts
│  │  │
│  │  ├─ bmi
│  │  │  ├─ bmi.controller.ts
│  │  │  ├─ bmi.route.ts
│  │  │  ├─ bmi.service.ts
│  │  │  └─ bmi.validation.ts
│  │  │
│  │  ├─ water
│  │  ├─ sleep
│  │  ├─ weight
│  │  ├─ goals
│  │  └─ dashboard
│  │
│  ├─ utils
│  │  └─ catchAsync.ts
│  │
│  ├─ app.ts
│  └─ server.ts
│
├─ .env
├─ .gitignore
├─ Dockerfile
├─ docker-compose.yml
├─ Jenkinsfile
├─ package.json
├─ tsconfig.json
└─ README.md
```

---

## ⚙️ Getting Started

### 1️⃣ Clone the repository

```bash
git clone https://github.com/EbnulAhsan/Vitalsync-backend.git
cd Vitalsync-backend
```

---

### 2️⃣ Install dependencies

```bash
npm install
```

---

### 3️⃣ Create environment file

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/vitalsync_db?schema=public"

PORT=5000
NODE_ENV=development
CLIENT_URL="http://localhost:3000"

JWT_ACCESS_SECRET="your_access_secret"
JWT_REFRESH_SECRET="your_refresh_secret"
```

> ⚠️ Replace `YOUR_PASSWORD` with your local PostgreSQL password.

---

### 4️⃣ Create PostgreSQL database

Create a database named:

```txt
vitalsync_db
```

Using SQL:

```sql
CREATE DATABASE vitalsync_db;
```

---

### 5️⃣ Generate Prisma Client

```bash
npx prisma generate
```

---

### 6️⃣ Run database migration

```bash
npx prisma migrate dev --name init
```

---

### 7️⃣ Start development server

```bash
npm run dev
```

Server should run on:

```txt
http://localhost:5000
```

---

## ✅ Health Check

```http
GET /
```

Response:

```json
{
  "success": true,
  "message": "VitalSync Backend API is running 🚀"
}
```

---

```http
GET /health
```

Response:

```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2026-07-01T00:00:00.000Z"
}
```

---

## 🔐 Authentication APIs

### Register

```http
POST /api/v1/auth/register
```

Body:

```json
{
  "fullName": "MD. Ebnul Ahsan",
  "email": "ebnul@example.com",
  "password": "123456"
}
```

---

### Login

```http
POST /api/v1/auth/login
```

Body:

```json
{
  "email": "ebnul@example.com",
  "password": "123456"
}
```

Response includes:

```json
{
  "accessToken": "JWT_TOKEN"
}
```

---

## 🛡️ Protected Routes

For protected routes, send token in header:

```txt
Authorization: Bearer YOUR_ACCESS_TOKEN
```

---

## 👤 Profile APIs

```http
GET /api/v1/profile/me
PATCH /api/v1/profile/me
```

Update profile body example:

```json
{
  "fullName": "MD. Ebnul Ahsan",
  "gender": "MALE",
  "dateOfBirth": "2000-01-01",
  "heightCm": 170,
  "activityLevel": "MODERATE"
}
```

---

## 🧮 BMI APIs

```http
POST /api/v1/bmi/calculate
GET  /api/v1/bmi/history
```

Calculate BMI body:

```json
{
  "weightKg": 70,
  "heightCm": 170
}
```

Example response:

```json
{
  "bmiValue": 24.22,
  "category": "NORMAL"
}
```

---

## 💧 Water APIs

```http
POST /api/v1/water/add
GET  /api/v1/water/today
GET  /api/v1/water/history
```

Add water body:

```json
{
  "amountMl": 250
}
```

---

## 🌙 Sleep APIs

```http
POST /api/v1/sleep/add
GET  /api/v1/sleep/today
GET  /api/v1/sleep/history
```

Add sleep body:

```json
{
  "durationMins": 420,
  "quality": "GOOD"
}
```

---

## ⚖️ Weight APIs

```http
POST /api/v1/weight/add
GET  /api/v1/weight/latest
GET  /api/v1/weight/history
```

Add weight body:

```json
{
  "weightKg": 69.5,
  "note": "Morning weight"
}
```

---

## 🎯 Goals APIs

```http
POST   /api/v1/goals
GET    /api/v1/goals
GET    /api/v1/goals/:id
PATCH  /api/v1/goals/:id
DELETE /api/v1/goals/:id
```

Create goal body:

```json
{
  "type": "WATER",
  "targetValue": 2500,
  "currentValue": 500,
  "deadline": "2026-07-10"
}
```

Update goal body:

```json
{
  "currentValue": 1200,
  "status": "ACTIVE"
}
```

Complete goal body:

```json
{
  "status": "COMPLETED"
}
```

---

## 📊 Dashboard API

```http
GET /api/v1/dashboard/summary
```

Returns:

- User profile
- Latest BMI
- Latest weight
- Today's water total
- Today's sleep total
- Active goals

---

## 🧪 Validation

VitalSync backend uses **Zod validation** for request body validation.

Example invalid response:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "path": "body.email",
      "message": "Invalid email address"
    }
  ]
}
```

---

## 🧯 Error Handling

The backend includes centralized error handling using:

- `AppError`
- `catchAsync`
- `globalErrorHandler`
- `notFound` middleware

Example error response:

```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

## 🗄️ Database Models

Main Prisma models:

- User
- Profile
- BMIRecord
- WeightHistory
- WaterHistory
- SleepHistory
- Goal
- ActivityLog
- RefreshToken
- Notification
- Session

---

## 🧰 Useful Prisma Commands

### Generate client

```bash
npx prisma generate
```

### Run migration

```bash
npx prisma migrate dev --name init
```

### Open Prisma Studio

```bash
npx prisma studio
```

### Reset database

```bash
npx prisma migrate reset
```

---

## 📜 Available Scripts

### Run development server

```bash
npm run dev
```

### Build project

```bash
npm run build
```

### Start production server

```bash
npm run start
```

### Prisma generate

```bash
npm run prisma:generate
```

### Prisma studio

```bash
npm run prisma:studio
```

---

## 🔐 Environment Variables

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/vitalsync_db?schema=public"

PORT=5000
NODE_ENV=development
CLIENT_URL="http://localhost:3000"

JWT_ACCESS_SECRET="your_access_secret"
JWT_REFRESH_SECRET="your_refresh_secret"
```

> 🚫 Never commit `.env` to GitHub.

---

## ✅ Final Tested Backend Flow

- ✅ Server running
- ✅ PostgreSQL connected
- ✅ Prisma migration completed
- ✅ Register API working
- ✅ Login API working
- ✅ JWT protected routes working
- ✅ Profile update working
- ✅ BMI calculate/history working
- ✅ Water tracker working
- ✅ Sleep tracker working
- ✅ Weight tracker working
- ✅ Goals CRUD working
- ✅ Dashboard summary working
- ✅ Zod validation working
- ✅ Global error handler working
- ✅ Production build ready

---

## 🚀 DevOps & Deployment

VitalSync is fully containerized and deployed with a production-style CI/CD pipeline on AWS — covering Dockerization, reverse proxy routing, and automated build-and-deploy on every push.

### 🐳 Dockerization

The backend is fully containerized using Docker.

**Features:**

- Node.js 22 Alpine base image
- Optimized production build
- TypeScript compilation at build time
- Lightweight, isolated runtime environment

**Build the image:**

```bash
docker build -t vitalsync-backend .
```

**Run the container:**

```bash
docker run -d \
  --name vitalsync-backend \
  -p 5000:5000 \
  vitalsync-backend
```

---

### 🐙 Docker Compose

Docker Compose handles multi-container orchestration for local and production environments.

**Services:**

| Service | Description |
|---|---|
| `backend` | Node.js / Express API |
| `postgres` | PostgreSQL database |

**Start all services:**

```bash
docker-compose up -d
```

**Stop all services:**

```bash
docker-compose down
```

**Check running containers:**

```bash
docker ps
```

---

### ☁️ AWS EC2 Deployment

VitalSync is deployed on an AWS EC2 Ubuntu server.

**Infrastructure stack:**

```txt
AWS EC2 (Ubuntu 24.04)
├─ Docker
├─ Docker Compose
├─ Nginx
├─ Jenkins
└─ PostgreSQL
```

**Application access:**

| Endpoint | URL |
|---|---|
| Frontend | `http://SERVER_IP` |
| Backend | `http://SERVER_IP/api` |
| Health Check | `http://SERVER_IP/api/health` |

---

### 🌐 Nginx Reverse Proxy

Nginx sits in front of the stack as a single entry point, routing traffic to the correct service.

**Routing strategy:**

```txt
/       → Frontend (Next.js)
/api    → Backend (Node.js)
```

**Benefits:**

- Single public entry point
- Clean, consistent URL structure
- Reverse proxy isolation between services
- Production-ready request routing

---

### 🔄 CI/CD Pipeline

Continuous Integration and Deployment is implemented with **Jenkins** and **GitHub Webhooks**.

**Pipeline flow:**

```txt
Developer Push
   ↓
GitHub Repository
   ↓
GitHub Webhook
   ↓
Jenkins Pipeline
   ↓
Docker Image Build
   ↓
Automatic Deployment
```

#### 🔧 Jenkins Setup

Jenkins runs inside its own Docker container.

```bash
docker run -d \
  --name jenkins \
  -p 8080:8080 \
  -p 50000:50000 \
  jenkins/jenkins:lts-jdk21
```

Jenkins dashboard: `http://SERVER_IP:8080`

#### 🔔 GitHub Webhook Integration

| Setting | Value |
|---|---|
| Webhook URL | `http://SERVER_IP:8080/github-webhook/` |
| Trigger | Push events |

Every push to GitHub automatically triggers the Jenkins pipeline — no manual deployment needed.

#### 🧾 Jenkinsfile Pipeline Stages

- **Build Stage** — Build Docker image
- **Deploy Stage** — Stop old container, deploy new container

**Automated deployment flow:**

```txt
Code Push
   ↓
Webhook Trigger
   ↓
Jenkins Build
   ↓
Docker Build
   ↓
Deploy New Container
```

---

### 📊 Deployment Verification

**Check running containers:**

```bash
docker ps
```

Expected containers:

```txt
jenkins
vitalsync-postgres
vitalsync-backend
vitalsync-frontend
vitalsync-backend-auto
```

**Backend health check:**

```bash
curl http://localhost:5000/health
```

**Auto-deployed backend health check:**

```bash
curl http://localhost:5001/health
```

**Expected response:**

```json
{
  "success": true,
  "status": "healthy"
}
```

---

### ✅ DevOps Deliverables Completed

**Infrastructure**

- ✅ AWS EC2 server provisioned
- ✅ Ubuntu server configuration
- ✅ Docker installation
- ✅ Docker Compose setup
- ✅ Nginx reverse proxy

**Containerization**

- ✅ Backend Dockerization
- ✅ PostgreSQL containerization
- ✅ Multi-container deployment

**CI/CD**

- ✅ Jenkins setup
- ✅ GitHub integration
- ✅ Jenkinsfile pipeline
- ✅ GitHub webhook
- ✅ Automatic build trigger
- ✅ Docker build automation
- ✅ Automatic deployment pipeline

**Verification**

- ✅ Frontend live
- ✅ Backend live
- ✅ Health check endpoint working
- ✅ Docker containers running
- ✅ Jenkins pipeline successful

### 🏆 DevOps Achievements

This project demonstrates a complete production-style DevOps workflow:

- AWS EC2 deployment
- Docker containerization
- Docker Compose orchestration
- Nginx reverse proxy
- Jenkins automation
- GitHub webhook integration
- Continuous Integration (CI)
- Continuous Deployment (CD)
- Production-style infrastructure

---

## 🌐 Frontend Repository

👉 [VitalSync Frontend](https://github.com/EbnulAhsan/)

---

## 🚧 Future Improvements

- 🔁 Refresh token rotation
- 📧 Email verification
- 🔑 Forgot password
- 🧑‍💼 Role-based access control
- 📝 API documentation with Swagger
- 🔔 Notification/reminder system
- 📊 Advanced analytics APIs
- 🧪 Unit and integration tests
- ☸️ Kubernetes deployment

---

## 👨‍💻 Author

### **MD. Ebnul Ahsan**

Full-stack project built with focus on:

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- Next.js
- REST API architecture
- Authentication and authorization
- Clean backend structure
- DevOps & CI/CD automation

GitHub:  
👉 [EbnulAhsan](https://github.com/EbnulAhsan/)

---

## ⭐ Support

If this project helped you or inspired you, feel free to give it a ⭐ on GitHub.

---

## 📄 License

This project is open-source and available for learning, portfolio, and development purposes.

---

## 🌿 VitalSync

> **Track better. Live healthier. Stay synced.**
