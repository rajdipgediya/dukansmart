import { IndianRupee, TrendingUp, AlertTriangle, CreditCard, Zap, Package, BarChart3, Lightbulb, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import {
  dashboardStats, salesLast7Days, topProfitProducts, worstProducts,
  lowStockAlerts, expensesData, formatCurrency, smartSuggestions,
  thisWeekTotal, lastWeekTotal, weekGrowth, creditRecoveryRate,
} from "@/lib/mockData";
import { useNavigate } from "react-router-dom";

const totalExpenses = expensesData.reduce((s, e) => s + e.amount, 0);
const dailyExpense = Math.round(totalExpenses / 30);
const todayProfit = dashboardStats.todayProfit;
const realProfit = todayProfit - dailyExpense;
const monthlyNetProfit = dashboardStats.todayProfit * 30 - totalExpenses;

const Dashboard = () => {
  const navigate = useNavigate();
  const isGrowthPositive = Number(weekGrowth) >= 0;

  return (
    <div className="space-y-6">
      {/* Hero Profit Card */}
      <Card className="border-2 border-success bg-success/5">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Today's Real Profit</p>
            <p className="text-5xl font-black text-success tabular-nums">{formatCurrency(realProfit)}</p>
            <p className="text-xs text-muted-foreground mt-1">Sales {formatCurrency(dashboardStats.todaySales)} − Expenses {formatCurrency(dailyExpense)}</p>
          </div>
          <div className="text-right space-y-1">
            <div className="flex items-center gap-1 justify-end">
              {isGrowthPositive ? <ArrowUpRight className="h-4 w-4 text-success" /> : <ArrowDownRight className="h-4 w-4 text-destructive" />}
              <span className={`text-sm font-bold ${isGrowthPositive ? "text-success" : "text-destructive"}`}>{weekGrowth}% vs last week</span>
            </div>
            <p className="text-xs text-muted-foreground">Net Monthly: <span className="font-bold text-foreground">{formatCurrency(monthlyNetProfit)}</span></p>
            <p className="text-xs text-muted-foreground">Credit Recovery: <span className="font-bold text-foreground">{creditRecoveryRate}%</span></p>
          </div>
        </CardContent>
      </Card>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-primary/10 p-3 text-primary"><IndianRupee className="h-6 w-6" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Today's Sales</p>
              <p className="text-2xl font-bold tabular-nums">{formatCurrency(dashboardStats.todaySales)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-warning/10 p-3 text-warning"><CreditCard className="h-6 w-6" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Credit</p>
              <p className="text-2xl font-bold tabular-nums">{formatCurrency(dashboardStats.pendingCredit)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-destructive/10 p-3 text-destructive"><AlertTriangle className="h-6 w-6" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Low Stock Items</p>
              <p className="text-2xl font-bold tabular-nums">{dashboardStats.lowStockItems}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-success/10 p-3 text-success"><TrendingUp className="h-6 w-6" /></div>
            <div>
              <p className="text-sm text-muted-foreground">This Week</p>
              <p className="text-2xl font-bold tabular-nums">{formatCurrency(thisWeekTotal)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Smart Suggestions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-warning" /> Smart Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {smartSuggestions.map((s, i) => (
              <div key={i} className={`flex items-start gap-3 rounded-lg border p-3 ${s.type === "alert" ? "border-destructive/30 bg-destructive/5" : s.type === "warning" ? "border-warning/30 bg-warning/5" : "border-primary/20 bg-primary/5"}`}>
                <span className="text-xl shrink-0">{s.icon}</span>
                <p className="text-sm font-medium">{s.message}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Low Stock Alerts */}
      {lowStockAlerts.length > 0 && (
        <Card className="border-destructive/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Low Stock Alerts
              <Badge variant="destructive">{lowStockAlerts.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {lowStockAlerts.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-lg border border-destructive/20 bg-destructive/5 p-3">
                  <div>
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Stock: <span className="text-destructive font-bold">{item.stock}</span> • Reorder: {item.suggestedReorder}
                    </p>
                  </div>
                  <Badge variant="destructive" className="shrink-0">{item.stock} left</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sales Chart + Quick Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Sales – Last 7 Days</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={salesLast7Days}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} formatter={(v: number) => [formatCurrency(v), "Sales"]} />
                <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <Button className="h-auto flex-col gap-2 py-5 text-base font-bold" onClick={() => navigate("/fast-sale")}>
              <Zap className="h-6 w-6" />
              <span>⚡ Fast Sale</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 py-5" onClick={() => navigate("/products")}>
              <Package className="h-6 w-6" />
              <span className="text-xs">Products</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 py-5" onClick={() => navigate("/credit")}>
              <CreditCard className="h-6 w-6" />
              <span className="text-xs">Credit</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 py-5" onClick={() => navigate("/reports")}>
              <BarChart3 className="h-6 w-6" />
              <span className="text-xs">Reports</span>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Best + Worst Products */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-success">🏆 Most Profitable Products</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Margin</TableHead>
                  <TableHead className="text-right">Profit/unit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topProfitProducts.map((p) => (
                  <TableRow key={p.name}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell className="text-right text-success font-semibold">{p.margin}%</TableCell>
                    <TableCell className="text-right">{formatCurrency(p.profit)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base text-warning">⚠️ Low Margin Products</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Margin</TableHead>
                  <TableHead className="text-right">Total Profit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {worstProducts.map((p) => (
                  <TableRow key={p.name}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell className="text-right text-warning font-semibold">{p.margin}%</TableCell>
                    <TableCell className="text-right">{formatCurrency(p.totalProfit)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
