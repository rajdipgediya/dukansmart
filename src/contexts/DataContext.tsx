import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { 
  inventoryItems as initialInventory, 
  salesData as initialSales, 
  creditCustomers as initialCredits, 
  expensesData as initialExpenses,
  type Expense 
} from "@/lib/mockData";
import { toast } from "sonner";

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  purchasePrice: number;
  sellingPrice: number;
  stock: number;
  status: "In Stock" | "Low Stock";
}

export interface Sale {
  id: string;
  date: string;
  customer: string;
  paymentType: "Cash" | "UPI" | "Credit";
  amount: number;
  status: "Completed" | "Pending";
  items?: { id: string; name: string; price: number; qty: number }[];
}

export interface CreditCustomer {
  id: string;
  name: string;
  phone: string;
  pending: number;
  dueDate: string;
  status: "Overdue" | "Due Soon" | "Normal";
  riskScore: "green" | "yellow" | "red";
  onTimeCount: number;
  lateCount: number;
  totalTransactions: number;
}

export interface ShopInfo {
  shop_name: string;
  owner_name: string;
  phone: string;
  address: string;
}

interface DataContextType {
  inventory: InventoryItem[];
  sales: Sale[];
  expenses: Expense[];
  credits: CreditCustomer[];
  shopInfo: ShopInfo;
  
  // Inventory actions
  addProduct: (name: string, category: string, purchasePrice: number, sellingPrice: number, stock: number) => void;
  updateProduct: (id: string, updated: Partial<InventoryItem>) => void;
  deleteProduct: (id: string) => void;
  
  // Sales POS actions
  addSale: (cartItems: { id: string; name: string; price: number; qty: number; emoji?: string }[], paymentMethod: "Cash" | "UPI" | "Credit", customerName?: string, customerPhone?: string) => void;
  
  // Credit actions
  addCreditCustomer: (name: string, phone: string, pendingAmount: number, dueDate: string) => void;
  recordCreditPayment: (customerId: string, amount: number, paymentMethod: "Cash" | "UPI") => void;
  
  // Expense actions
  addExpense: (name: string, amount: number, category: string, date: string) => void;
  
  // Shop actions
  updateShopInfo: (info: ShopInfo) => void;
  
  // Backup actions
  importBackup: (backupData: any) => boolean;
  resetAllData: () => void;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [credits, setCredits] = useState<CreditCustomer[]>([]);
  const [shopInfo, setShopInfo] = useState<ShopInfo>({
    shop_name: "Sharma General Store",
    owner_name: "Ramesh Sharma",
    phone: "+91 98765 43210",
    address: "Ring Road, Surat, Gujarat"
  });

  // Load initial data from localStorage or mockData
  useEffect(() => {
    const localInv = localStorage.getItem("dukaansmart_inventory");
    const localSales = localStorage.getItem("dukaansmart_sales");
    const localExpenses = localStorage.getItem("dukaansmart_expenses");
    const localCredits = localStorage.getItem("dukaansmart_credits");
    const localShop = localStorage.getItem("dukaansmart_shop");

    if (localInv) setInventory(JSON.parse(localInv));
    else {
      setInventory(initialInventory.map(item => ({
        ...item,
        status: item.stock <= 5 ? "Low Stock" : "In Stock"
      })) as InventoryItem[]);
    }

    if (localSales) setSales(JSON.parse(localSales));
    else setSales(initialSales as Sale[]);

    if (localExpenses) setExpenses(JSON.parse(localExpenses));
    else setExpenses(initialExpenses);

    if (localCredits) setCredits(JSON.parse(localCredits));
    else setCredits(initialCredits as CreditCustomer[]);

    if (localShop) setShopInfo(JSON.parse(localShop));
  }, []);

  // Save helpers
  const saveInventory = (data: InventoryItem[]) => {
    setInventory(data);
    localStorage.setItem("dukaansmart_inventory", JSON.stringify(data));
  };

  const saveSales = (data: Sale[]) => {
    setSales(data);
    localStorage.setItem("dukaansmart_sales", JSON.stringify(data));
  };

  const saveExpenses = (data: Expense[]) => {
    setExpenses(data);
    localStorage.setItem("dukaansmart_expenses", JSON.stringify(data));
  };

  const saveCredits = (data: CreditCustomer[]) => {
    setCredits(data);
    localStorage.setItem("dukaansmart_credits", JSON.stringify(data));
  };

  const saveShopInfo = (data: ShopInfo) => {
    setShopInfo(data);
    localStorage.setItem("dukaansmart_shop", JSON.stringify(data));
  };

  // Inventory actions
  const addProduct = (name: string, category: string, purchasePrice: number, sellingPrice: number, stock: number) => {
    const newItem: InventoryItem = {
      id: `prod-${Date.now()}`,
      name,
      category,
      purchasePrice,
      sellingPrice,
      stock,
      status: stock <= 5 ? "Low Stock" : "In Stock"
    };
    const updated = [newItem, ...inventory];
    saveInventory(updated);
    toast.success(`Product "${name}" added!`);
  };

  const updateProduct = (id: string, updatedFields: Partial<InventoryItem>) => {
    const updated = inventory.map(item => {
      if (item.id === id) {
        const next = { ...item, ...updatedFields };
        if (updatedFields.stock !== undefined) {
          next.status = next.stock <= 5 ? "Low Stock" : "In Stock";
        }
        return next;
      }
      return item;
    });
    saveInventory(updated);
    toast.success("Product updated successfully!");
  };

  const deleteProduct = (id: string) => {
    const updated = inventory.filter(item => item.id !== id);
    saveInventory(updated);
    toast.success("Product removed from catalog");
  };

  // Sales and POS
  const addSale = (
    cartItems: { id: string; name: string; price: number; qty: number; emoji?: string }[],
    paymentMethod: "Cash" | "UPI" | "Credit",
    customerName = "Walk-in Customer",
    customerPhone = ""
  ) => {
    const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    const invoiceId = `INV-${Date.now().toString().slice(-6)}`;
    
    // 1. Deduct Stock Levels in Inventory
    const updatedInventory = inventory.map(item => {
      // Find matches in POS cart
      const cartMatch = cartItems.find(c => c.name === item.name || c.id === item.id);
      if (cartMatch) {
        const nextStock = Math.max(0, item.stock - cartMatch.qty);
        return {
          ...item,
          stock: nextStock,
          status: nextStock <= 5 ? "Low Stock" : "In Stock"
        } as InventoryItem;
      }
      return item;
    });
    saveInventory(updatedInventory);

    // 2. Append to Sales History
    const newSale: Sale = {
      id: invoiceId,
      date: new Date().toISOString().split("T")[0],
      customer: customerName,
      paymentType: paymentMethod,
      amount: totalAmount,
      status: paymentMethod === "Credit" ? "Pending" : "Completed",
      items: cartItems.map(c => ({ id: c.id, name: c.name, price: c.price, qty: c.qty }))
    };
    saveSales([newSale, ...sales]);

    // 3. Update Credit Customer Ledger if payment type is "Credit"
    if (paymentMethod === "Credit") {
      const existingCustomerIndex = credits.findIndex(
        c => c.name.toLowerCase() === customerName.toLowerCase() || (customerPhone && c.phone === customerPhone)
      );

      if (existingCustomerIndex > -1) {
        const updatedCredits = [...credits];
        const current = updatedCredits[existingCustomerIndex];
        updatedCredits[existingCustomerIndex] = {
          ...current,
          pending: current.pending + totalAmount,
          totalTransactions: current.totalTransactions + 1,
          status: "Due Soon",
          riskScore: (current.pending + totalAmount) > 10000 ? "red" : "yellow"
        };
        saveCredits(updatedCredits);
      } else {
        // Create new credit customer ledger
        const newCreditCustomer: CreditCustomer = {
          id: `cred-${Date.now()}`,
          name: customerName,
          phone: customerPhone || "Not Provided",
          pending: totalAmount,
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 14 days due
          status: "Normal",
          riskScore: totalAmount > 10000 ? "red" : totalAmount > 5000 ? "yellow" : "green",
          onTimeCount: 0,
          lateCount: 0,
          totalTransactions: 1
        };
        saveCredits([newCreditCustomer, ...credits]);
      }
    }

    toast.success(`Invoice ${invoiceId} processed!`);
  };

  // Credit Ledger Actions (Payments)
  const addCreditCustomer = (name: string, phone: string, pendingAmount: number, dueDate: string) => {
    const newCred: CreditCustomer = {
      id: `cred-${Date.now()}`,
      name,
      phone,
      pending: pendingAmount,
      dueDate,
      status: "Normal",
      riskScore: pendingAmount > 10000 ? "red" : pendingAmount > 5000 ? "yellow" : "green",
      onTimeCount: 0,
      lateCount: 0,
      totalTransactions: pendingAmount > 0 ? 1 : 0
    };
    saveCredits([newCred, ...credits]);
    
    if (pendingAmount > 0) {
      // Create a pending credit sales record
      const invoiceId = `INV-${Date.now().toString().slice(-6)}`;
      const newSale: Sale = {
        id: invoiceId,
        date: new Date().toISOString().split("T")[0],
        customer: name,
        paymentType: "Credit",
        amount: pendingAmount,
        status: "Pending"
      };
      saveSales([newSale, ...sales]);
    }

    toast.success(`Ledger for ${name} initialized!`);
  };

  const recordCreditPayment = (customerId: string, amount: number, paymentMethod: "Cash" | "UPI") => {
    const updatedCredits = credits.map(c => {
      if (c.id === customerId) {
        const nextPending = Math.max(0, c.pending - amount);
        const status = nextPending === 0 ? "Normal" : c.status;
        const riskScore = nextPending === 0 ? "green" : nextPending > 10000 ? "red" : "yellow";
        return {
          ...c,
          pending: nextPending,
          onTimeCount: c.onTimeCount + 1,
          status,
          riskScore
        } as CreditCustomer;
      }
      return c;
    });
    saveCredits(updatedCredits);

    // Add a sale recovery record to show income
    const customer = credits.find(c => c.id === customerId);
    const invoiceId = `REC-${Date.now().toString().slice(-6)}`;
    const newSale: Sale = {
      id: invoiceId,
      date: new Date().toISOString().split("T")[0],
      customer: customer ? `${customer.name} (Credit Recovery)` : "Credit Recovery",
      paymentType: paymentMethod,
      amount: amount,
      status: "Completed"
    };
    saveSales([newSale, ...sales]);

    toast.success(`Payment of ₹${amount} recorded! Balance updated.`);
  };

  // Expenses
  const addExpense = (name: string, amount: number, category: string, date: string) => {
    const newExpense: Expense = {
      id: `exp-${Date.now()}`,
      name,
      amount,
      category,
      date
    };
    saveExpenses([newExpense, ...expenses]);
    toast.success(`Expense "${name}" added!`);
  };

  // Shop details
  const updateShopInfo = (info: ShopInfo) => {
    saveShopInfo(info);
    toast.success("Shop information updated successfully!");
  };

  // Backup and recovery
  const importBackup = (backupData: any): boolean => {
    try {
      if (!backupData || typeof backupData !== "object") return false;
      
      if (backupData.inventory) saveInventory(backupData.inventory);
      if (backupData.sales) saveSales(backupData.sales);
      if (backupData.expenses) saveExpenses(backupData.expenses);
      if (backupData.credits) saveCredits(backupData.credits);
      if (backupData.shopInfo) saveShopInfo(backupData.shopInfo);
      
      toast.success("Backup successfully restored!");
      return true;
    } catch {
      toast.error("Invalid backup file structure.");
      return false;
    }
  };

  const resetAllData = () => {
    localStorage.removeItem("dukaansmart_inventory");
    localStorage.removeItem("dukaansmart_sales");
    localStorage.removeItem("dukaansmart_expenses");
    localStorage.removeItem("dukaansmart_credits");
    localStorage.removeItem("dukaansmart_shop");
    
    setInventory(initialInventory.map(item => ({
      ...item,
      status: item.stock <= 5 ? "Low Stock" : "In Stock"
    })) as InventoryItem[]);
    setSales(initialSales as Sale[]);
    setExpenses(initialExpenses);
    setCredits(initialCredits as CreditCustomer[]);
    setShopInfo({
      shop_name: "Sharma General Store",
      owner_name: "Ramesh Sharma",
      phone: "+91 98765 43210",
      address: "Ring Road, Surat, Gujarat"
    });
    toast.success("All settings reset to defaults.");
  };

  return (
    <DataContext.Provider
      value={{
        inventory,
        sales,
        expenses,
        credits,
        shopInfo,
        addProduct,
        updateProduct,
        deleteProduct,
        addSale,
        addCreditCustomer,
        recordCreditPayment,
        addExpense,
        updateShopInfo,
        importBackup,
        resetAllData
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
