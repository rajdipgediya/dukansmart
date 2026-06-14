import { useState } from "react";
import { Search, MessageCircle, Plus, IndianRupee } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/lib/mockData";
import { useData } from "@/contexts/DataContext";
import { toast } from "sonner";

const statusColor = (status: string) => {
  if (status === "Overdue") return "destructive" as const;
  if (status === "Due Soon") return "outline" as const;
  return "secondary" as const;
};

const riskBadge = (risk: "green" | "yellow" | "red") => {
  if (risk === "green") return <Badge className="bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))]">🟢 Good</Badge>;
  if (risk === "yellow") return <Badge className="bg-[hsl(var(--warning))] text-[hsl(var(--warning-foreground))]">🟡 Risky</Badge>;
  return <Badge variant="destructive">🔴 Bad</Badge>;
};

const Credit = () => {
  const { credits, addCreditCustomer, recordCreditPayment } = useData();
  const [search, setSearch] = useState("");
  
  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  // Forms state
  const [addForm, setAddForm] = useState({
    name: "",
    phone: "",
    pending: 0,
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  });
  const [paymentForm, setPaymentForm] = useState({
    amount: 0,
    paymentMethod: "Cash" as "Cash" | "UPI",
  });

  const filtered = credits.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)
  );

  const totalPending = credits.reduce((sum, c) => sum + c.pending, 0);

  const handleAddCustomer = () => {
    if (!addForm.name || !addForm.phone) {
      toast.error("Please enter a name and phone number");
      return;
    }
    addCreditCustomer(addForm.name, addForm.phone, addForm.pending, addForm.dueDate);
    setAddDialogOpen(false);
    setAddForm({
      name: "",
      phone: "",
      pending: 0,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    });
  };

  const handleRecordPayment = () => {
    if (!selectedCustomer) return;
    if (paymentForm.amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (paymentForm.amount > selectedCustomer.pending) {
      toast.error(`Amount exceeds pending credit of ${formatCurrency(selectedCustomer.pending)}`);
      return;
    }
    recordCreditPayment(selectedCustomer.id, paymentForm.amount, paymentForm.paymentMethod);
    setPaymentDialogOpen(false);
    setSelectedCustomer(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Credit Management (Udhari)</h1>
          <p className="text-sm text-muted-foreground">
            Total Pending: <span className="font-semibold text-destructive">{formatCurrency(totalPending)}</span>
          </p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)} className="h-12 text-base">
          <Plus className="mr-2 h-5 w-5" /> Add Customer Ledger
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search customer..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead className="text-right">Pending Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Risk</TableHead>
                <TableHead>History</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                    No credit customers found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell className="text-muted-foreground">{customer.phone}</TableCell>
                    <TableCell className="text-right font-medium text-destructive">{formatCurrency(customer.pending)}</TableCell>
                    <TableCell className="text-muted-foreground">{customer.dueDate}</TableCell>
                    <TableCell>
                      <Badge variant={statusColor(customer.status)}>{customer.status}</Badge>
                    </TableCell>
                    <TableCell>{riskBadge(customer.riskScore)}</TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground">
                        ✅{customer.onTimeCount} ❌{customer.lateCount} / {customer.totalTransactions}
                      </span>
                    </TableCell>
                    <TableCell className="text-right flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={customer.pending === 0}
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setPaymentForm({ amount: customer.pending, paymentMethod: "Cash" });
                          setPaymentDialogOpen(true);
                        }}
                      >
                        <IndianRupee className="mr-1 h-3.5 w-3.5" /> Pay
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toast.success(`Reminder sent to ${customer.name}`)}
                      >
                        <MessageCircle className="mr-1 h-3.5 w-3.5" /> Remind
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Customer Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Customer Ledger</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="custName">Customer Name *</Label>
              <Input id="custName" value={addForm.name} onChange={(e) => setAddForm({ ...addForm, name: e.target.value })} placeholder="e.g. Amit Sharma" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="custPhone">Phone Number *</Label>
              <Input id="custPhone" value={addForm.phone} onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })} placeholder="e.g. 9876543210" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="custPending">Opening Balance (₹)</Label>
                <Input id="custPending" type="number" value={addForm.pending || ""} onChange={(e) => setAddForm({ ...addForm, pending: +e.target.value })} placeholder="0" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="custDueDate">Due Date</Label>
                <Input id="custDueDate" type="date" value={addForm.dueDate} onChange={(e) => setAddForm({ ...addForm, dueDate: e.target.value })} />
              </div>
            </div>
            <Button onClick={handleAddCustomer} className="w-full h-12 text-base font-bold">Add Customer Ledger</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Record Payment Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Record Payment: {selectedCustomer?.name}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div>
              <p className="text-sm text-muted-foreground">
                Remaining Balance: <span className="font-semibold text-destructive">{selectedCustomer ? formatCurrency(selectedCustomer.pending) : ""}</span>
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="payAmount">Amount Received (₹) *</Label>
              <Input
                id="payAmount"
                type="number"
                value={paymentForm.amount || ""}
                onChange={(e) => setPaymentForm({ ...paymentForm, amount: +e.target.value })}
                placeholder="e.g. 500"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="payMethod">Payment Method *</Label>
              <Select
                value={paymentForm.paymentMethod}
                onValueChange={(v: "Cash" | "UPI") => setPaymentForm({ ...paymentForm, paymentMethod: v })}
              >
                <SelectTrigger id="payMethod"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="UPI">UPI</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleRecordPayment} className="w-full h-12 text-base font-bold bg-[hsl(var(--success))] hover:bg-[hsl(var(--success))]/90 text-[hsl(var(--success-foreground))]">Record Payment</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Credit;
