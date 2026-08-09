# Mini ERP CRM — Operations Portal

A full-stack ERP + CRM system for wholesale and distribution businesses,
built to manage customers, leads, products, inventory, and orders from a
single unified workspace.

## 🌐 Live Demo

**Frontend:**
[https://mini-erp-crm-lime.vercel.app](https://mini-erp-crm-lime.vercel.app)

**Backend API:**
[https://mini-erp-crm-izul.onrender.com](https://mini-erp-crm-izul.onrender.com)

---

## 📌 Overview

Mini ERP CRM is a full-stack business operations portal designed to centralize common ERP and CRM workflows.

The application provides a unified interface for:

- Customer management
- Lead management
- Product management
- Inventory management
- Order management
- Authentication and authorization
- Role-based access
- PostgreSQL database persistence
- Production deployment

The frontend is deployed on **Vercel**, while the backend and PostgreSQL database are hosted on **Render**.

---

## ✨ Features

### 🔐 Authentication
- User registration
- User login
- JWT-based authentication
- Password-based authentication
- Protected application functionality
- Role selection and role-based access

### 👥 Customer Management
- Create and manage customers
- View customer information
- Update customer records
- Delete customer records
- Manage customer-related business information

### 🎯 Lead Management
- Create and manage leads
- Track lead information
- Update lead records
- Delete lead records
- Support CRM-style lead management

### 📦 Product Management
- Add products
- View products
- Update product information
- Delete products
- Manage product details and pricing

### 📊 Inventory Management
- Track available stock
- Manage inventory quantities
- Connect inventory with products
- Support operational stock management

### 🧾 Order Management
- Create orders
- View orders
- Manage order information
- Connect orders with customers and products
- Support basic order workflow

### 🛡️ Security
- JWT authentication
- Protected backend routes
- Role-based access control
- Password handling
- Environment variables for secrets
- Database credentials excluded from GitHub

---

## 🏗️ Technology Stack

### Frontend
- React
- TypeScript
- Vite
- CSS

### Backend
- Node.js
- Express
- TypeScript
- JWT

### Database
- PostgreSQL
- Prisma ORM

### Deployment
- Vercel — Frontend
- Render — Backend
- Render PostgreSQL — Database

### Version Control
- Git
- GitHub

---

## 📁 Project Structure

```
mini-erp-crm/
│
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   │
│   ├── src/
│   │   └── ...
│   │
│   ├── prisma.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── Customers.tsx
│   │   ├── dashboard.tsx
│   │   ├── Leads.tsx
│   │   ├── Login.tsx
│   │   ├── Orders.tsx
│   │   ├── Products.tsx
│   │   └── ...
│   │
│   ├── package.json
│   └── ...
│
├── README.md
└── .gitignore
```

> The structure above highlights the main application files. Additional generated and configuration files may exist inside the project.

---

## 🔄 Application Architecture

```
┌───────────────────┐
│       User        │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│  Vercel Frontend  │
│ React + TypeScript│
└─────────┬─────────┘
          │
          │ HTTPS API
          ▼
┌───────────────────┐
│  Render Backend   │
│ Node.js + Express │
└─────────┬─────────┘
          │
          │ Prisma
          ▼
┌───────────────────┐
│ Render PostgreSQL │
└───────────────────┘
```

---

## 🔗 Production API

The deployed frontend communicates with the production backend:

```
https://mini-erp-crm-izul.onrender.com
```

The local development backend uses:

```
http://localhost:5000
```

> Production should never depend on localhost.

---

## ⚙️ Environment Variables

Sensitive configuration is not committed to GitHub.

### Backend

Create a `.env` file inside `backend/` for local development:

```env
DATABASE_URL="your-postgresql-database-url"
JWT_SECRET="your-jwt-secret"
```

### Production

Production environment variables are configured through Render.

Required backend variables:

```
DATABASE_URL
JWT_SECRET
```

---

## 🚀 Local Development

### 1. Clone the repository

```bash
git clone https://github.com/Atpdevil/mini-erp-crm.git
cd mini-erp-crm
```

### 2. Backend setup

```bash
cd backend
npm install
```

Generate the Prisma client:

```bash
npx prisma generate
```

Configure the required environment variables in `.env`.

Start the backend:

```bash
npm run dev
```

The local backend runs on:

```
http://localhost:5000
```

### 3. Frontend setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local frontend URL shown by Vite.

---

## 🗄️ Database

The project uses **PostgreSQL** with **Prisma ORM**.

Prisma is responsible for:

- Database schema management
- Database access
- Prisma Client generation
- Application data operations

The production database is hosted on **Render**.

---

## 🔒 Security

Security considerations implemented in the project include:

- JWT-based authentication
- Protected backend functionality
- Role-based access
- Secure environment variable handling
- Database credentials excluded from source control
- `.env` files excluded through `.gitignore`

---

## 🧪 Testing

The application was tested for the main production workflows, including:

- User registration
- User login
- Authentication
- Customer management
- Lead management
- Product management
- Inventory management
- Order management
- Protected functionality
- Backend connectivity
- Database connectivity
- Production deployment

---

## ☁️ Deployment

### Frontend — Vercel

The React frontend is deployed through Vercel.

Live frontend:
[https://mini-erp-crm-lime.vercel.app](https://mini-erp-crm-lime.vercel.app)

### Backend — Render

The Node.js backend is deployed through Render.

Live backend:
[https://mini-erp-crm-izul.onrender.com](https://mini-erp-crm-izul.onrender.com)

### Database — Render PostgreSQL

The production PostgreSQL database is hosted on Render and connected to the backend using:

```
DATABASE_URL
```

---

## 🔁 Deployment Flow

```
GitHub
│
├──────────────► Vercel
│                  │
│                  ▼
│               Frontend
│
└──────────────► Render
                   │
                   ▼
                Backend
                   │
                   ▼
               PostgreSQL
```

---

## 📋 Production Checklist

Before submitting or demonstrating the project:

- [x] Final application testing completed
- [x] Security testing completed
- [x] README documentation completed
- [x] GitHub repository created
- [x] Frontend deployed
- [x] Backend deployed
- [x] PostgreSQL database deployed
- [x] Production backend connected
- [x] Environment variables configured
- [x] Production API connectivity verified

---

## 📦 Repository

GitHub:
[https://github.com/Atpdevil/mini-erp-crm](https://github.com/Atpdevil/mini-erp-crm)

---

## 👨‍💻 Project

**Mini ERP CRM — Operations Portal**

Built as a full-stack developer case study for managing business operations through a centralized ERP + CRM workspace.
