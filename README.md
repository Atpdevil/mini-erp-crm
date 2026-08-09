# Mini ERP CRM — Operations Portal

> A full-stack Mini ERP + CRM Operations Portal built as part of the Full Stack Developer Case Study.
> The application provides a unified workspace for managing authentication, customers, leads, products/inventory, orders, and dashboard business metrics.

---

## 🔗 Project Links

| | |
|---|---|
| **GitHub** | [https://github.com/Atpdevil/mini-erp-crm](https://github.com/Atpdevil/mini-erp-crm) |
| **Live Frontend** | [https://mini-erp-crm-lime.vercel.app](https://mini-erp-crm-lime.vercel.app) |
| **Backend** | Included in this repository and configured for local execution |
| **Database** | PostgreSQL, configured for local development |

> The frontend is deployed on Vercel. The backend and PostgreSQL database are not separately hosted and can be run locally using the instructions below.

---

## 📌 Project Overview

The Mini ERP CRM is designed as an admin-style business operations portal for a wholesale/distribution workflow.

### Main Modules

| Module | Implemented Features |
|---|---|
| 🔐 **Authentication** | Register, login, JWT authentication |
| 📊 **Dashboard** | Live customer, lead, product, order, pending-order and revenue statistics |
| 👥 **Customers** | Add, edit, delete, search |
| 🎯 **Leads** | Add, edit, delete, search, status pipeline |
| 📦 **Products** | Add, edit, delete, search, SKU, price and stock |
| 🛒 **Orders** | Create orders, add products, quantity handling, stock deduction, status management |
| 🔒 **Security** | Password hashing, JWT authentication, validation and protected API routes |

---

## 🛠 Tech Stack

### Backend

| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| TypeScript | Type-safe backend development |
| Express.js | REST API framework |
| Prisma ORM | Database access and migrations |
| PostgreSQL | Relational database |
| JWT | Authentication |
| bcryptjs | Password hashing |
| CORS | Cross-origin request handling |
| dotenv | Environment variable management |
| tsx | Development TypeScript runner |

### Frontend

| Technology | Purpose |
|---|---|
| React | UI development |
| TypeScript | Type-safe frontend development |
| Vite | Development server and build tool |
| Vanilla CSS | Custom responsive UI and design system |

---

## ✨ Features

### 🔐 Authentication
- User registration
- User login
- JWT-based authentication
- Password hashing with bcrypt
- Protected API requests
- Token-based session handling

### 📊 Dashboard

The dashboard calculates and displays:
- Total customers
- Active leads
- Total products
- Total orders
- Pending orders
- Total revenue
- Business-at-a-glance summary

> Dashboard values update when customers, leads, products and orders are changed.

### 👥 Customer Management

**Implemented:**
- Add customer
- Edit customer
- Delete customer
- Search customers

**Customer data:** Name · Email · Phone · Company · Address

Success/error notifications · Dashboard synchronization

### 🎯 Lead Management

**Implemented:**
- Add lead
- Edit lead
- Delete lead
- Search leads
- Lead source
- Lead notes
- Lead status
- Status filtering/pipeline

**Supported lead statuses:**

`NEW` · `CONTACTED` · `QUALIFIED` · `WON` · `LOST`

### 📦 Product & Inventory Management

**Implemented:**
- Add product
- Edit product
- Delete product
- Search products
- Unique SKU
- Product description
- Price
- Stock quantity
- In-stock display
- Inventory updates after order creation

### 🛒 Order Management

**Implemented:**
- Create order
- Select customer
- Add products
- Select quantity
- Calculate order total
- Deduct product stock
- View orders
- Search by order/customer
- Filter by order status
- Delete orders
- Update order status

**Supported order statuses:**

`PENDING` · `CONFIRMED` · `SHIPPED` · `DELIVERED` · `CANCELLED`

> Order items retain the product price at the time of the order.

---

## 🗂 Project Structure

```
mini-erp-crm/
│
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # Prisma database schema
│   ├── src/
│   │   ├── config/                # Application/database configuration
│   │   ├── controllers/           # Request/business logic
│   │   ├── generated/             # Generated source artifacts
│   │   ├── middleware/            # Authentication/error middleware
│   │   ├── routes/                # REST API routes
│   │   ├── services/              # Service/business operations
│   │   ├── utils/                 # Utility/helper functions
│   │   └── server.ts              # Backend entry point
│   ├── .env                       # Local secrets, not committed
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   ├── prisma.config.ts
│   └── tsconfig.json
│
├── frontend/
│   ├── dist/                      # Production build output
│   ├── public/                    # Static assets
│   ├── src/
│   │   ├── assets/
│   │   │   └── react.svg
│   │   ├── App.css
│   │   ├── App.tsx                # Main application layout
│   │   ├── Customers.tsx          # Customer management
│   │   ├── dashboard.tsx          # Dashboard
│   │   ├── index.css              # Global styling
│   │   ├── Leads.tsx              # Lead management
│   │   ├── Login.tsx              # Login/register
│   │   ├── main.tsx               # Frontend entry point
│   │   ├── Orders.tsx             # Order management
│   │   ├── Products.tsx           # Product management
│   │   └── vite-env.d.ts
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
│
└── README.md
```

> `node_modules`, local `.env` files and other generated/local-only files should not be committed to Git.

---

## 🚀 Local Setup

### Prerequisites

- Node.js 20+
- npm
- PostgreSQL 15+
- Git

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

Create `backend/.env`:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/mini_erp_crm"
JWT_SECRET="your_long_random_secret"
PORT=5000
```

### 3. Create the PostgreSQL database

Create a PostgreSQL database named:

```
mini_erp_crm
```

Then run:

```bash
npx prisma migrate dev
npx prisma generate
```

### 4. Start the backend

```bash
npm run dev
```

- Backend: `http://localhost:5000`
- API: `http://localhost:5000/api`

### 5. Start the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

- Frontend: `http://localhost:5173`

---

## 🔌 API Reference

**Base URL:** `http://localhost:5000/api`

Protected routes use:
```
Authorization: Bearer <JWT_TOKEN>
```

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a user |
| POST | `/auth/login` | Login and receive JWT |
| GET | `/auth/me` | Get authenticated user |

**Login request:**
```json
{ "email": "admin@example.com", "password": "password123" }
```

### Customers

| Method | Endpoint | Description |
|---|---|---|
| GET | `/customers` | List customers |
| POST | `/customers` | Create customer |
| GET | `/customers/:id` | Get customer |
| PUT | `/customers/:id` | Update customer |
| DELETE | `/customers/:id` | Delete customer |

**Fields:** `name` · `email` · `phone` · `company` · `address`

### Leads

| Method | Endpoint | Description |
|---|---|---|
| GET | `/leads` | List leads |
| POST | `/leads` | Create lead |
| GET | `/leads/:id` | Get lead |
| PUT | `/leads/:id` | Update lead |
| DELETE | `/leads/:id` | Delete lead |

**Statuses:** `NEW` · `CONTACTED` · `QUALIFIED` · `WON` · `LOST`

### Products

| Method | Endpoint | Description |
|---|---|---|
| GET | `/products` | List products |
| POST | `/products` | Create product |
| GET | `/products/:id` | Get product |
| PUT | `/products/:id` | Update product |
| DELETE | `/products/:id` | Delete product |

**Fields:** `name` · `sku` · `description` · `price` · `stock`

### Orders

| Method | Endpoint | Description |
|---|---|---|
| GET | `/orders` | List orders |
| POST | `/orders` | Create order |
| GET | `/orders/:id` | Get order |
| PUT | `/orders/:id` | Update order status |
| DELETE | `/orders/:id` | Delete order |

**Example:**
```json
{
  "customerId": 1,
  "items": [
    { "productId": 1, "quantity": 2 }
  ]
}
```

**Statuses:** `PENDING` · `CONFIRMED` · `SHIPPED` · `DELIVERED` · `CANCELLED`

### Dashboard

| Method | Endpoint | Description |
|---|---|---|
| GET | `/dashboard` | Aggregated business statistics |

---

## 🏗 Architecture

```
┌──────────────────────┐
│    React + Vite      │
│      Frontend        │
└──────────┬───────────┘
           │
      HTTP / REST
           │
           ▼
┌──────────────────────┐
│ Express + TypeScript │
│       Backend        │
└──────────┬───────────┘
           │
┌──────────▼───────────┐
│ Controllers / Routes │
│ Middleware / Services│
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│     Prisma ORM       │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│     PostgreSQL       │
└──────────────────────┘
```

### Key Design Decisions

**JWT Authentication**
JWT tokens are used for authenticated API requests.

**Password Security**
Passwords are hashed with bcryptjs.

**Prisma**
Prisma provides typed database access and schema/migration management.

**Transactional Orders**
Order creation uses a database transaction so order creation and stock deduction remain consistent.

**Price Snapshot**
Order items store the product price at order time, preserving historical order values.

**Validation and Error Handling**
Frontend and backend validation are used, with appropriate HTTP status codes and error responses.

---

## 🔐 Security

**Implemented:**
- JWT authentication
- Password hashing
- Protected API routes
- Authorization headers
- Input validation
- Error handling
- Database constraints
- Environment variables for secrets
- `.env` excluded from Git

### Environment Variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection |
| `JWT_SECRET` | JWT signing secret |
| `PORT` | Backend port |

> Never commit real passwords, database credentials or JWT secrets to GitHub.

---

## 🧪 Testing Completed

**Customers**
- Add · Edit · Delete · Search · Dashboard update

**Leads**
- Add · Edit · Delete · Search · Status filtering · Dashboard update

**Products**
- Add · Edit · Delete · Search · Inventory tracking

**Orders**
- Create order · Select customer · Add products · Quantity handling · Stock deduction · Search/filter · Status handling · Delete order · Dashboard update

**Security**
- Authentication flow · Protected requests · Input validation · Error handling · Environment secrets kept outside Git

---

## 🌐 Deployment

### Frontend

Deployed using Vercel.

**Live application:** [https://mini-erp-crm-lime.vercel.app](https://mini-erp-crm-lime.vercel.app)

### Backend and Database

The backend and PostgreSQL database are included in the repository and configured for local execution. They are not separately hosted as public services.

**Local architecture:**
```
React/Vite
    ↓
Express/Node.js
    ↓
Prisma
    ↓
PostgreSQL
```

---

## ⚠️ Known Limitations

The following broader case-study features are outside the implemented scope:

- No separate public backend deployment
- No separate public PostgreSQL deployment
- No product image upload
- No invoice PDF generation
- No Docker configuration
- No GitHub Actions CI/CD pipeline
- No dedicated stock movement history screen
- No separate sales challan/invoice workflow
- Customer fields are limited to the fields implemented in the current UI
- Pagination is not implemented for the current lists

> These limitations were kept within the scope and time constraints of the case study.

---

## 📹 Demonstration

The project demonstration covers:

- Authentication
- Dashboard
- Customer management
- Lead management
- Product management
- Order creation
- Inventory update
- Dashboard synchronization
- Deployed frontend

---

## 📋 Submission Information

| | |
|---|---|
| **GitHub Repository** | [https://github.com/Atpdevil/mini-erp-crm](https://github.com/Atpdevil/mini-erp-crm) |
| **Live Frontend** | [https://mini-erp-crm-lime.vercel.app](https://mini-erp-crm-lime.vercel.app) |
| **Backend** | Backend source and local setup are included in this repository |
| **Database** | PostgreSQL configuration and Prisma schema are included in the backend |

### Documentation

This README includes:
- Setup instructions
- Folder structure
- API reference
- Architecture
- Environment variables
- Security information
- Testing status
- Deployment information
- Known limitations

---

## 👨‍💻 Project

**Mini ERP CRM — Operations Portal**

Built as part of the Full Stack Developer Case Study.
