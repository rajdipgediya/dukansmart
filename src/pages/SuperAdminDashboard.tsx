import { useState } from "react";
import { Store, Users, Package, TrendingUp, Ban, CheckCircle, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { shops as initialShops, allProducts, platformStats, shopSalesData, formatCurrency, type Shop } from "@/lib/multiTenantData";
import { toast } from "sonner";

const SuperAdminDashboard = () => {
  const [shopList, setShopList] = useState<Shop[]>(initialShops);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newShop, setNewShop] = useState({ shop_name: "", owner_name: "", subscription_plan: "basic" as "basic" | "premium" });

  const stats = [
    { label: "Total Shops", value: platformStats.totalShops, icon: Store, color: "text-primary" },
    { label: "Active Shops", value: platformStats.activeShops, icon: CheckCircle, color: "text-green-600" },
    { label: "Total Products", value: platformStats.totalProducts, icon: Package, color: "text-amber-600" },
    { label: "Platform Revenue", value: formatCurrency(platformStats.totalRevenue), icon: TrendingUp, color: "text-primary" },
  ];

  const toggleStatus = (id: string) => {
    setShopList((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: s.status === "active" ? "suspended" as const : "active" as const } : s
      )
    );
    toast.success("Shop status updated");
  };

  const addShop = () => {
    if (!newShop.shop_name || !newShop.owner_name) return;
    const shop: Shop = {
      id: `shop-${Date.now()}`,
      shop_name: newShop.shop_name,
      owner_name: newShop.owner_name,
      subscription_plan: newShop.subscription_plan,
      status: "active",
      created_at: new Date().toISOString().split("T")[0],
    };
    setShopList((prev) => [...prev, shop]);
    setNewShop({ shop_name: "", owner_name: "", subscription_plan: "basic" });
    setDialogOpen(false);
    toast.success("Shop created successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Super Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage all shops on the platform</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Create Shop</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create New Shop</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Shop Name</Label>
                <Input value={newShop.shop_name} onChange={(e) => setNewShop({ ...newShop, shop_name: e.target.value })} placeholder="e.g. Patel Kirana Store" />
              </div>
              <div className="grid gap-2">
                <Label>Owner Name</Label>
                <Input value={newShop.owner_name} onChange={(e) => setNewShop({ ...newShop, owner_name: e.target.value })} placeholder="e.g. Rajesh Patel" />
              </div>
              <div className="grid gap-2">
                <Label>Subscription Plan</Label>
                <Select value={newShop.subscription_plan} onValueChange={(v) => setNewShop({ ...newShop, subscription_plan: v as "basic" | "premium" })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic – ₹199/mo</SelectItem>
                    <SelectItem value="premium">Premium – ₹399/mo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={addShop} className="w-full">Create Shop</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`rounded-lg bg-muted p-3 ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="text-xl font-bold">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Shops Table */}
      <Card>
        <CardHeader><CardTitle>All Registered Shops</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Shop Name</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead className="text-right">Products</TableHead>
                <TableHead className="text-right">Total Sales</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shopList.map((shop) => {
                const productCount = allProducts.filter((p) => p.shop_id === shop.id).length;
                const sales = shopSalesData[shop.id] || 0;
                return (
                  <TableRow key={shop.id}>
                    <TableCell className="font-medium">{shop.shop_name}</TableCell>
                    <TableCell className="text-muted-foreground">{shop.owner_name}</TableCell>
                    <TableCell>
                      <Badge variant={shop.subscription_plan === "premium" ? "default" : "secondary"}>
                        {shop.subscription_plan}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{productCount}</TableCell>
                    <TableCell className="text-right">{formatCurrency(sales)}</TableCell>
                    <TableCell>
                      <Badge variant={shop.status === "active" ? "secondary" : "destructive"}>
                        {shop.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleStatus(shop.id)}
                        className={shop.status === "active" ? "text-destructive" : "text-green-600"}
                      >
                        {shop.status === "active" ? <Ban className="mr-1 h-4 w-4" /> : <CheckCircle className="mr-1 h-4 w-4" />}
                        {shop.status === "active" ? "Suspend" : "Activate"}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuperAdminDashboard;
