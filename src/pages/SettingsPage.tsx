import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { LogOut, Download, Store, ShieldCheck, CloudUpload, Upload, FileDown, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useData } from "@/contexts/DataContext";

const SettingsPage = () => {
  const { shopInfo, updateShopInfo, importBackup, resetAllData, inventory, sales, expenses, credits } = useData();

  const [form, setForm] = useState({
    shop_name: shopInfo.shop_name,
    owner_name: shopInfo.owner_name,
    phone: shopInfo.phone,
    address: shopInfo.address,
  });

  // Keep form in sync when shopInfo loads/changes
  useEffect(() => {
    setForm({
      shop_name: shopInfo.shop_name,
      owner_name: shopInfo.owner_name,
      phone: shopInfo.phone,
      address: shopInfo.address,
    });
  }, [shopInfo]);

  const handleSaveChanges = () => {
    if (!form.shop_name || !form.owner_name) {
      toast.error("Shop Name and Owner Name are required");
      return;
    }
    updateShopInfo(form);
  };

  const handleBackup = () => {
    const data = {
      timestamp: new Date().toISOString(),
      version: "1.0",
      note: "DukaanSmart Backup",
      inventory,
      sales,
      expenses,
      credits,
      shopInfo,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dukaansmart-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Backup downloaded!");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        const success = importBackup(parsed);
        if (success) {
          toast.success("Data restored successfully!");
        } else {
          toast.error("Invalid backup file format");
        }
      } catch (error) {
        toast.error("Error reading backup file");
      }
    };
    reader.readAsText(file);
    // Reset input so file change event fires again if user picks same file
    e.target.value = "";
  };

  const handleExportCSV = () => {
    if (sales.length === 0) {
      toast.error("No sales records to export");
      return;
    }
    let csvContent = "\uFEFFInvoice ID,Date,Customer,Payment Type,Amount,Status\n";
    sales.forEach((s) => {
      csvContent += `${s.id},${s.date},"${s.customer.replace(/"/g, '""')}",${s.paymentType},${s.amount},${s.status}\n`;
    });
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dukaansmart-sales-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Sales CSV exported!");
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Shop Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><Store className="h-5 w-5" /> Shop Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="shopName">Shop Name</Label>
            <Input id="shopName" value={form.shop_name} onChange={(e) => setForm({ ...form, shop_name: e.target.value })} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="ownerName">Owner Name</Label>
            <Input id="ownerName" value={form.owner_name} onChange={(e) => setForm({ ...form, owner_name: e.target.value })} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>
          <Button onClick={handleSaveChanges} className="font-bold">Save Changes</Button>
        </CardContent>
      </Card>

      {/* Language */}
      <Card>
        <CardHeader><CardTitle className="text-base">Language</CardTitle></CardHeader>
        <CardContent>
          <Select defaultValue="en">
            <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="hi">हिन्दी (Hindi)</SelectItem>
              <SelectItem value="gu">ગુજરાતી (Gujarati)</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Data Safety */}
      <Card className="border-[hsl(var(--success))]/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><ShieldCheck className="h-5 w-5 text-[hsl(var(--success))]" /> Data Safety & Backup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-[hsl(var(--success))]/20 bg-[hsl(var(--success))]/5 p-4">
            <p className="text-sm font-medium text-[hsl(var(--success))]">🔒 Your data is safe</p>
            <p className="text-xs text-muted-foreground mt-1">
              Store data is stored locally on your device and can be backed up manually. Restoring a backup will override your current state.
            </p>
          </div>
          
          <input
            type="file"
            id="restore-file-input"
            className="hidden"
            accept=".json"
            onChange={handleFileChange}
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Button variant="outline" className="h-14 flex-col gap-1" onClick={handleBackup}>
              <CloudUpload className="h-5 w-5" />
              <span className="text-xs">Backup Now</span>
            </Button>
            <Button
              variant="outline"
              className="h-14 flex-col gap-1"
              onClick={() => document.getElementById("restore-file-input")?.click()}
            >
              <Upload className="h-5 w-5" />
              <span className="text-xs">Restore Data</span>
            </Button>
            <Button variant="outline" className="h-14 flex-col gap-1" onClick={handleExportCSV}>
              <FileDown className="h-5 w-5" />
              <span className="text-xs">Export CSV</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Subscription */}
      <Card>
        <CardHeader><CardTitle className="text-base">Subscription</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <PlanCard name="Basic" price="₹199/month" features="Inventory + Sales tracking" active />
          <PlanCard name="Pro" price="₹299/month" features="Credit management + Reports + Expense tracking" />
          <PlanCard name="Premium" price="₹399/month" features="WhatsApp automation + Smart analytics + AI suggestions" highlight />
        </CardContent>
      </Card>

      <Separator />

      <div className="flex gap-3">
        <Button variant="outline" onClick={handleExportCSV}>
          <Download className="mr-2 h-4 w-4" /> Export Sales CSV
        </Button>
        <Button
          variant="outline"
          className="text-destructive border-destructive hover:bg-destructive/10"
          onClick={() => {
            if (window.confirm("Are you sure you want to reset all data? This will restore mock data, clearing your custom changes.")) {
              resetAllData();
            }
          }}
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset to Defaults
        </Button>
        <Button variant="destructive" onClick={() => toast.success("Logout successful")}>
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
      </div>
    </div>
  );
};

function PlanCard({ name, price, features, active, highlight }: { name: string; price: string; features: string; active?: boolean; highlight?: boolean }) {
  return (
    <div className={`flex items-center justify-between rounded-lg border p-4 ${highlight ? "border-primary/30 bg-primary/5" : ""} ${active ? "border-[hsl(var(--success))]/50 bg-[hsl(var(--success))]/5" : ""}`}>
      <div>
        <p className="font-semibold">{name}</p>
        <p className="text-sm text-muted-foreground">{price} — {features}</p>
      </div>
      {active ? (
        <span className="rounded-full bg-[hsl(var(--success))] px-3 py-1 text-xs font-medium text-[hsl(var(--success-foreground))]">Current</span>
      ) : (
        <Button size="sm">Upgrade</Button>
      )}
    </div>
  );
}

export default SettingsPage;
