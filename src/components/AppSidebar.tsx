import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Store,
  Zap,
  BoxesIcon,
  LogOut,
  Wallet,
  ClipboardList,
} from "lucide-react";
import { SidebarNavItem } from "./SidebarNavItem";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const shopkeeperNav = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/fast-sale", icon: Zap, label: "⚡ Fast Sale" },
  { to: "/sales", icon: ShoppingCart, label: "Sales" },
  { to: "/products", icon: BoxesIcon, label: "Products" },
  { to: "/inventory", icon: Package, label: "Inventory" },
  { to: "/credit", icon: Users, label: "Credit" },
  { to: "/expenses", icon: Wallet, label: "Expenses" },
  { to: "/daily-summary", icon: ClipboardList, label: "Daily Summary" },
  { to: "/reports", icon: BarChart3, label: "Reports" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

const adminNav = [
  { to: "/", icon: LayoutDashboard, label: "All Shops" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  const { isSuperAdmin, shop, logout } = useAuth();
  const navItems = isSuperAdmin ? adminNav : shopkeeperNav;

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-30 flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-200",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-4">
        <Store className="h-7 w-7 shrink-0 text-sidebar-primary" />
        {!collapsed && (
          <div className="min-w-0">
            <span className="block text-lg font-bold text-sidebar-primary-foreground leading-tight">
              DukaanSmart
            </span>
            {shop && (
              <span className="block text-[10px] text-sidebar-foreground truncate">
                {shop.shop_name}
              </span>
            )}
            {isSuperAdmin && (
              <span className="block text-[10px] text-sidebar-primary truncate">
                Super Admin
              </span>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => (
          <SidebarNavItem key={item.to} {...item} collapsed={collapsed} />
        ))}
      </nav>

      {/* Logout */}
      <button
        onClick={logout}
        className="flex h-10 items-center gap-2 border-t border-sidebar-border px-4 text-sidebar-foreground hover:text-destructive transition-colors text-sm"
      >
        <LogOut className="h-4 w-4 shrink-0" />
        {!collapsed && <span>Logout</span>}
      </button>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="flex h-12 items-center justify-center border-t border-sidebar-border text-sidebar-foreground hover:text-sidebar-primary-foreground transition-colors"
      >
        {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
      </button>
    </aside>
  );
}
