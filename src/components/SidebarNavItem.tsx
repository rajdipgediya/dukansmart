import { NavLink as RouterNavLink } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarNavItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
  collapsed?: boolean;
}

export function SidebarNavItem({ to, icon: Icon, label, collapsed }: SidebarNavItemProps) {
  return (
    <RouterNavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center text-[11px] font-semibold tracking-wide transition-all duration-200 select-none group relative",
          collapsed
            ? "w-8 h-8 justify-center rounded-lg mx-auto"
            : "w-full gap-2.5 rounded-lg px-2.5 py-1.5",
          isActive
            ? "bg-blue-600 text-white shadow-sm shadow-blue-600/10"
            : "text-zinc-550 hover:text-blue-600 hover:bg-blue-50/80"
        )
      }
    >
      <Icon className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-105" />
      {!collapsed && <span className="animate-fade-in truncate">{label}</span>}
    </RouterNavLink>
  );
}
export default SidebarNavItem;
