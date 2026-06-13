import { useState } from "react";
import { Search, Plus, Edit, Trash2, AlertTriangle, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { allProducts, shopCategories, gstOptions, formatCurrency, type Product } from "@/lib/multiTenantData";
import { toast } from "sonner";

const emptyProduct = {
  product_name: "",
  sku: "",
  category: "",
  purchase_price: 0,
  selling_price: 0,
  stock_quantity: 0,
  low_stock_level: 5,
  gst_percentage: 0,
};

const ShopProducts = () => {
  const { shop } = useAuth();
  const shopId = shop?.id || "";

  const [products, setProducts] = useState<Product[]>(
    allProducts.filter((p) => p.shop_id === shopId)
  );
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyProduct);

  const categories = shopCategories[shopId] || ["General"];

  const filtered = products.filter((p) => {
    const matchSearch = p.product_name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === "all" || p.category === categoryFilter;
    const matchLow = !lowStockOnly || p.stock_quantity <= p.low_stock_level;
    return matchSearch && matchCategory && matchLow;
  });

  const openAdd = () => {
    setEditId(null);
    setForm(emptyProduct);
    setDialogOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditId(p.id);
    setForm({
      product_name: p.product_name,
      sku: p.sku,
      category: p.category,
      purchase_price: p.purchase_price,
      selling_price: p.selling_price,
      stock_quantity: p.stock_quantity,
      low_stock_level: p.low_stock_level,
      gst_percentage: p.gst_percentage,
    });
    setDialogOpen(true);
  };

  const saveProduct = () => {
    if (!form.product_name) {
      toast.error("Product name is required");
      return;
    }
    if (editId) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editId ? { ...p, ...form } : p))
      );
      toast.success("Product updated");
    } else {
      const newP: Product = {
        id: `p-${Date.now()}`,
        shop_id: shopId,
        ...form,
        image_url: "",
        status: "active",
        created_at: new Date().toISOString().split("T")[0],
      };
      setProducts((prev) => [...prev, newP]);
      toast.success("Product added");
    }
    setDialogOpen(false);
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast.success("Product deleted");
  };

  const exportCSV = () => {
    const header = "Name,SKU,Category,Purchase,Selling,Stock,Low Stock Level,GST%,Status\n";
    const rows = products
      .map((p) => `"${p.product_name}","${p.sku}","${p.category}",${p.purchase_price},${p.selling_price},${p.stock_quantity},${p.low_stock_level},${p.gst_percentage},${p.status}`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${shop?.shop_name || "products"}-export.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Products exported!");
  };

  const isLowStock = (p: Product) => p.stock_quantity <= p.low_stock_level;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-muted-foreground">{shop?.shop_name} — {products.length} products</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportCSV}>
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button onClick={openAdd}>
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search by name or SKU..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="All Categories" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <Switch checked={lowStockOnly} onCheckedChange={setLowStockOnly} id="lowstock" />
              <Label htmlFor="lowstock" className="text-sm cursor-pointer flex items-center gap-1">
                <AlertTriangle className="h-3.5 w-3.5 text-destructive" /> Low Stock
              </Label>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Purchase ₹</TableHead>
                <TableHead className="text-right">Selling ₹</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="text-right">Alert Lvl</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    No products found
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.product_name}</TableCell>
                  <TableCell className="text-muted-foreground">{p.sku || "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{p.category}</TableCell>
                  <TableCell className="text-right">{formatCurrency(p.purchase_price)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(p.selling_price)}</TableCell>
                  <TableCell className="text-right">
                    {isLowStock(p) ? (
                      <Badge variant="destructive">{p.stock_quantity}</Badge>
                    ) : (
                      p.stock_quantity
                    )}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">{p.low_stock_level}</TableCell>
                  <TableCell>
                    <Badge variant={p.status === "active" ? "secondary" : "outline"}>
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(p)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteProduct(p.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editId ? "Edit Product" : "Add New Product"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label>Product Name *</Label>
              <Input value={form.product_name} onChange={(e) => setForm({ ...form, product_name: e.target.value })} placeholder="Enter product name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>SKU / Barcode</Label>
                <Input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} placeholder="Optional" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Purchase Price (₹)</Label>
                <Input type="number" value={form.purchase_price} onChange={(e) => setForm({ ...form, purchase_price: +e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Selling Price (₹)</Label>
                <Input type="number" value={form.selling_price} onChange={(e) => setForm({ ...form, selling_price: +e.target.value })} />
              </div>
            </div>
            {/* Margin Calculator */}
            {form.purchase_price > 0 && form.selling_price > 0 && (
              <div className="rounded-lg border-2 border-[hsl(var(--success))]/30 bg-[hsl(var(--success))]/5 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Profit per item:</span>
                  <span className="text-lg font-bold text-[hsl(var(--success))]">
                    {formatCurrency(form.selling_price - form.purchase_price)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Margin:</span>
                  <span className="text-lg font-bold text-[hsl(var(--success))]">
                    {((form.selling_price - form.purchase_price) / form.purchase_price * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            )}
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label>Stock Qty</Label>
                <Input type="number" value={form.stock_quantity} onChange={(e) => setForm({ ...form, stock_quantity: +e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Low Stock Alert</Label>
                <Input type="number" value={form.low_stock_level} onChange={(e) => setForm({ ...form, low_stock_level: +e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>GST %</Label>
                <Select value={String(form.gst_percentage)} onValueChange={(v) => setForm({ ...form, gst_percentage: +v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {gstOptions.map((g) => (
                      <SelectItem key={g} value={String(g)}>{g}%</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={saveProduct} className="w-full">
              {editId ? "Update Product" : "Add Product"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShopProducts;
