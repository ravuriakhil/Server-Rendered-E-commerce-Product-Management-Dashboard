# Server-Rendered E-commerce Product Management Dashboard
## Publicly Accessible Deployed Version Of The Application
https://ssr-admin-dashboard-akhil.vercel.app
## Dummy Admin Credentials
-email address:- admin@example.com
-password:- admin123
## Project Overview

A comprehensive server-side rendered (SSR) administrative dashboard for managing products in an e-commerce system. Built with Next.js 14, this application provides administrators with a powerful interface to manage product data, view analytics, and handle inventory. The dashboard features fast page load times, improved SEO performance, and a modern, intuitive user interface designed exclusively for administrators.

The application enables complete product lifecycle management including creation, editing, deletion, and real-time inventory tracking. It includes interactive data visualization tools for sales and stock metrics, secure authentication, and seamless image upload capabilities.

## Features

- **Complete Product Management (CRUD)**
  - Create new products with multi-step forms
  - Edit existing product information
  - Delete products with confirmation
  - View detailed product information
  - Search and filter products

- **Multi-Step Product Forms**
  - Step 1: Basic Information (name, description, category)
  - Step 2: Pricing & Inventory (price, stock, SKU, sales)
  - Step 3: Images & Status (upload images, set active/inactive status)
  - Strong input validation using Zod schemas

- **Interactive Data Visualization**
  - Sales charts by category (Bar Chart)
  - Stock distribution by category (Pie Chart)
  - Top products by stock (Bar Chart)
  - Top-selling products analysis
  - Real-time statistics dashboard

- **Secure Authentication & Authorization**
  - JWT-based authentication with httpOnly cookies
  - Password hashing using bcrypt
  - Admin-only access to all features
  - Secure session management

- **Image Management**
  - Upload product images to Cloudinary
  - Multiple image support per product
  - Image preview and deletion
  - Secure file upload with validation

- **Admin Onboarding**
  - Create new admin users
  - Secure onboarding process
  - Immediate account activation

- **Server-Side Rendering (SSR)**
  - Fast page load times
  - Improved SEO performance
  - Better user experience

- **Dashboard Analytics**
  - Total products count
  - Active products tracking
  - Total stock overview
  - Total sales metrics
  - Real-time statistics cards

## Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Form Management:** React Hook Form
- **Form Validation:** Zod
- **Data Visualization:** Recharts
- **State Management:** React Query (TanStack Query)
- **HTTP Client:** Axios

### Backend
- **Runtime:** Node.js
- **API Framework:** Next.js API Routes
- **Database:** MongoDB
- **ODM:** Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs

### Third-Party Services
- **Image Storage:** Cloudinary
- **Database:** MongoDB Atlas (cloud) or Local MongoDB

### Development Tools
- **Type Checking:** TypeScript
- **Code Quality:** ESLint
- **Build Tool:** Next.js Build System
- **Package Manager:** npm/yarn

## Setup Instructions

### Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18+ and npm/yarn
- MongoDB database (local installation or MongoDB Atlas account)
- Cloudinary account (for image uploads)

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd Server-Rendered-E-commerce-Product-Management-Dashboard
```

### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
```

### Step 3: Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/ecommerce-dashboard
# Or use MongoDB Atlas connection string:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority

# JWT Secret (use a strong, random string in production)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**Where to get these values:**
- **MONGODB_URI:** 
  - Local: `mongodb://localhost:27017/ecommerce-dashboard`
  - Atlas: Get connection string from MongoDB Atlas dashboard
- **JWT_SECRET:** Generate a random string (e.g., using `openssl rand -base64 32`)
- **Cloudinary:** Sign up at [cloudinary.com](https://cloudinary.com) and get credentials from your dashboard

### Step 4: Create the First Admin User

Since the application requires authentication, you need to create the first admin user. Use the provided script:

```bash
node scripts/create-admin.js [email] [password] [name]
```

**Example:**
```bash
node scripts/create-admin.js admin@example.com admin123 "Admin User"
```

**Default values (if no arguments provided):**
- Email: `admin@example.com`
- Password: `admin123`
- Name: `Admin User`

### Step 5: Run the Development Server

```bash
npm run dev
# or
yarn dev
```

### Step 6: Access the Application

Open your browser and navigate to:
- **Application:** [http://localhost:3000](http://localhost:3000)
- **Login Page:** [http://localhost:3000/login](http://localhost:3000/login)

### Step 7: Log In

Use the admin credentials you created in Step 4 to log in.

## Additional Information

### Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── products/     # Product CRUD endpoints
│   │   └── upload/       # Image upload endpoint
│   ├── dashboard/        # Dashboard pages
│   ├── admin/            # Admin-only pages
│   └── login/            # Login page
├── components/           # React components
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
│   ├── auth.ts         # Authentication utilities
│   ├── db.ts           # Database connection
│   └── validations/    # Zod schemas
├── models/             # Mongoose models
└── public/            # Static assets
```

### API Endpoints

**Authentication**
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current authenticated user
- `POST /api/auth/register` - Register new admin user (admin only)

**Products**
- `GET /api/products` - Get all products (with pagination and search)
- `GET /api/products/[id]` - Get single product by ID
- `POST /api/products` - Create new product (admin only)
- `PUT /api/products/[id]` - Update product (admin only)
- `DELETE /api/products/[id]` - Delete product (admin only)
- `GET /api/products/stats` - Get product statistics for dashboard

**Upload**
- `POST /api/upload` - Upload image to Cloudinary (admin only)

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes |

### Development Commands

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

