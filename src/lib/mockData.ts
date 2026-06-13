// Mock data for DukaanSmart dashboard

export const dashboardStats = {
  todaySales: 12450,
  todayProfit: 3200,
  pendingCredit: 45600,
  lowStockItems: 8,
};

export const salesLast7Days = [
  { day: "Mon", sales: 8500 },
  { day: "Tue", sales: 12300 },
  { day: "Wed", sales: 9800 },
  { day: "Thu", sales: 15200 },
  { day: "Fri", sales: 11000 },
  { day: "Sat", sales: 18500 },
  { day: "Sun", sales: 7200 },
];

export const monthlyRevenue = [
  { month: "Sep", revenue: 185000, profit: 42000 },
  { month: "Oct", revenue: 210000, profit: 48000 },
  { month: "Nov", revenue: 195000, profit: 45000 },
  { month: "Dec", revenue: 260000, profit: 62000 },
  { month: "Jan", revenue: 230000, profit: 55000 },
  { month: "Feb", revenue: 245000, profit: 58000 },
];

export const topProducts = [
  { name: "Tata Salt 1kg", category: "Grocery", sold: 120, revenue: 2400 },
  { name: "Amul Butter 500g", category: "Dairy", sold: 85, revenue: 4250 },
  { name: "Fortune Oil 1L", category: "Grocery", sold: 65, revenue: 9750 },
  { name: "Parle-G Biscuit", category: "Snacks", sold: 200, revenue: 2000 },
  { name: "Surf Excel 1kg", category: "Cleaning", sold: 45, revenue: 5850 },
];

export const inventoryItems = [
  { id: "1", name: "Tata Salt 1kg", category: "Grocery", purchasePrice: 18, sellingPrice: 20, stock: 45, status: "In Stock" },
  { id: "2", name: "Amul Butter 500g", category: "Dairy", purchasePrice: 42, sellingPrice: 50, stock: 12, status: "In Stock" },
  { id: "3", name: "Fortune Oil 1L", category: "Grocery", purchasePrice: 130, sellingPrice: 150, stock: 3, status: "Low Stock" },
  { id: "4", name: "Parle-G Biscuit", category: "Snacks", purchasePrice: 8, sellingPrice: 10, stock: 80, status: "In Stock" },
  { id: "5", name: "Surf Excel 1kg", category: "Cleaning", purchasePrice: 110, sellingPrice: 130, stock: 2, status: "Low Stock" },
  { id: "6", name: "Maggi Noodles", category: "Snacks", purchasePrice: 12, sellingPrice: 14, stock: 50, status: "In Stock" },
  { id: "7", name: "Colgate 200g", category: "Personal Care", purchasePrice: 85, sellingPrice: 100, stock: 1, status: "Low Stock" },
  { id: "8", name: "Dettol Soap", category: "Personal Care", purchasePrice: 35, sellingPrice: 42, stock: 25, status: "In Stock" },
  { id: "9", name: "Brooke Bond Tea 250g", category: "Grocery", purchasePrice: 90, sellingPrice: 110, stock: 4, status: "Low Stock" },
  { id: "10", name: "Vim Bar", category: "Cleaning", purchasePrice: 18, sellingPrice: 22, stock: 30, status: "In Stock" },
];

export const salesData = [
  { id: "INV-001", date: "2026-02-27", customer: "Rajesh Patel", paymentType: "Cash", amount: 1250, status: "Completed" },
  { id: "INV-002", date: "2026-02-27", customer: "Suresh Mehta", paymentType: "UPI", amount: 860, status: "Completed" },
  { id: "INV-003", date: "2026-02-27", customer: "Priya Shah", paymentType: "Credit", amount: 2100, status: "Pending" },
  { id: "INV-004", date: "2026-02-26", customer: "Walk-in Customer", paymentType: "Cash", amount: 450, status: "Completed" },
  { id: "INV-005", date: "2026-02-26", customer: "Amit Desai", paymentType: "UPI", amount: 3200, status: "Completed" },
  { id: "INV-006", date: "2026-02-26", customer: "Neha Joshi", paymentType: "Credit", amount: 1800, status: "Pending" },
  { id: "INV-007", date: "2026-02-25", customer: "Kiran Sharma", paymentType: "Cash", amount: 920, status: "Completed" },
  { id: "INV-008", date: "2026-02-25", customer: "Meena Patel", paymentType: "UPI", amount: 1560, status: "Completed" },
];

export const creditCustomers = [
  { id: "1", name: "Priya Shah", phone: "98765 43210", pending: 8500, dueDate: "2026-03-05", status: "Overdue", riskScore: "red" as const, onTimeCount: 2, lateCount: 5, totalTransactions: 7 },
  { id: "2", name: "Neha Joshi", phone: "98765 12345", pending: 4200, dueDate: "2026-03-10", status: "Due Soon", riskScore: "yellow" as const, onTimeCount: 6, lateCount: 3, totalTransactions: 9 },
  { id: "3", name: "Rajesh Kumar", phone: "91234 56789", pending: 12000, dueDate: "2026-03-15", status: "Normal", riskScore: "green" as const, onTimeCount: 10, lateCount: 1, totalTransactions: 11 },
  { id: "4", name: "Suresh Mehta", phone: "99887 76543", pending: 3500, dueDate: "2026-02-28", status: "Overdue", riskScore: "red" as const, onTimeCount: 3, lateCount: 8, totalTransactions: 11 },
  { id: "5", name: "Amit Desai", phone: "97654 32100", pending: 6800, dueDate: "2026-03-20", status: "Normal", riskScore: "green" as const, onTimeCount: 12, lateCount: 0, totalTransactions: 12 },
  { id: "6", name: "Kavita Patel", phone: "98123 45678", pending: 10600, dueDate: "2026-03-02", status: "Due Soon", riskScore: "yellow" as const, onTimeCount: 5, lateCount: 4, totalTransactions: 9 },
];

export const categories = ["Grocery", "Dairy", "Snacks", "Cleaning", "Personal Care", "Beverages", "Stationery"];

export const formatCurrency = (amount: number) => {
  return `₹${amount.toLocaleString("en-IN")}`;
};

// Expense data
export interface Expense {
  id: string;
  name: string;
  amount: number;
  category: string;
  date: string;
}

export const expenseCategories = ["Rent", "Electricity", "Salary", "Transport", "Other"];

export const expensesData: Expense[] = [
  { id: "e1", name: "Shop Rent", amount: 15000, category: "Rent", date: "2026-03-01" },
  { id: "e2", name: "Electricity Bill", amount: 3200, category: "Electricity", date: "2026-02-28" },
  { id: "e3", name: "Helper Salary", amount: 8000, category: "Salary", date: "2026-03-01" },
  { id: "e4", name: "Goods Transport", amount: 1500, category: "Transport", date: "2026-02-27" },
  { id: "e5", name: "Packaging Material", amount: 800, category: "Other", date: "2026-02-26" },
];

// Daily summary data
export const dailySummary = {
  totalSales: 12450,
  totalProfit: 3200,
  creditGiven: 3900,
  cashReceived: 5750,
  upiReceived: 2800,
  pendingCollection: 45600,
  totalExpenses: 28500,
  realProfit: 3200 - 950, // daily share of expenses
};

// Low stock items with reorder suggestions
export const lowStockAlerts = inventoryItems
  .filter((i) => i.status === "Low Stock")
  .map((item) => ({
    ...item,
    avgDailySales: Math.ceil(Math.random() * 5 + 2),
    suggestedReorder: Math.ceil(Math.random() * 20 + 10),
  }));

// Profit analytics
export const topProfitProducts = [
  { name: "Fortune Oil 1L", profit: 20, margin: 13.3, sold: 65 },
  { name: "Surf Excel 1kg", profit: 20, margin: 15.4, sold: 45 },
  { name: "Colgate 200g", profit: 15, margin: 15.0, sold: 30 },
  { name: "Brooke Bond Tea 250g", profit: 20, margin: 18.2, sold: 22 },
  { name: "Amul Butter 500g", profit: 8, margin: 16.0, sold: 85 },
];

export const worstProducts = [
  { name: "Parle-G Biscuit", profit: 2, margin: 20.0, sold: 200, totalProfit: 400 },
  { name: "Tata Salt 1kg", profit: 2, margin: 10.0, sold: 120, totalProfit: 240 },
];

export const lastWeekSales = [
  { day: "Mon", sales: 7200 },
  { day: "Tue", sales: 10100 },
  { day: "Wed", sales: 8500 },
  { day: "Thu", sales: 13000 },
  { day: "Fri", sales: 9800 },
  { day: "Sat", sales: 16200 },
  { day: "Sun", sales: 6500 },
];

export const thisWeekTotal = salesLast7Days.reduce((s, d) => s + d.sales, 0);
export const lastWeekTotal = lastWeekSales.reduce((s, d) => s + d.sales, 0);
export const weekGrowth = ((thisWeekTotal - lastWeekTotal) / lastWeekTotal * 100).toFixed(1);

export const creditRecoveryRate = 72; // percentage

export const smartSuggestions = [
  { type: "trend" as const, message: "Butter selling fast this week — stock up!", icon: "📈" },
  { type: "warning" as const, message: "Milk margin is only 7% — consider price increase", icon: "⚠️" },
  { type: "alert" as const, message: "Customer Ramesh overdue by 5 days — ₹3,500 pending", icon: "🔴" },
  { type: "trend" as const, message: "Weekend sales are 40% higher — plan stock accordingly", icon: "📊" },
];
