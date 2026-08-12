# 🏋️ FitForge - Premium SaaS Gym & Fitness Management Platform

FitForge is a modern, full-stack **SaaS Gym Management Application** built with React, Vite, Node.js, Express, and MongoDB. It features role-based access control for **Admins**, **Trainers**, and **Members**, complete with workout tracking, membership plan management, attendance statistics, body progress analytics, and billing receipts.

---

## 🌟 Key Features

### 👑 Admin Portal
- **Dashboard Overview**: Revenue analytics, member counts, active trainers, and quick metrics.
- **Member Management**: Register new members, assign membership plans, assign personal trainers, edit/delete members.
- **Trainer Management**: Manage fitness trainers and assigned member rosters.
- **Membership Plans**: Create, edit, and delete gym plans with pricing and duration.
- **Attendance & Payments**: Log attendance and manage billing receipts.

### 🏋️ Trainer Workspace
- **Roster Overview**: View all assigned gym members.
- **Workout Plan Builder**: Create and assign custom workout schedules with daily exercises, sets, reps, and target focus areas.
- **Progress Tracking**: Monitor body weight, body fat %, chest, waist, and arm measurements of assigned members.

### 👤 Member Portal
- **Fitness Dashboard**: Quick stats on active plan, days remaining, monthly attendance count, and latest body measurements.
- **Workout Schedule**: View daily exercises curated by personal trainers.
- **Attendance History**: Check-in history and monthly attendance percentage.
- **Progress Analytics**: Log weight, body fat, and body measurements over time.
- **Membership & Billing**: View active plan details, explore upgrade options, and download invoices.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, React Router DOM, TailwindCSS, Lucide Icons, React Hot Toast
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), MongoMemoryServer fallback, JWT Authentication, bcryptjs
- **Database**: Local MongoDB / In-Memory MongoMemoryServer (Zero setup required)

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/FitForge.git
cd FitForge
```

### 2. Install Dependencies

#### Backend Setup
```bash
cd backend
npm install
```

#### Frontend Setup
```bash
cd ../frontend
npm install
```

### 3. Running the Project

#### Start Backend Server
```bash
cd backend
npm run dev
```
*Backend runs on `http://localhost:5000` with automatic DB seeding.*

#### Start Frontend Client
```bash
cd frontend
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 🔑 Demo Account Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@gym.com` | `Admin@123` |
| **Trainer** | `trainer@gym.com` | `Trainer@123` |
| **Member** | `member@gym.com` | `Member@123` |

---

## 📄 License
This project is licensed under the MIT License.
