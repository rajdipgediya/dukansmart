import { IndianRupee, TrendingUp, AlertTriangle, CreditCard, Zap, Package, BarChart3, Lightbulb, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@/lib/mockData";
import { useNavigate } from "react-router-dom";
import { useData } from "@/contexts/DataContext";

const Dashboard = () => {
  const { sales, expenses, credits, inventory } = useData();
  const navigate = useNavigate();

  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];

  // Calculations based on live context data
  const todaySalesList = sales.filter((s) => s.date === todayStr);

  // New sales made today (non-recovery)
  const newSalesToday = todaySalesList.filter((s) => !s.id.startsWith("REC-"));
  const todaySalesVal = newSalesToday.reduce((sum, s) => sum + s.amount, 0);

  // Total pending collection across all customers
  const pendingCollectionVal = credits.reduce((sum, c) => sum + c.pending, 0);

  // Total monthly expenses logged
  const totalExpensesVal = expenses.reduce((s, e) => s + e.amount, 0);
  const dailyExpenseVal = Math.round(totalExpensesVal / 30);

  // Calculate actual profit for today's new sales
  const calculateTodayProfit = () => {
    let profit = 0;
    newSalesToday.forEach((sale) => {
      if (sale.items && sale.items.length > 0) {
        sale.items.forEach((saleItem) => {
          const invItem = inventory.find((i) => i.id === saleItem.id || i.name === saleItem.name);
          if (invItem) {
            const itemProfit = (saleItem.price - invItem.purchasePrice) * saleItem.qty;
            profit += itemProfit;
          } else {
            // Fallback: 20% profit margin
            profit += (saleItem.price * 0.20) * saleItem.qty;
          }
        });
      } else {
        // Fallback: 20% profit margin
        profit += sale.amount * 0.20;
      }
    });
    return Math.round(profit);
  };

  const todayProfitVal = calculateTodayProfit();
  const realProfitVal = todayProfitVal - dailyExpenseVal;
  const monthlyNetProfitVal = todayProfitVal * 30 - totalExpensesVal;

  // Credit recovery calculations
  const recoverySum = sales.filter((s) => s.id.startsWith("REC-")).reduce((sum, s) => sum + s.amount, 0);
  const totalCreditGiven = sales.filter((s) => s.paymentType === "Credit").reduce((sum, s) => sum + s.amount, 0);
  const recoveryRate = totalCreditGiven > 0 ? Math.round((recoverySum / totalCreditGiven) * 100) : 75;

  // Build the last 7 days sales list dynamically
  const getLast7DaysSales = () => {
    const data = [];
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = d.toISOString().split("T")[0];
      const dayName = weekdays[d.getDay()];
      const daySales = sales
        .filter((s) => s.date === dateString && !s.id.startsWith("REC-"))
        .reduce((sum, s) => sum + s.amount, 0);
      data.push({ day: dayName, sales: daySales, dateStr: dateString });
    }
    return data;
  };
  const salesLast7DaysVal = getLast7DaysSales();

  // Range helper for sales totals
  const getSalesTotalForRange = (startDaysAgo: number, endDaysAgo: number) => {
    const startDate = new Date();
    startDate.setDate(now.getDate() - startDaysAgo);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date();
    endDate.setDate(now.getDate() - endDaysAgo);
    endDate.setHours(23, 59, 59, 999);

    return sales
      .filter((s) => {
        const saleDate = new Date(s.date);
        return saleDate >= startDate && saleDate <= endDate && !s.id.startsWith("REC-");
      })
      .reduce((sum, s) => sum + s.amount, 0);
  };

  // This week sales vs last week sales
  const thisWeekTotalVal = salesLast7DaysVal.reduce((sum, d) => sum + d.sales, 0);
  const lastWeekTotalVal = getSalesTotalForRange(13, 7);
  const weekGrowthVal = lastWeekTotalVal > 0 
    ? ((thisWeekTotalVal - lastWeekTotalVal) / lastWeekTotalVal * 100).toFixed(1)
    : "0.0";

  const isGrowthPositive = Number(weekGrowthVal) >= 0;

  // Low Stock Items list
  const lowStockCount = inventory.filter((item) => item.stock <= 5).length;
  const lowStockAlertsVal = inventory
    .filter((i) => i.stock <= 5)
    .map((item) => ({
      ...item,
      suggestedReorder: Math.max(10, 30 - item.stock),
    }));

  // Dynamic smart suggestions list
  const getSmartSuggestions = () => {
    const list = [];
    
    const highCreditCust = credits.find((c) => c.pending > 5000);
    if (highCreditCust) {
      list.push({
        type: "alert" as const,
        message: `Customer ${highCreditCust.name} has pending balance of ${formatCurrency(highCreditCust.pending)}`,
        icon: "🔴",
      });
    }
    
    if (lowStockCount > 0) {
      list.push({
        type: "warning" as const,
        message: `${lowStockCount} items are low in stock — reorder soon!`,
        icon: "⚠️",
      });
    }
    
    list.push({
      type: "trend" as const,
      message: "UPI is the most preferred digital payment method this week.",
      icon: "📈",
    });
    
    list.push({
      type: "trend" as const,
      message: "Sales are generally higher on weekends. Plan inventory accordingly.",
      icon: "📊",
    });
    
    return list;
  };
  const suggestionsList = getSmartSuggestions();

  // Dynamic top profit margins
  const mostProfitable = [...inventory]
    .map((item) => {
      const profit = item.sellingPrice - item.purchasePrice;
      const margin = item.sellingPrice > 0 ? Math.round((profit / item.sellingPrice) * 100) : 0;
      return { ...item, profit, margin };
    })
    .sort((a, b) => b.profit - a.profit)
    .slice(0, 5);

  const lowMargin = [...inventory]
    .map((item) => {
      const profit = item.sellingPrice - item.purchasePrice;
      const margin = item.sellingPrice > 0 ? Math.round((profit / item.sellingPrice) * 100) : 0;
      return { ...item, profit, margin };
    })
    .sort((a, b) => a.margin - b.margin)
    .slice(0, 2);

  return (
    <div className="space-y-6">
      {/* Hero Profit Card */}
      <Card className={realProfitVal >= 0 ? "border-2 border-[hsl(var(--success))] bg-[hsl(var(--success))]/5" : "border-2 border-destructive bg-destructive/5"}>
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Today's Real Profit</p>
            <p className={`text-5xl font-black ${realProfitVal >= 0 ? "text-[hsl(var(--success))]" : "text-destructive"} tabular-nums`}>{formatCurrency(realProfitVal)}</p>
            <p className="text-xs text-muted-foreground mt-1">Sales {formatCurrency(todaySalesVal)} − Expenses Share {formatCurrency(dailyExpenseVal)}</p>
          </div>
          <div className="text-right space-y-1">
            <div className="flex items-center gap-1 justify-end">
              {isGrowthPositive ? <ArrowUpRight className="h-4 w-4 text-[hsl(var(--success))]" /> : <ArrowDownRight className="h-4 w-4 text-destructive" />}
              <span className={`text-sm font-bold ${isGrowthPositive ? "text-[hsl(var(--success))]" : "text-destructive"}`}>{weekGrowthVal}% vs last week</span>
            </div>
            <p className="text-xs text-muted-foreground">Net Monthly: <span className="font-bold text-foreground">{formatCurrency(monthlyNetProfitVal)}</span></p>
            <p className="text-xs text-muted-foreground">Credit Recovery: <span className="font-bold text-foreground">{recoveryRate}%</span></p>
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
              <p className="text-2xl font-bold tabular-nums">{formatCurrency(todaySalesVal)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-[hsl(var(--warning))]/10 p-3 text-[hsl(var(--warning))]"><CreditCard className="h-6 w-6" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Credit</p>
              <p className="text-2xl font-bold tabular-nums">{formatCurrency(pendingCollectionVal)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-destructive/10 p-3 text-destructive"><AlertTriangle className="h-6 w-6" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Low Stock Items</p>
              <p className="text-2xl font-bold tabular-nums">{lowStockCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-[hsl(var(--success))]/10 p-3 text-[hsl(var(--success))]"><TrendingUp className="h-6 w-6" /></div>
            <div>
              <p className="text-sm text-muted-foreground">This Week</p>
              <p className="text-2xl font-bold tabular-nums">{formatCurrency(thisWeekTotalVal)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Smart Suggestions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-[hsl(var(--warning))]" /> Smart Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {suggestionsList.map((s, i) => (
              <div key={i} className={`flex items-start gap-3 rounded-lg border p-3 ${s.type === "alert" ? "border-destructive/30 bg-destructive/5" : s.type === "warning" ? "border-[hsl(var(--warning))]/30 bg-[hsl(var(--warning))]/5" : "border-primary/20 bg-primary/5"}`}>
                <span className="text-xl shrink-0">{s.icon}</span>
                <p className="text-sm font-medium">{s.message}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Low Stock Alerts */}
      {lowStockAlertsVal.length > 0 && (
        <Card className="border-destructive/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Low Stock Alerts
              <Badge variant="destructive">{lowStockAlertsVal.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {lowStockAlertsVal.map((item) => (
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
              <BarChart data={salesLast7DaysVal}>
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
            <CardTitle className="text-base text-[hsl(var(--success))]">🏆 Most Profitable Products</CardTitle>
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
                {mostProfitable.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell className="text-right text-[hsl(var(--success))] font-semibold">{p.margin}%</TableCell>
                    <TableCell className="text-right">{formatCurrency(p.profit)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base text-[hsl(var(--warning))]">⚠️ Low Margin Products</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Margin</TableHead>
                  <TableHead className="text-right">Unit Profit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowMargin.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell className="text-right text-[hsl(var(--warning))] font-semibold">{p.margin}%</TableCell>
                    <TableCell className="text-right">{formatCurrency(p.profit)}</TableCell>
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
