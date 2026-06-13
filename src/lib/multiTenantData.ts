// Multi-tenant mock data for DukaanSmart

export interface Shop {
  id: string;
  shop_name: string;
  owner_name: string;
  subscription_plan: "basic" | "premium";
  status: "active" | "suspended";
  created_at: string;
}

export interface AppUser {
  id: string;
  email: string;
  password: string;
  shop_id: string | null;
  role: "super_admin" | "shopkeeper";
  full_name: string;
  mobile_number: string;
}

export interface Product {
  id: string;
  shop_id: string;
  product_name: string;
  sku: string;
  category: string;
  purchase_price: number;
  selling_price: number;
  stock_quantity: number;
  low_stock_level: number;
  gst_percentage: number;
  image_url: string;
  status: "active" | "inactive";
  created_at: string;
}

export const shops: Shop[] = [
  { id: "shop-1", shop_name: "Rajesh Kirana Store", owner_name: "Rajesh Patel", subscription_plan: "premium", status: "active", created_at: "2025-06-15" },
  { id: "shop-2", shop_name: "Mehta Medical", owner_name: "Suresh Mehta", subscription_plan: "basic", status: "active", created_at: "2025-08-20" },
  { id: "shop-3", shop_name: "Priya Fashion Hub", owner_name: "Priya Shah", subscription_plan: "premium", status: "active", created_at: "2025-09-10" },
  { id: "shop-4", shop_name: "Shah Hardware", owner_name: "Amit Shah", subscription_plan: "basic", status: "suspended", created_at: "2025-11-05" },
  { id: "shop-5", shop_name: "Desai General Store", owner_name: "Neha Desai", subscription_plan: "basic", status: "active", created_at: "2026-01-12" },
];

export const users: AppUser[] = [
  { id: "user-admin", email: "admin@dukaansmart.com", password: "admin123", shop_id: null, role: "super_admin", full_name: "Super Admin", mobile_number: "99999 00000" },
  { id: "user-1", email: "rajesh@shop.com", password: "shop123", shop_id: "shop-1", role: "shopkeeper", full_name: "Rajesh Patel", mobile_number: "98765 43210" },
  { id: "user-2", email: "suresh@shop.com", password: "shop123", shop_id: "shop-2", role: "shopkeeper", full_name: "Suresh Mehta", mobile_number: "98765 12345" },
  { id: "user-3", email: "priya@shop.com", password: "shop123", shop_id: "shop-3", role: "shopkeeper", full_name: "Priya Shah", mobile_number: "91234 56789" },
  { id: "user-4", email: "amit@shop.com", password: "shop123", shop_id: "shop-4", role: "shopkeeper", full_name: "Amit Shah", mobile_number: "99887 76543" },
  { id: "user-5", email: "neha@shop.com", password: "shop123", shop_id: "shop-5", role: "shopkeeper", full_name: "Neha Desai", mobile_number: "97654 32100" },
];

export const shopCategories: Record<string, string[]> = {
  "shop-1": ["Grocery", "Dairy", "Snacks", "Cleaning", "Personal Care", "Beverages"],
  "shop-2": ["Medicines", "First Aid", "Supplements", "Baby Care", "Personal Care"],
  "shop-3": ["Men's Wear", "Women's Wear", "Kids Wear", "Accessories", "Footwear"],
  "shop-4": ["Tools", "Plumbing", "Electrical", "Paints", "Fasteners"],
  "shop-5": ["Grocery", "Dairy", "Snacks", "Stationery", "Cleaning"],
};

export const allProducts: Product[] = [
  // Shop 1 - Kirana Store
  { id: "p1-1", shop_id: "shop-1", product_name: "Tata Salt 1kg", sku: "KS-001", category: "Grocery", purchase_price: 18, selling_price: 20, stock_quantity: 45, low_stock_level: 10, gst_percentage: 5, image_url: "", status: "active", created_at: "2025-07-01" },
  { id: "p1-2", shop_id: "shop-1", product_name: "Amul Butter 500g", sku: "KS-002", category: "Dairy", purchase_price: 42, selling_price: 50, stock_quantity: 12, low_stock_level: 5, gst_percentage: 5, image_url: "", status: "active", created_at: "2025-07-01" },
  { id: "p1-3", shop_id: "shop-1", product_name: "Fortune Oil 1L", sku: "KS-003", category: "Grocery", purchase_price: 130, selling_price: 150, stock_quantity: 3, low_stock_level: 5, gst_percentage: 5, image_url: "", status: "active", created_at: "2025-07-01" },
  { id: "p1-4", shop_id: "shop-1", product_name: "Parle-G Biscuit", sku: "KS-004", category: "Snacks", purchase_price: 8, selling_price: 10, stock_quantity: 80, low_stock_level: 20, gst_percentage: 18, image_url: "", status: "active", created_at: "2025-07-02" },
  { id: "p1-5", shop_id: "shop-1", product_name: "Surf Excel 1kg", sku: "KS-005", category: "Cleaning", purchase_price: 110, selling_price: 130, stock_quantity: 2, low_stock_level: 5, gst_percentage: 18, image_url: "", status: "active", created_at: "2025-07-02" },
  { id: "p1-6", shop_id: "shop-1", product_name: "Colgate 200g", sku: "KS-006", category: "Personal Care", purchase_price: 85, selling_price: 100, stock_quantity: 1, low_stock_level: 5, gst_percentage: 18, image_url: "", status: "active", created_at: "2025-07-03" },
  { id: "p1-7", shop_id: "shop-1", product_name: "Maggi Noodles", sku: "KS-007", category: "Snacks", purchase_price: 12, selling_price: 14, stock_quantity: 50, low_stock_level: 15, gst_percentage: 18, image_url: "", status: "active", created_at: "2025-07-03" },
  { id: "p1-8", shop_id: "shop-1", product_name: "Brooke Bond Tea 250g", sku: "KS-008", category: "Beverages", purchase_price: 90, selling_price: 110, stock_quantity: 4, low_stock_level: 5, gst_percentage: 5, image_url: "", status: "active", created_at: "2025-07-04" },
  { id: "p1-9", shop_id: "shop-1", product_name: "Dettol Soap", sku: "", category: "Personal Care", purchase_price: 35, selling_price: 42, stock_quantity: 25, low_stock_level: 8, gst_percentage: 18, image_url: "", status: "active", created_at: "2025-07-05" },
  { id: "p1-10", shop_id: "shop-1", product_name: "Vim Bar", sku: "", category: "Cleaning", purchase_price: 18, selling_price: 22, stock_quantity: 30, low_stock_level: 10, gst_percentage: 18, image_url: "", status: "inactive", created_at: "2025-07-06" },

  // Shop 2 - Medical Store
  { id: "p2-1", shop_id: "shop-2", product_name: "Paracetamol 500mg", sku: "MED-001", category: "Medicines", purchase_price: 15, selling_price: 25, stock_quantity: 200, low_stock_level: 50, gst_percentage: 12, image_url: "", status: "active", created_at: "2025-09-01" },
  { id: "p2-2", shop_id: "shop-2", product_name: "Crocin Advance", sku: "MED-002", category: "Medicines", purchase_price: 20, selling_price: 30, stock_quantity: 150, low_stock_level: 30, gst_percentage: 12, image_url: "", status: "active", created_at: "2025-09-01" },
  { id: "p2-3", shop_id: "shop-2", product_name: "Band-Aid Pack", sku: "MED-003", category: "First Aid", purchase_price: 40, selling_price: 55, stock_quantity: 60, low_stock_level: 15, gst_percentage: 5, image_url: "", status: "active", created_at: "2025-09-02" },
  { id: "p2-4", shop_id: "shop-2", product_name: "Dettol Antiseptic 100ml", sku: "MED-004", category: "First Aid", purchase_price: 45, selling_price: 60, stock_quantity: 3, low_stock_level: 10, gst_percentage: 18, image_url: "", status: "active", created_at: "2025-09-02" },
  { id: "p2-5", shop_id: "shop-2", product_name: "Vitamin C Tablets", sku: "MED-005", category: "Supplements", purchase_price: 120, selling_price: 180, stock_quantity: 8, low_stock_level: 10, gst_percentage: 12, image_url: "", status: "active", created_at: "2025-09-03" },
  { id: "p2-6", shop_id: "shop-2", product_name: "Baby Lotion 200ml", sku: "", category: "Baby Care", purchase_price: 90, selling_price: 130, stock_quantity: 20, low_stock_level: 5, gst_percentage: 18, image_url: "", status: "active", created_at: "2025-09-04" },

  // Shop 3 - Fashion Store
  { id: "p3-1", shop_id: "shop-3", product_name: "Men's Cotton Shirt", sku: "FSH-001", category: "Men's Wear", purchase_price: 350, selling_price: 599, stock_quantity: 25, low_stock_level: 5, gst_percentage: 5, image_url: "", status: "active", created_at: "2025-10-01" },
  { id: "p3-2", shop_id: "shop-3", product_name: "Women's Kurti", sku: "FSH-002", category: "Women's Wear", purchase_price: 280, selling_price: 499, stock_quantity: 30, low_stock_level: 8, gst_percentage: 5, image_url: "", status: "active", created_at: "2025-10-01" },
  { id: "p3-3", shop_id: "shop-3", product_name: "Kids T-Shirt", sku: "FSH-003", category: "Kids Wear", purchase_price: 150, selling_price: 299, stock_quantity: 2, low_stock_level: 5, gst_percentage: 5, image_url: "", status: "active", created_at: "2025-10-02" },
  { id: "p3-4", shop_id: "shop-3", product_name: "Leather Belt", sku: "FSH-004", category: "Accessories", purchase_price: 200, selling_price: 399, stock_quantity: 15, low_stock_level: 3, gst_percentage: 18, image_url: "", status: "active", created_at: "2025-10-03" },

  // Shop 5 - General Store
  { id: "p5-1", shop_id: "shop-5", product_name: "Rice 5kg Bag", sku: "GEN-001", category: "Grocery", purchase_price: 250, selling_price: 300, stock_quantity: 20, low_stock_level: 5, gst_percentage: 0, image_url: "", status: "active", created_at: "2026-01-20" },
  { id: "p5-2", shop_id: "shop-5", product_name: "Notebook Pack", sku: "GEN-002", category: "Stationery", purchase_price: 60, selling_price: 80, stock_quantity: 100, low_stock_level: 20, gst_percentage: 12, image_url: "", status: "active", created_at: "2026-01-20" },
  { id: "p5-3", shop_id: "shop-5", product_name: "Pen Set (5 pcs)", sku: "", category: "Stationery", purchase_price: 25, selling_price: 40, stock_quantity: 4, low_stock_level: 10, gst_percentage: 12, image_url: "", status: "active", created_at: "2026-01-21" },
];

export const platformStats = {
  totalShops: shops.length,
  activeShops: shops.filter((s) => s.status === "active").length,
  totalProducts: allProducts.length,
  totalRevenue: 1_850_000,
  monthlyGrowth: 12.5,
};

export const shopSalesData: Record<string, number> = {
  "shop-1": 485000,
  "shop-2": 320000,
  "shop-3": 590000,
  "shop-4": 0,
  "shop-5": 125000,
};

export const gstOptions = [0, 5, 12, 18, 28];

export const formatCurrency = (amount: number) =>
  `₹${amount.toLocaleString("en-IN")}`;
