import { Bell, User, ChevronDown, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";

export function TopNavbar() {
  const { user, isSuperAdmin, logout } = useAuth();
  const { shopInfo } = useData();
  
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-blue-100 bg-[#f4f7fa]/40 backdrop-blur-sm px-5">
      <div>
        <h2 className="text-xs font-bold text-zinc-900 leading-tight">
          {isSuperAdmin ? "Super Admin Console" : shopInfo.shop_name}
        </h2>
        <p className="text-[9px] text-zinc-400 font-medium mt-0.5">{today}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="relative rounded-lg p-1.5 hover:bg-blue-50/50 transition-all duration-200 group">
          <Bell className="h-4 w-4 text-zinc-550 group-hover:text-blue-600 transition-colors" />
          <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
        </button>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1.5 rounded-lg p-1 hover:bg-blue-50/50 transition-all duration-200 outline-none">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white text-[10px] font-semibold shadow-sm">
              {user?.name ? getInitials(user.name) : "US"}
            </div>
            <span className="hidden text-[11px] font-bold text-zinc-700 sm:inline">
              {user?.name || "Store User"}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-zinc-450" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44 rounded-lg border-blue-100 p-1 shadow-lg shadow-blue-150/10 bg-white">
            <DropdownMenuItem className="rounded-md text-[11px] py-1.5 text-zinc-700 focus:bg-blue-50/40 focus:text-blue-700">
              <User className="mr-1.5 h-3.5 w-3.5" /> Profile Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-zinc-100" />
            <DropdownMenuItem 
              onClick={logout}
              className="rounded-md text-[11px] py-1.5 text-red-600 focus:bg-red-50/50 focus:text-red-700"
            >
              <LogOut className="mr-1.5 h-3.5 w-3.5" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
export default TopNavbar;
