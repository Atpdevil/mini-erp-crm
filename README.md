# Mini ERP CRM — Operations Portal

> A full-stack ERP + CRM system for wholesale/distribution companies, built for managing customers, leads, products, inventory and orders — all from a single unified workspace.

---

## 📸 Overview

| Module | Features |
|---|---|
| **Auth** | JWT login & register, role-based (ADMIN / MANAGER / EMPLOYEE) |
| **Dashboard** | Live stats — customers, leads, products, orders, revenue |
| **Customers** | Full CRUD — add, edit, search, delete |
| **Leads** | Full CRUD — with status pipeline (NEW → CONTACTED → QUALIFIED → WON / LOST) |
| **Products** | Full CRUD — SKU, stock tracking, low-stock badges |
| **Orders** | Full CRUD — create with line items, stock deduction, status updates |

---

## 🛠 Tech Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | v20+ | Runtime |
| TypeScript | ^7.0 | Type safety |
| Express.js | ^5.2 | HTTP framework |
| Prisma ORM | ^7.9 | Database ORM & migrations |
| PostgreSQL | 15+ | Relational database |
| bcryptjs | ^3.0 | Password hashing |
| jsonwebtoken | ^9.0 | JWT authentication |
| cors | ^2.8 | Cross-origin requests |
| dotenv | ^17.4 | Environment variables |
| tsx | ^4.23 | TypeScript runner (dev) |

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | ^19.1 | UI library |
| TypeScript | ~5.8 | Type safety |
| Vite | ^7.1 | Build tool & dev server |
| Vanilla CSS | — | Styling (custom design system) |
| Inter (Google Fonts) | — | Typography |

### Database Schema
| Model | Fields |
|---|---|
| **User** | id, name, email, password, role (ADMIN/MANAGER/EMPLOYEE), createdAt |
| **Customer** | id, name, email, phone, company, address, userId |
| **Lead** | id, name, email, phone, company, source, status, notes, customerId |
| **Product** | id, name, sku (unique), description, price, stock |
| **Order** | id, total, status, customerId, userId |
| **OrderItem** | id, orderId, productId, quantity, price (snapshot) |

---

## 🚀 Local Setup

### Prerequisites
- Node.js v20+
- PostgreSQL 15+ (running locally)
- npm or yarn

### 1. Clone the repository

```bash
git clone https://github.com/your-username/mini-erp-crm.git
cd mini-erp-crm
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/mini_erp_crm"
JWT_SECRET="your_super_secret_key_here"
PORT=5000
```

Run database migrations and generate the Prisma client:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

Start the backend dev server:

```bash
npm run dev
```

> Backend runs on **http://localhost:5000**

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

> Frontend runs on **http://localhost:5173**

---

## 🗂 Project Structure

```
mini-erp-crm/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # Database models & enums
│   ├── src/
│   │   ├── config/
│   │   │   └── prisma.ts          # Prisma client singleton
│   │   ├── controllers/
│   │   │   ├── auth/              # Register, Login, GetMe
│   │   │   ├── customers/         # CRUD
│   │   │   ├── leads/             # CRUD
│   │   │   ├── products/          # CRUD
│   │   │   ├── orders/            # CRUD + stock deduction
│   │   │   └── dashboard/         # Aggregated stats
│   │   ├── middleware/
│   │   │   ├── auth/              # JWT verify middleware
│   │   │   └── errorHandler.ts    # Global error handler
│   │   ├── routes/                # Express routers per module
│   │   └── server.ts              # App entry point
│   ├── .env                       # Environment variables (not committed)
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── src/
    │   ├── index.css              # Full design system (CSS variables)
    │   ├── main.tsx               # Entry — routes to Login or App
    │   ├── App.tsx                # Sidebar layout + page routing
    │   ├── Login.tsx              # Login / Register page
    │   ├── dashboard.tsx          # Stats dashboard
    │   ├── Customers.tsx          # Customers CRUD
    │   ├── Leads.tsx              # Leads CRUD + status pipeline
    │   ├── Products.tsx           # Products CRUD + SKU
    │   └── Orders.tsx             # Orders CRUD + line items
    ├── index.html
    ├── package.json
    ├── vite.config.ts
    └── tsconfig.json
```

---

## 🔌 API Reference

Base URL: `http://localhost:5000/api`

All protected routes require the header:
```
Authorization: Bearer <jwt_token>
```

### Auth
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/auth/register` | Create account | ❌ |
| POST | `/auth/login` | Login, returns JWT | ❌ |
| GET | `/auth/me` | Get current user | ✅ |

**Login request body:**
```json
{ "email": "admin@example.com", "password": "password123" }
```

**Login response:**
```json
{
  "success": true,
  "token": "<jwt>",
  "user": { "id": 1, "name": "Admin", "email": "...", "role": "ADMIN" }
}
```

### Customers
| Method | Endpoint | Description |
|---|---|---|
| GET | `/customers` | List all customers |
| POST | `/customers` | Create customer |
| GET | `/customers/:id` | Get customer by ID |
| PUT | `/customers/:id` | Update customer |
| DELETE | `/customers/:id` | Delete customer |

**Create/Update body:** `name` (required), `email`, `phone`, `company`, `address`

### Leads
| Method | Endpoint | Description |
|---|---|---|
| GET | `/leads` | List all leads |
| POST | `/leads` | Create lead |
| GET | `/leads/:id` | Get lead by ID |
| PUT | `/leads/:id` | Update lead |
| DELETE | `/leads/:id` | Delete lead |

**Status values:** `NEW` · `CONTACTED` · `QUALIFIED` · `WON` · `LOST`

**Create body:** `name` (required), `email`, `phone`, `company`, `source`, `status`, `notes`

### Products
| Method | Endpoint | Description |
|---|---|---|
| GET | `/products` | List all products |
| POST | `/products` | Create product |
| GET | `/products/:id` | Get product by ID |
| PUT | `/products/:id` | Update product |
| DELETE | `/products/:id` | Delete product |

**Create body:** `name` (required), `sku` (required, unique), `description`, `price` (required), `stock`

### Orders
| Method | Endpoint | Description |
|---|---|---|
| GET | `/orders` | List all orders |
| POST | `/orders` | Create order (deducts stock) |
| GET | `/orders/:id` | Get order by ID |
| PUT | `/orders/:id` | Update order status |
| DELETE | `/orders/:id` | Delete order |

**Create body:**
```json
{
  "customerId": 1,
  "items": [
    { "productId": 3, "quantity": 2 },
    { "productId": 7, "quantity": 1 }
  ]
}
```

**Status values:** `PENDING` · `CONFIRMED` · `SHIPPED` · `DELIVERED` · `CANCELLED`

**Update status body:** `{ "status": "CONFIRMED" }`

### Dashboard
| Method | Endpoint | Description |
|---|---|---|
| GET | `/dashboard` | Aggregated stats (customers, leads, products, orders, revenue) |

---

## 🔐 Test Credentials

Register an account through the UI at `http://localhost:5173` or via the API:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Admin User\",\"email\":\"admin@example.com\",\"password\":\"password123\",\"role\":\"ADMIN\"}"
```

Available roles: `ADMIN` · `MANAGER` · `EMPLOYEE`

---

## 🏗 Architecture

```
Browser (React + Vite)
        │
        │  HTTP / REST JSON
        ▼
Express.js Server (Node.js + TypeScript)
        │
        ├── JWT Middleware (auth guard)
        ├── Controllers (business logic)
        │
        ▼
Prisma ORM
        │
        ▼
PostgreSQL Database
```

**Key design decisions:**

- **Stateless auth** — JWT tokens stored in `localStorage`, validated on every request via `Authorization: Bearer` header.
- **Prisma transactions** — Order creation uses a DB transaction to atomically create the order and decrement product stock, ensuring no partial writes.
- **Price snapshot** — `OrderItem.price` stores the product price at time of order (not live price), so historical orders remain accurate even if product prices change later.
- **Input validation** — Frontend validates before submission; backend validates independently and returns proper HTTP status codes (`400`, `401`, `404`, `409`, `500`).
- **Single-page routing** — No router library; token presence in `localStorage` determines whether to show Login or the main App.

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/mini_erp_crm` |
| `JWT_SECRET` | Secret key for signing JWTs | `your_long_random_secret_here` |
| `PORT` | Server port (optional, defaults to 5000) | `5000` |

> **Never commit `.env` to git.** The `.gitignore` already excludes it.

---

## 🚢 Deployment

| Layer | Platform | Notes |
|---|---|---|
| Frontend | [Vercel](https://vercel.com) | Connect GitHub repo, set root to `frontend/` |
| Backend | [Render](https://render.com) | Web service, root `backend/`, start cmd: `npm run start` |
| Database | [Neon](https://neon.tech) or [Supabase](https://supabase.com) | Free PostgreSQL, copy connection string to `DATABASE_URL` |

### Vercel (Frontend)
1. Import GitHub repo on Vercel
2. Set **Root Directory** → `frontend`
3. Build command: `npm run build`
4. Output directory: `dist`

### Render (Backend)
1. New **Web Service** → connect repo
2. Root directory: `backend`
3. Build command: `npm install && npx prisma generate && npm run build`
4. Start command: `npm run start`
5. Add environment variables: `DATABASE_URL`, `JWT_SECRET`

### After deploying
Update the `API_URL` constant in all frontend source files from `http://localhost:5000` to your live backend URL (e.g., `https://mini-erp-crm.onrender.com`).

---

## ✅ Features Implemented

- [x] JWT Authentication (Register / Login)
- [x] Role-based user system (ADMIN, MANAGER, EMPLOYEE)
- [x] Customer CRUD with search
- [x] Lead CRUD with status pipeline & filter
- [x] Product CRUD with SKU (unique), stock status badges
- [x] Order CRUD — line items, stock deduction via DB transaction, price snapshot
- [x] Dashboard with aggregated live stats
- [x] Premium dark-mode UI with glassmorphism design system
- [x] Toast notifications, modal dialogs, loading states, empty states

## ⚠️ Known Limitations & Assumptions

- **No pagination** — List endpoints return all records. For large datasets, cursor-based or offset pagination should be added.
- **Single-page routing only** — No `react-router`. Refreshing the browser resets to the Dashboard view.
- **CORS is open** — `app.use(cors())` allows all origins. Restrict to your frontend domain in production.
- **No Docker setup** — Requires manual Node.js + PostgreSQL installation locally.
- **No invoice PDF export or product image upload** — Bonus features from the assignment specification were not implemented.
- **Lead status `WON`** — The Prisma schema defines `CONVERTED` in the enum but the order controller and frontend use `WON` for the won state; both are present in the schema.

---

*Built as part of the Full Stack Developer Case Study — Mini ERP + CRM Operations Portal.*
