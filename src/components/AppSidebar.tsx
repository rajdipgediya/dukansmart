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
import { useData } from "@/contexts/DataContext";

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
  const { isSuperAdmin, logout } = useAuth();
  const { shopInfo } = useData();
  const navItems = isSuperAdmin ? adminNav : shopkeeperNav;

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-30 flex h-screen flex-col border-r border-blue-100 bg-[#f4f7fa] transition-all duration-300 ease-in-out shadow-sm select-none",
        collapsed ? "w-14" : "w-48"
      )}
    >
      {/* Hide scrollbars style */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Brand Header & Toggle Button at the top */}
      <div 
        className={cn(
          "flex h-14 items-center border-b border-blue-50/50",
          collapsed ? "justify-center px-0" : "justify-between px-3"
        )}
      >
        <div className={cn("flex items-center min-w-0", collapsed ? "justify-center" : "gap-2 flex-1")}>
          <button
            onClick={collapsed ? onToggle : undefined}
            disabled={!collapsed}
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 shadow-sm transition-all duration-200",
              collapsed ? "cursor-pointer hover:bg-blue-700 active:scale-95" : ""
            )}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4 text-white" />
            ) : (
              <Store className="h-4 w-4 text-white" />
            )}
          </button>
          {!collapsed && (
            <div className="min-w-0 flex-1 overflow-hidden">
              <span className="block text-xs font-bold text-zinc-900 leading-tight tracking-tight">
                DukaanSmart
              </span>
              <span className="block text-[8px] font-medium text-zinc-400 truncate">
                {shopInfo.shop_name}
              </span>
              {isSuperAdmin && (
                <span className="block text-[8px] font-semibold text-blue-600 truncate uppercase tracking-wider">
                  Super Admin
                </span>
              )}
            </div>
          )}
        </div>
        
        {!collapsed && (
          <button
            onClick={onToggle}
            className="flex h-6 w-6 items-center justify-center rounded-md border border-blue-100/60 text-zinc-400 hover:text-blue-600 hover:bg-blue-50/50 transition-all active:scale-95 shrink-0 ml-1"
            title="Collapse Sidebar"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav 
        className={cn(
          "flex-1 space-y-1 overflow-y-auto no-scrollbar",
          collapsed ? "px-0 py-2" : "p-2"
        )}
      >
        {navItems.map((item) => (
          <SidebarNavItem key={item.to} {...item} collapsed={collapsed} />
        ))}
      </nav>

      {/* Logout */}
      <div className={cn("border-t border-blue-50/40", collapsed ? "p-0 py-2" : "p-2")}>
        <button
          onClick={logout}
          className={cn(
            "flex items-center text-[11px] font-semibold tracking-wide text-zinc-500 hover:text-red-650 hover:bg-red-50/50 transition-all duration-200",
            collapsed ? "w-8 h-8 justify-center rounded-lg mx-auto" : "w-full gap-2.5 rounded-lg px-2.5 py-1.5"
          )}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
export default AppSidebar;
