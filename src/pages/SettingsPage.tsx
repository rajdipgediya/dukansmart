import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { LogOut, Download, Store, ShieldCheck, CloudUpload, Upload, FileDown } from "lucide-react";
import { toast } from "sonner";

const SettingsPage = () => {
  const handleBackup = () => {
    const data = { timestamp: new Date().toISOString(), version: "1.0", note: "DukaanSmart backup" };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dukaansmart-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Backup downloaded!");
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
          <div className="grid gap-2"><Label>Shop Name</Label><Input defaultValue="Sharma General Store" /></div>
          <div className="grid gap-2"><Label>Owner Name</Label><Input defaultValue="Ramesh Sharma" /></div>
          <div className="grid gap-2"><Label>Phone Number</Label><Input defaultValue="+91 98765 43210" /></div>
          <div className="grid gap-2"><Label>Address</Label><Input defaultValue="Ring Road, Surat, Gujarat" /></div>
          <Button onClick={() => toast.success("Shop info updated!")}>Save Changes</Button>
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
      <Card className="border-success/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><ShieldCheck className="h-5 w-5 text-success" /> Data Safety & Backup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-success/20 bg-success/5 p-4">
            <p className="text-sm font-medium text-success">🔒 Your data is safe</p>
            <p className="text-xs text-muted-foreground mt-1">
              Auto cloud backup runs daily at midnight. Your sales, inventory, and customer data are encrypted and stored securely.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Button variant="outline" className="h-14 flex-col gap-1" onClick={handleBackup}>
              <CloudUpload className="h-5 w-5" />
              <span className="text-xs">Backup Now</span>
            </Button>
            <Button variant="outline" className="h-14 flex-col gap-1" onClick={() => toast.info("Select backup file to restore")}>
              <Upload className="h-5 w-5" />
              <span className="text-xs">Restore Data</span>
            </Button>
            <Button variant="outline" className="h-14 flex-col gap-1" onClick={() => toast.success("Export started — Excel file downloading")}>
              <FileDown className="h-5 w-5" />
              <span className="text-xs">Export Excel</span>
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
        <Button variant="outline" onClick={() => toast.success("Data export started")}>
          <Download className="mr-2 h-4 w-4" /> Export Data
        </Button>
        <Button variant="destructive">
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
      </div>
    </div>
  );
};

function PlanCard({ name, price, features, active, highlight }: { name: string; price: string; features: string; active?: boolean; highlight?: boolean }) {
  return (
    <div className={`flex items-center justify-between rounded-lg border p-4 ${highlight ? "border-primary/30 bg-primary/5" : ""} ${active ? "border-success/50 bg-success/5" : ""}`}>
      <div>
        <p className="font-semibold">{name}</p>
        <p className="text-sm text-muted-foreground">{price} — {features}</p>
      </div>
      {active ? (
        <span className="rounded-full bg-success px-3 py-1 text-xs font-medium text-success-foreground">Current</span>
      ) : (
        <Button size="sm">Upgrade</Button>
      )}
    </div>
  );
}

export default SettingsPage;
