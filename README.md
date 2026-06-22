# FinTrack - Personal Finance Management Application

<div align="center">

![FinTrack Logo](https://img.shields.io/badge/FinTrack-Finance%20Tracker-blue?style=for-the-badge)

**A modern, full-featured personal finance management application built with Next.js**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Project Structure](#-project-structure) • [Environment Setup](#-environment-setup) • [Deployment](#-deployment)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Environment Setup](#-environment-setup)
- [Project Structure](#-project-structure)
- [Key Features in Detail](#-key-features-in-detail)
- [Development](#-development)
- [Deployment](#-deployment)
- [Security](#-security)
- [Performance](#-performance)
- [Contributing](#-contributing)

---

## 🎯 Overview

**FinTrack** is a comprehensive personal finance management application designed to help users track their income, expenses, budgets, and financial goals. Built with modern web technologies, it provides an intuitive interface for managing personal finances with real-time updates, detailed analytics, and responsive design that works seamlessly across all devices.

### Key Highlights

- ✅ **Secure Authentication** - User registration and login with Supabase Auth
- ✅ **Real-time Balance Tracking** - Automatic balance calculation and updates
- ✅ **Transaction Management** - Comprehensive income and expense tracking
- ✅ **Budget Planning** - Create and monitor budgets with visual indicators
- ✅ **Category Management** - Organize transactions with custom categories
- ✅ **Analytics Dashboard** - Visual charts and insights into spending patterns
- ✅ **Multi-currency Support** - Track finances in your preferred currency
- ✅ **Responsive Design** - Optimized for desktop, tablet, and mobile devices

---

## ✨ Features

### 🔐 Authentication & User Management
- Secure user registration and login
- Session management with Supabase
- User profile with preferred currency settings
- Protected routes with automatic redirects

### 💰 Transaction Management
- **Add Transactions**: Record income and expenses with detailed information
- **Transaction Types**: Categorize as income or expense
- **Transaction Details**: Include amount, date, description, category, and currency
- **Transaction History**: View all transactions in a sortable, filterable table
- **Edit & Delete**: Modify or remove transactions as needed

### 📊 Dashboard & Analytics
- **Balance Overview**: Real-time total balance display
- **Spending Charts**: Visual representation of spending patterns
- **Budget Overview**: Quick view of budget status and remaining amounts
- **Transaction Summary**: Recent transactions and financial insights

### 💵 Budget Management
- **Create Budgets**: Set budgets for specific categories
- **Budget Tracking**: Monitor spending against budget limits
- **Visual Indicators**: Color-coded warnings for budget thresholds
- **Budget Summary**: Overview of total budget, spent, and remaining amounts
- **Edit & Delete**: Manage budgets with full CRUD operations

### 🏷️ Category Management
- **Custom Categories**: Create income and expense categories
- **Category Organization**: Separate views for income and expense categories
- **Category Details**: Include name, icon, color, and type
- **Category Filtering**: Use categories to filter transactions

### 📱 User Experience
- **Responsive Design**: Optimized for all screen sizes
- **Mobile-First**: Bottom navigation for mobile devices
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages
- **Form Validation**: Real-time form validation with helpful messages

---

## 🛠 Tech Stack

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **UI Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Form Management**: [Formik](https://formik.org/) + [Yup](https://github.com/jquense/yup)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)

### Backend & Database
- **Backend**: [Supabase](https://supabase.com/)
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **API**: Next.js API Routes

### Development Tools
- **Package Manager**: npm
- **Linting**: ESLint with Next.js config
- **Code Quality**: TypeScript strict mode
- **Version Control**: Git

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 20.x or higher
- **npm** 9.x or higher (or yarn/pnpm)
- **Git** for version control
- **Supabase Account** (for database and authentication)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AlberdaNazarius/FinanceTracker.git
   cd finance_tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (see [Environment Setup](#-environment-setup))

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🔧 Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: For production
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Getting Supabase Credentials

1. Create a project at [supabase.com](https://supabase.com)
2. Go to Project Settings → API
3. Copy the `Project URL` and `anon public` key
4. Add them to your `.env.local` file

### Database Schema

The application requires the following database tables:

- `user` - User profiles and preferences
- `transaction` - Income and expense records
- `category` - Transaction categories
- `budget` - Budget plans and tracking
- `currency` - Supported currencies

Refer to the database migration files or contact the development team for the complete schema.

---

## 📁 Project Structure

```
finance_tracker/
├── app/
│   ├── (auth)/              # Authentication pages
│   │   ├── login/
│   │   └── signup/
│   ├── (main-pages)/        # Main application pages
│   │   ├── page.tsx         # Dashboard
│   │   ├── transactions/
│   │   ├── categories/
│   │   └── budget/
│   ├── api/                 # API routes
│   │   ├── transactions/
│   │   ├── category/
│   │   ├── budget/
│   │   └── user/
│   ├── components/          # React components
│   │   ├── auth/            # Auth components
│   │   ├── common/          # Shared components
│   │   ├── page/            # Page-specific components
│   │   └── ui/              # UI primitives
│   ├── helpers/             # Utility functions
│   ├── hooks/               # Custom React hooks
│   ├── services/            # API service layer
│   ├── store/               # State management
│   ├── types/               # TypeScript types
│   └── enum/                 # Enumerations
├── public/                  # Static assets
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

### Key Directories

- **`app/(auth)/`**: Authentication pages (login, signup)
- **`app/(main-pages)/`**: Protected application pages
- **`app/api/`**: Next.js API routes for backend operations
- **`app/components/`**: Reusable React components
- **`app/hooks/`**: Custom React hooks for data fetching
- **`app/services/`**: Service layer for API calls
- **`app/types/`**: TypeScript type definitions

---

## 🎨 Key Features in Detail

### Transaction Management

The transaction system allows users to:
- Record transactions with amount, date, category, and description
- Filter transactions by type (income/expense), category, and date range
- Search transactions by description or category name
- View transactions in a responsive table with sorting capabilities
- Edit or delete existing transactions

### Budget Tracking

Budget features include:
- Create budgets for specific categories
- Set budget amounts and track spending
- Visual indicators when approaching or exceeding budget limits
- Overall budget summary with totals and percentages
- Edit and delete budget entries

### Category System

Categories provide organization:
- Separate categories for income and expenses
- Custom icons and colors for visual identification
- Category-based filtering in transactions
- Full CRUD operations for category management

### Dashboard Analytics

The dashboard displays:
- Total balance in preferred currency
- Spending charts with visual data representation
- Budget overview with quick status indicators
- Recent transaction summaries

---

## 💻 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

### Code Quality

- **TypeScript**: Strict mode enabled for type safety
- **ESLint**: Configured with Next.js recommended rules
- **Code Formatting**: Consistent code style across the project
- **Error Handling**: Comprehensive error handling in API routes and components

### Best Practices

- ✅ Type-safe API calls with TypeScript
- ✅ Server and client component separation
- ✅ Reusable component architecture
- ✅ Custom hooks for data fetching
- ✅ Centralized state management
- ✅ Form validation with Yup schemas
- ✅ Responsive design patterns
- ✅ Accessibility considerations

---

<div align="center">

[//]: # ([Documentation]&#40;#&#41; • [Report Bug]&#40;#&#41; • [Request Feature]&#40;#&#41;)

</div>
