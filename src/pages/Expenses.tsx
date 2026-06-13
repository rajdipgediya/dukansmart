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
import { expensesData, expenseCategories, formatCurrency, type Expense } from "@/lib/mockData";
import { toast } from "sonner";

const Expenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>(expensesData);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: "", amount: 0, category: "", date: new Date().toISOString().split("T")[0] });

  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const totalSales = 12450; // from dashboard stats
  const realProfit = totalSales - (totalExpenses / 30); // daily share

  const categoryTotals = expenseCategories.map((cat) => ({
    category: cat,
    total: expenses.filter((e) => e.category === cat).reduce((s, e) => s + e.amount, 0),
  }));

  const addExpense = () => {
    if (!form.name || !form.category || form.amount <= 0) {
      toast.error("Please fill all fields");
      return;
    }
    setExpenses((prev) => [
      { id: `e-${Date.now()}`, ...form },
      ...prev,
    ]);
    setDialogOpen(false);
    setForm({ name: "", amount: 0, category: "", date: new Date().toISOString().split("T")[0] });
    toast.success("Expense added!");
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
              <p className="text-2xl font-bold tabular-nums">{formatCurrency(totalSales)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 border-[hsl(var(--success))]">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-accent p-3 text-[hsl(var(--success))]">
              <IndianRupee className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Real Profit (est. daily)</p>
              <p className="text-2xl font-bold text-[hsl(var(--success))] tabular-nums">{formatCurrency(Math.round(realProfit))}</p>
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
              {expenses.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="font-medium">{e.name}</TableCell>
                  <TableCell><Badge variant="secondary">{e.category}</Badge></TableCell>
                  <TableCell className="text-muted-foreground">{e.date}</TableCell>
                  <TableCell className="text-right font-semibold">{formatCurrency(e.amount)}</TableCell>
                </TableRow>
              ))}
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
              <Label>Expense Name *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Electricity Bill" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Amount (₹) *</Label>
                <Input type="number" value={form.amount || ""} onChange={(e) => setForm({ ...form, amount: +e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Category *</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Date</Label>
              <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <Button onClick={addExpense} className="w-full h-12 text-base font-bold">Add Expense</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Expenses;
