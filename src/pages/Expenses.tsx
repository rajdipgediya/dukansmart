import { useState } from "react";
import { Plus, IndianRupee } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { expenseCategories, formatCurrency } from "@/lib/mockData";
import { useData } from "@/contexts/DataContext";
import { toast } from "sonner";

const Expenses = () => {
  const { expenses, addExpense, sales } = useData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: "", amount: 0, category: "", date: new Date().toISOString().split("T")[0] });

  // Dynamically calculate statistics
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  
  const todayStr = new Date().toISOString().split("T")[0];
  const todaySales = sales
    .filter((s) => s.date === todayStr && s.status === "Completed") // cash & upi completed sales
    .reduce((sum, s) => sum + s.amount, 0);
    
  const realProfit = todaySales - (totalExpenses / 30); // daily share of monthly costs

  const categoryTotals = expenseCategories.map((cat) => ({
    category: cat,
    total: expenses.filter((e) => e.category === cat).reduce((s, e) => s + e.amount, 0),
  }));

  const handleAdd = () => {
    if (!form.name || !form.category || form.amount <= 0) {
      toast.error("Please fill all fields");
      return;
    }
    addExpense(form.name, form.amount, form.category, form.date);
    setDialogOpen(false);
    setForm({ name: "", amount: 0, category: "", date: new Date().toISOString().split("T")[0] });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">💸 Expenses</h1>
          <p className="text-muted-foreground">Track and manage your business expenses</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="h-12 text-base">
          <Plus className="mr-2 h-5 w-5" /> Add Expense
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-accent p-3 text-destructive">
              <IndianRupee className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Expenses</p>
              <p className="text-2xl font-bold text-destructive tabular-nums">{formatCurrency(totalExpenses)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-accent p-3 text-primary">
              <IndianRupee className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Today's Sales</p>
              <p className="text-2xl font-bold tabular-nums">{formatCurrency(todaySales)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className={realProfit >= 0 ? "border-2 border-[hsl(var(--success))]" : "border-2 border-destructive bg-destructive/5"}>
          <CardContent className="flex items-center gap-4 p-5">
            <div className={`rounded-lg bg-accent p-3 ${realProfit >= 0 ? "text-[hsl(var(--success))]" : "text-destructive"}`}>
              <IndianRupee className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Real Profit (est. daily)</p>
              <p className={`text-2xl font-bold ${realProfit >= 0 ? "text-[hsl(var(--success))]" : "text-destructive"} tabular-nums`}>{formatCurrency(Math.round(realProfit))}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {categoryTotals.map((ct) => (
          <Card key={ct.category}>
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground">{ct.category}</p>
              <p className="text-lg font-bold tabular-nums">{formatCurrency(ct.total)}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Expense Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Expense</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                    No expenses logged yet
                  </TableCell>
                </TableRow>
              ) : (
                expenses.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="font-medium">{e.name}</TableCell>
                    <TableCell><Badge variant="secondary">{e.category}</Badge></TableCell>
                    <TableCell className="text-muted-foreground">{e.date}</TableCell>
                    <TableCell className="text-right font-semibold">{formatCurrency(e.amount)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Expense</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="expName">Expense Name *</Label>
              <Input id="expName" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Electricity Bill" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="expAmount">Amount (₹) *</Label>
                <Input id="expAmount" type="number" value={form.amount || ""} onChange={(e) => setForm({ ...form, amount: +e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="expCat">Category *</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger id="expCat"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="expDate">Date</Label>
              <Input id="expDate" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <Button onClick={handleAdd} className="w-full h-12 text-base font-bold">Add Expense</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Expenses;
