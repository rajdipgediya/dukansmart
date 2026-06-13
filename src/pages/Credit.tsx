import { useState } from "react";
import { Search, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { creditCustomers, formatCurrency } from "@/lib/mockData";
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
  const [search, setSearch] = useState("");

  const filtered = creditCustomers.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)
  );

  const totalPending = creditCustomers.reduce((sum, c) => sum + c.pending, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Credit Management</h1>
          <p className="text-sm text-muted-foreground">
            Total Pending: <span className="font-semibold text-destructive">{formatCurrency(totalPending)}</span>
          </p>
        </div>
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
              {filtered.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell className="text-muted-foreground">{customer.phone}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(customer.pending)}</TableCell>
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
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toast.success(`Reminder sent to ${customer.name}`)}
                    >
                      <MessageCircle className="mr-1 h-4 w-4" /> Remind
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Credit;
