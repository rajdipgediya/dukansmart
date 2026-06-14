# DukaanSmart Dashboard 🛍️

A complete **Point of Sale (POS) & Retail Store Management Dashboard** designed for small to medium-sized retail businesses. It provides an intuitive, high-performance interface for quick checkouts, inventory tracking, financial analytics, credit ledgers, and expense monitoring.

Built with **React, Vite (SWC), Tailwind CSS, shadcn/ui**, and integrated with **Supabase** for real-time database syncing and secure user authentication.

---

## 🚀 Key Features

### 1. ⚡ Fast Sale (POS Billing)
- **Rapid Checkout Interface**: A tailored POS panel designed for speed, allowing quick product selection, quantity adjustments, and payment processing.
- **Cart Management**: Real-time total, tax, and discount calculation.

### 2. 📊 Rich Analytics & Dashboards
- **Store Performance Dashboard**: Visual charts for revenue, transaction count, average order value, and top-selling items.
- **Super Admin Panel**: Manage multiple store outlets, monitor system-wide logs, and view aggregate analytical insights.

### 3. 📦 Inventory & Product Control
- **Stock Tracking**: Real-time updates on stock levels with low-stock alerts.
- **Catalog Management**: Easily add, edit, or remove products, configure pricing, manage barcodes/SKUs, and structure categories.

### 4. 💸 Expense & Credit Ledgers
- **Expense Log**: Register daily operating costs (rent, utilities, salaries) to calculate net profits.
- **Credit Ledger (Udhari/Dues)**: Track client accounts, records of customer credits, payment history, and due balance tracking.

### 5. 📑 Reports & Daily Overviews
- **Daily Summaries**: Instant reconciliation showing total cash, card, and digital payments collected during the day.
- **Reporting Engine**: Dynamic graph visualizations (using Recharts) to analyze sales trends over weeks, months, or custom date ranges.

### 6. 🔒 Authentication & Configuration
- **Supabase Authentication**: Secure login, logout, and protected routing.
- **Store Settings**: Configure store name, contact info, currency symbols, invoice headers, and tax structures.

---

## 🛠️ Tech Stack

- **Frontend Core**: [React](https://react.dev/) 18 & [Vite](https://vite.dev/) (SWC compiler for ultra-fast builds)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (strict type safety)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (fully styled, accessible components built on Radix primitives)
- **Charts & Graphs**: [Recharts](https://recharts.org/)
- **Backend-as-a-Service**: [Supabase](https://supabase.com/) (Real-time DB, Auth, and Storage)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

---

## 📁 Project Structure

```
dukaansmart-dashboard/
├── public/                 # Static assets (favicons, placeholders)
├── supabase/               # Local Supabase config
└── src/
    ├── components/         # Reusable widgets, layouts, and navigation
    │   ├── ui/             # Core shadcn/ui components (buttons, dialogs, etc.)
    │   ├── AppSidebar.tsx  # Interactive navigation drawer
    │   └── TopNavbar.tsx   # Dashboard header control panel
    ├── contexts/           # Global React contexts (Auth, Store preferences)
    ├── hooks/              # Custom hooks for fetching and mutations
    ├── integrations/
    │   └── supabase/       # Supabase client initializer and auto-generated database types
    ├── pages/              # Primary view pages (POS, Dashboard, Inventory, etc.)
    ├── App.tsx             # Root router and page composition
    └── main.tsx            # App mount entry point
```

---

## ⚙️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.x or later recommended)
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)

### Installation

1. Clone or download the repository.
2. Install the project dependencies:
   ```bash
   npm install
   ```

### Environment Configuration
Create a `.env` file in the root directory and configure your Supabase project keys:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-api-key
```

### Running the Application

- **Development Server**: Start the local server with hot module replacement (HMR):
  ```bash
  npm run dev
  ```
- **Production Build**: Compile and optimize the application:
  ```bash
  npm run build
  ```
- **Preview Production Build**: Test the production bundle locally:
  ```bash
  npm run preview
  ```
