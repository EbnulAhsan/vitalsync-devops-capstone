# 🌿 VitalSync Frontend

> **A modern, animated, full-stack health tracking dashboard built with Next.js, TypeScript, Tailwind CSS, Framer Motion, and JWT authentication.**

VitalSync is a sleek and responsive health tracker frontend that helps users monitor their **BMI**, **water intake**, **sleep**, **weight**, **profile**, and **health goals** from one beautiful dashboard.

This frontend connects with the **VitalSync Backend API** and provides a smooth, modern, glassmorphism-inspired user experience with animations and protected routes.

---

## ✨ Project Preview

🚧 **Live Demo Coming Soon**

```txt
Frontend: Next.js + TypeScript + Tailwind CSS
Backend: Node.js + Express + Prisma + PostgreSQL
Authentication: JWT
Animation: Framer Motion
```

---

## 🔗 Related Repository

### 🧠 Backend API

👉 [VitalSync Backend](https://github.com/EbnulAhsan/Vitalsync-backend)

---

## 🚀 Features

### 🔐 Authentication

- 📝 User registration
- 🔑 User login
- 🛡️ JWT-based protected dashboard
- 💾 Token stored in `localStorage`
- 🚪 Logout functionality

---

### 📊 Dashboard Overview

The dashboard shows a quick summary of the user’s health data:

- 👤 User profile info
- 🧮 Latest BMI
- 💧 Today’s water intake
- 🌙 Today’s sleep duration
- ⚖️ Latest weight
- 🎯 Active goals count

---

### 👤 Profile Management

Users can view and update personal health profile information:

- Full name
- Gender
- Date of birth
- Height
- Activity level

---

### 🧮 BMI Tracker

- Calculate BMI using weight and height
- Show BMI category
- View latest BMI result
- View BMI history
- Auto-sync with backend data

---

### 💧 Water Tracker

- Add custom water intake
- Quick-add water buttons
- Track today’s total water
- Animated progress bar
- Water intake history

---

### 🌙 Sleep Tracker

- Add sleep duration
- Add sleep quality
- Quick-add common sleep durations
- Track today’s sleep total
- Animated sleep goal progress
- Sleep history list

---

### ⚖️ Weight Tracker

- Add weight records
- Add optional notes
- View latest weight
- Track weight changes
- View weight history

---

### 🎯 Goals Tracker

Users can create and manage health goals for:

- 💧 Water
- 🌙 Sleep
- ⚖️ Weight
- 🔥 Calories

Goal features:

- Create goals
- View all goals
- Mark goals as completed
- Delete goals
- View progress bar

---

## 🛠️ Tech Stack

### Frontend

- ⚡ **Next.js**
- ⚛️ **React**
- 🟦 **TypeScript**
- 🎨 **Tailwind CSS**
- 🎞️ **Framer Motion**
- 🌐 **Axios**
- 🎯 **Lucide React Icons**

### Backend Integration

- 🔐 JWT Authentication
- 📡 REST API integration
- 🌍 Environment-based API URL
- 🧩 Protected dashboard routes

---

## 📁 Project Structure

```txt
vitalsync-frontend
├─ app
│  ├─ auth
│  │  ├─ login
│  │  │  └─ page.tsx
│  │  └─ register
│  │     └─ page.tsx
│  ├─ bmi
│  │  └─ page.tsx
│  ├─ dashboard
│  │  └─ page.tsx
│  ├─ goals
│  │  └─ page.tsx
│  ├─ profile
│  │  └─ page.tsx
│  ├─ sleep
│  │  └─ page.tsx
│  ├─ water
│  │  └─ page.tsx
│  ├─ weight
│  │  └─ page.tsx
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx
│
├─ components
│  └─ dashboard
│     └─ DashboardShell.tsx
│
├─ lib
│  └─ api.ts
│
├─ public
├─ .env.local
├─ package.json
├─ tsconfig.json
└─ README.md
```

---

## ⚙️ Getting Started

### 1️⃣ Clone the repository

```bash
git clone https://github.com/EbnulAhsan/Vitalsync-frontend.git
cd Vitalsync-frontend
```

---

### 2️⃣ Install dependencies

```bash
npm install
```

---

### 3️⃣ Create environment file

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

> ⚠️ Make sure the VitalSync backend server is running on port `5000`.

---

### 4️⃣ Run development server

```bash
npm run dev
```

Open the application:

```txt
http://localhost:3000
```

---

## 📜 Available Scripts

### ▶️ Start development server

```bash
npm run dev
```

### 🏗️ Build production version

```bash
npm run build
