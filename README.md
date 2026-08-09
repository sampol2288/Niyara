# NIYARA — Archival Fashion E-Commerce Platform

A full-stack luxury fashion e-commerce platform with a storefront, admin dashboard, and REST API backend.

## Architecture

```
fashion/
├── backend/          # Express.js + MongoDB Atlas REST API (port 5000)
├── frontend/         # React + Vite storefront (port 5173)
└── admin/            # React + Vite admin dashboard (port 5174)
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Lucide React |
| Admin | React 19, Vite |
| Backend | Express.js 5, Node.js |
| Database | MongoDB Atlas (Mongoose 9) |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Email | Nodemailer (Gmail SMTP) |
| Security | Helmet, express-rate-limit |

---

## Local Development Setup

### Prerequisites
- Node.js 20+
- npm 10+
- A MongoDB Atlas cluster
- A Gmail account with an [App Password](https://myaccount.google.com/apppasswords)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/niyara.git
cd niyara
```

### 2. Configure backend environment
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your real credentials
```

Required variables in `backend/.env`:
| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Random string ≥ 32 chars (use `openssl rand -base64 64`) |
| `SMTP_USER` | Gmail address |
| `SMTP_PASS` | Gmail App Password (16 chars, no spaces) |
| `FRONTEND_URL` | Frontend origin for CORS (e.g. `http://localhost:5173`) |
| `ADMIN_URL` | Admin origin for CORS (e.g. `http://localhost:5174`) |

### 3. Configure frontend and admin environments
```bash
# Frontend (already set for localhost by default)
cp frontend/.env.example frontend/.env

# Admin (already set for localhost by default)
cp admin/.env.example admin/.env
```

### 4. Install all dependencies
```bash
npm run install:all
```

### 5. Start all three services
```bash
npm run dev
```

This starts:
- Frontend on http://localhost:5173
- Backend on http://localhost:5000
- Admin on http://localhost:5174

---

## Creating the First Admin User

Since admin routes require JWT authentication, you need to create an admin user directly in MongoDB:

**Option A: MongoDB Atlas UI**
1. Go to your MongoDB Atlas cluster
2. Browse to the `niyara` database → `users` collection
3. Insert a document with role `"admin"` and a bcrypt-hashed password

**Option B: Use the register endpoint temporarily**
```bash
# Register a user via the API
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@niyara.com","password":"YourSecurePass123"}'

# Then update their role directly in MongoDB Atlas to "admin"
```

---

## API Documentation

### Base URL
- Development: `http://localhost:5000/api`
- Production: `https://niyara.onrender.com/api`

### Authentication
Protected routes require a JWT Bearer token in the `Authorization` header:
```
Authorization: Bearer <token>
```

### Endpoints

#### Auth (`/api/auth`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/db-status` | None | Database connection status |
| POST | `/send-otp` | None | Send OTP email for verification |
| POST | `/verify-otp` | None | Verify OTP code |
| POST | `/register` | None | Register new user |
| POST | `/login` | None | Login and get JWT |
| POST | `/reset-password` | None | Reset password (after OTP verify) |
| PATCH | `/update-password` | JWT | Change own password |
| GET | `/me` | JWT | Get current user profile |
| POST | `/send-mail` | JWT + Admin | Send custom email |
| POST | `/clear-db` | JWT + Admin | Clear non-admin data |

#### Products (`/api/products`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | None | List all products |
| GET | `/:id` | None | Get single product |
| POST | `/` | JWT + Admin | Create/update product |
| PUT | `/:id` | JWT + Admin | Update product |
| DELETE | `/:id` | JWT + Admin | Delete product |

#### Orders (`/api/orders`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | JWT + Admin | List all orders |
| POST | `/` | JWT | Place an order |
| PATCH | `/:id/status` | JWT + Admin | Update order status |

#### Users (`/api/users`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | JWT + Admin | List all users |
| POST | `/` | JWT + Admin | Create user |
| PATCH | `/:id/role` | JWT + Admin | Update user role |
| DELETE | `/:id` | JWT + Admin | Delete user |

#### Categories (`/api/categories`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | None | List all categories |
| POST | `/` | JWT + Admin | Create/update category |
| PATCH | `/:id/status` | JWT + Admin | Update status |
| DELETE | `/:id` | JWT + Admin | Delete category |

#### Discounts (`/api/discounts`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | JWT + Admin | List all discount codes |
| POST | `/validate` | None | Validate a promo code |
| POST | `/` | JWT + Admin | Create discount code |
| DELETE | `/:id` | JWT + Admin | Delete discount code |

#### Reviews (`/api/reviews`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | None | List approved reviews |
| GET | `/all` | JWT + Admin | List all reviews |
| POST | `/` | JWT | Submit a review |
| PATCH | `/:id/status` | JWT + Admin | Approve/reject review |
| DELETE | `/:id` | JWT + Admin | Delete review |

---

## Production Deployment

### Backend → Render

1. Create a new **Web Service** on [Render](https://render.com)
2. Connect your GitHub repository
3. Set **Root Directory**: `backend`
4. Set **Build Command**: `npm install`
5. Set **Start Command**: `node server/index.js`
6. Add **Environment Variables** (all from `backend/.env.example`)
7. Set `NODE_ENV=production`
8. Set `FRONTEND_URL` and `ADMIN_URL` to your Vercel deployment URLs

### Frontend → Vercel

1. Import the project on [Vercel](https://vercel.com)
2. Set **Root Directory**: `frontend`
3. Set **Build Command**: `npm run build`
4. Set **Output Directory**: `dist`
5. Add environment variable: `VITE_API_URL=https://your-backend.onrender.com/api`

### Admin → Vercel

1. Create a separate Vercel project for the admin
2. Set **Root Directory**: `admin`
3. Same build settings as frontend
4. Add environment variable: `VITE_API_URL=https://your-backend.onrender.com/api`

---

## Security Features

- **Helmet** — HTTP security headers on all responses
- **Rate Limiting** — 300 req/15min global; 20 req/15min on auth endpoints
- **CORS Whitelist** — Only allowed origins can access the API
- **JWT Authentication** — 7-day expiry, RS256 signing
- **bcrypt** — 12 rounds for password hashing
- **OTP Verification** — 10-minute expiry, server-side only (never in API response)
- **Admin Role Guard** — All admin operations require `role: "admin"` in JWT
- **Input Validation** — Email format, password length, role validation
- **Self-deletion Prevention** — Admins cannot delete their own account
- **Graceful Shutdown** — SIGTERM/SIGINT handlers for clean process exit

---

## Development Scripts

From the root `fashion/` directory:

```bash
npm run dev          # Start all three services (frontend, backend, admin)
npm run frontend     # Start only the storefront
npm run backend      # Start only the backend
npm run admin        # Start only the admin panel
npm run build        # Build the frontend for production
npm run install:all  # Install dependencies for all three packages
```
