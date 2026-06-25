<div align="center">

# 🩸 BloodConnect

### *Connecting donors with those in need — every drop counts.*

[![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Express](https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-7-47a248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635bff?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4-06b6d4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

</div>

---

## 📖 About

**BloodConnect** is a full-stack blood donation management platform that bridges the gap between blood donors and people in urgent need. The platform enables donors to register, create donation requests, and connect with verified blood donors across Bangladesh — all within a single, polished interface.

Beyond just matching donors, BloodConnect includes a **real-time funding system** powered by Stripe so supporters can contribute financially to the cause, and a **rich admin dashboard** for managing users, donations, and platform-wide statistics.

---

## ✨ Features

### 🔐 Authentication & Roles
- Email/password sign-up and login via **Better Auth**
- JWT-based session management with auto-refresh
- Three role levels: **Donor**, **Volunteer**, and **Admin**
- Blocked users are denied access automatically

### 🏠 Public Pages
- **Home** — Animated hero section, live platform stats (donors, requests, funding), feature highlights, and a contact form
- **Donation Requests** — Browse all pending donation requests publicly
- **Search Donors** — Filter active donors by blood group, district, and upazila; export results to PDF
- **Funding** — Donate to the cause securely via Stripe

### 🧑‍💼 Donor Dashboard
- Welcome page with 3 most-recent donation requests at a glance
- Full **My Donation Requests** page with status filtering and pagination
- Create and edit donation requests
- Profile page — update personal info and avatar

### 🛡️ Admin & Volunteer Dashboard
- Admin-only: **All Users** — search, filter, change roles (donor/volunteer/admin), block/unblock
- Admin/Volunteer: **All Blood Donation Requests** — view, filter by status, update or delete any request
- Live stats: total users, total requests, total funding, and a breakdown bar chart

### 💳 Payments
- Stripe-powered one-time donations
- Payment intent created server-side for security
- Funding history table visible to all logged-in users

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite 8, TailwindCSS 4, shadcn/ui (Radix UI) |
| **Routing** | React Router DOM v7 |
| **State & Data** | TanStack Query v5, Axios |
| **Animations** | Framer Motion |
| **Charts** | Recharts |
| **Auth** | Better Auth (client + server) + JWT |
| **Payments** | Stripe (react-stripe-js + stripe Node SDK) |
| **Image Hosting** | ImageBB API |
| **Backend** | Express 5, Node.js |
| **Database** | MongoDB (Native Driver) |

---

## 📁 Project Structure

```
BloodConnect/
├── client/                  # Vite + React frontend
│   ├── src/
│   │   ├── components/      # Navbar, Footer, Sidebar, UI primitives
│   │   ├── contexts/        # AuthContext (session + JWT sync)
│   │   ├── data/            # Bangladesh districts & upazilas data
│   │   ├── hooks/           # useAxiosSecure
│   │   ├── layouts/         # MainLayout, DashboardLayout
│   │   ├── pages/           # Home, Login, Register, Funding, SearchDonors…
│   │   │   └── dashboard/   # DashboardHome, Profile, MyDonationRequests…
│   │   └── routes/          # PrivateRoute, AdminRoute, AdminVolunteerRoute
│   └── package.json
│
└── server/                  # Express REST API
    ├── config/              # db.js, auth.js (Better Auth)
    ├── middleware/          # auth.js (verifyToken, verifyAdmin…)
    ├── routes/              # donationRequests, users, funds, stats, profile
    └── index.js
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x ≤ 22.x
- **MongoDB** (Atlas or local)
- **Stripe** account (test keys work fine)
- **ImageBB** API key

### 1. Clone the repository

```bash
git clone https://github.com/your-username/blood-donation-platform.git
cd blood-donation-platform
```

### 2. Configure the server

Create `server/.env`:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
BETTER_AUTH_SECRET=your_better_auth_secret
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
```

### 3. Configure the client

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000
VITE_IMGBB_API_KEY=your_imagebb_api_key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

### 4. Install dependencies & run

```bash
# Install and start the server
cd server
npm install
npm run dev

# In a new terminal — install and start the client
cd client
npm install
npm run dev
```

The app will be running at **http://localhost:5173**

---

## 🗺️ Pages & Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Home page with stats and hero |
| `/donation-requests` | Public | All pending requests |
| `/search` | Public | Search active donors |
| `/login` | Public | Login |
| `/register` | Public | Register as a donor |
| `/funding` | Private | Donate via Stripe + funding history |
| `/donation-request/:id` | Private | View request details & confirm donation |
| `/dashboard` | Private | Role-based dashboard home |
| `/dashboard/profile` | Private | Edit profile & avatar |
| `/dashboard/my-donation-requests` | Donor | Manage your requests |
| `/dashboard/create-donation-request` | Donor/Volunteer | Create a new request |
| `/dashboard/all-blood-donation-request` | Admin/Volunteer | All requests globally |
| `/dashboard/all-users` | Admin | User management |

---

## 🔑 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/jwt` | Issue JWT for authenticated user |
| `GET` | `/api/profile` | Get logged-in user profile |
| `PATCH` | `/api/profile` | Update profile |

### Donation Requests
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/donation-requests` | All pending requests (public) |
| `POST` | `/api/donation-requests` | Create a new request |
| `GET` | `/api/donation-requests/:id` | Request details |
| `PATCH` | `/api/donation-requests/:id` | Edit a request |
| `DELETE` | `/api/donation-requests/:id` | Delete a request |
| `PATCH` | `/api/donation-requests/:id/status` | Update status |
| `PATCH` | `/api/donation-requests/:id/donate` | Confirm donation (pending → inprogress) |
| `GET` | `/api/my-donation-requests` | Logged-in user's requests (paginated) |
| `GET` | `/api/my-donation-requests/recent` | 3 most recent requests |
| `GET` | `/api/all-donation-requests` | All requests (Admin/Volunteer) |

### Users (Admin)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/users` | All users (paginated + search) |
| `PATCH` | `/api/users/:id/status` | Block / unblock user |
| `PATCH` | `/api/users/:id/role` | Change user role |

### Funding
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/funds` | All funding history |
| `POST` | `/api/funds` | Save a fund transaction |
| `POST` | `/api/create-payment-intent` | Create Stripe payment intent |

### Stats
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/public-stats` | Public: total donors, requests, funding |
| `GET` | `/api/stats` | Admin/Volunteer: detailed stats |

### Donors
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/search/donors` | Search donors by blood group, district, upazila |

---

## 🎨 UI Highlights

- **Glassmorphism hero** with animated floating particles on the home page
- **Transparent → solid navbar** transition on scroll
- **Framer Motion** page and element animations throughout
- **Recharts** bar chart for donation status breakdown in admin dashboard
- Full **dark-style** dashboard with clean card layouts
- **Fully mobile responsive** — optimized for all screen sizes
- PDF export for donor search results

---

## 🩺 User Roles Explained

| Role | Capabilities |
|------|-------------|
| **Donor** | Register, create/edit/delete own requests, view details, donate blood, fund the platform |
| **Volunteer** | Everything a donor can + view/manage all donation requests |
| **Admin** | Everything a volunteer can + manage all users (block, role change) |

---

## 📦 Environment Variables Reference

### Client (`client/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Base URL of the Express server |
| `VITE_IMGBB_API_KEY` | [ImageBB](https://imgbb.com) API key for avatar uploads |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |

### Server (`server/.env`)

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for signing JWTs |
| `BETTER_AUTH_SECRET` | Secret for Better Auth |
| `STRIPE_SECRET_KEY` | Stripe secret key |

---

## 🙏 Acknowledgements

- [Bangladesh Geocode](https://github.com/nuhil/bangladesh-geocode) — districts and upazila data
- [shadcn/ui](https://ui.shadcn.com) — UI component primitives
- [Better Auth](https://better-auth.com) — authentication framework
- [Lucide React](https://lucide.dev) — icon library
- [Framer Motion](https://framer.com/motion) — animation library

---

<div align="center">

Made with ❤️ and 🩸 for **Programming Hero** Assignment B13-A10

</div>
