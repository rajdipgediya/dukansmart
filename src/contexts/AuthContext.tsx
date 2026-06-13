import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { users, shops, type AppUser, type Shop } from "@/lib/multiTenantData";

interface AuthContextType {
  user: AppUser | null;
  shop: Shop | null;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);

  const shop = user?.shop_id
    ? shops.find((s) => s.id === user.shop_id) ?? null
    : null;

  const login = useCallback((email: string, password: string) => {
    const found = users.find(
      (u) => u.email === email && u.password === password
    );
    if (!found) return { success: false, error: "Invalid email or password" };

    if (found.role === "shopkeeper") {
      const userShop = shops.find((s) => s.id === found.shop_id);
      if (userShop?.status === "suspended") {
        return { success: false, error: "Your shop account is suspended. Contact admin." };
      }
    }

    setUser(found);
    return { success: true };
  }, []);

  const logout = useCallback(() => setUser(null), []);

  return (
    <AuthContext.Provider
      value={{
        user,
        shop,
        isAuthenticated: !!user,
        isSuperAdmin: user?.role === "super_admin",
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
