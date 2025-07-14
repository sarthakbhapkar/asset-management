## 📦 Project: Asset Management System

This is a role-based **Asset Management** system focused on backend development using **Node.js**, designed for two user roles: **Admin** and **Employee**.

### 🛠 Tech Stack

- **Backend**: Node.js (Express)
- **Frontend**: Plain HTML, CSS, JavaScript
- **Database**: PostgreSQL
- **Authentication**: JWT-based authentication
- **Authorization**: Role-based access control
- **Email Service**: Mail-based OTP system for password reset
- **Containerization**: Dockerized setup for consistent deployment

### 🔐 Features

- **Admin Role**:
  - Manage all assets and their assignments
  - Create and manage employee profiles
  - Track asset usage and history
  - Handle asset returns and issues

- **Employee Role**:
  - View assigned assets
  - Request new assets or return existing ones
  - Change password using secure OTP-based email flow

- **Authentication and Security**:
  - JWT-based secure login system
  - OTP verification for password reset via email
  - Role-based authorization for protected routes

- **RESTful APIs**:
  - Clean, modular, and scalable API architecture
  - Routes separated by role and responsibility

- **Dockerized**:
  - Easy to deploy with `Dockerfile` and `docker-compose.yml`
  - Isolated services for backend and PostgreSQL

### 🐳 Docker Usage

```bash
# Build and run containers
docker-compose up --build

# Stop containers
docker-compose down
