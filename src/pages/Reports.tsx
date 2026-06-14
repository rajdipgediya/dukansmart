import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";
import { Download, TrendingUp, ArrowUpRight, Percent, Users, Store, Phone, MapPin, Printer } from "lucide-react";
import {
  monthlyRevenue, formatCurrency, topProducts, topProfitProducts,
} from "@/lib/mockData";
import { useData } from "@/contexts/DataContext";

const Reports = () => {
  const { sales, inventory, shopInfo, credits, expenses } = useData();
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];

  // Weekly sales
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

  const thisWeekTotalVal = salesLast7DaysVal.reduce((sum, d) => sum + d.sales, 0);
  const lastWeekTotalVal = getSalesTotalForRange(13, 7);
  const weekGrowthVal = lastWeekTotalVal > 0 
    ? ((thisWeekTotalVal - lastWeekTotalVal) / lastWeekTotalVal * 100).toFixed(1)
    : "0.0";

  // Dynamic combinedWeekData for comparison
  const combinedWeekDataVal = salesLast7DaysVal.map((d) => {
    const targetDate = new Date(d.dateStr);
    targetDate.setDate(targetDate.getDate() - 7);
    const targetDateStr = targetDate.toISOString().split("T")[0];
    const lastWeekSalesVal = sales
      .filter((s) => s.date === targetDateStr && !s.id.startsWith("REC-"))
      .reduce((sum, s) => sum + s.amount, 0);

    return {
      day: d.day,
      thisWeek: d.sales,
      lastWeek: lastWeekSalesVal,
    };
  });

  // Credit metrics
  const recoverySum = sales.filter((s) => s.id.startsWith("REC-")).reduce((sum, s) => sum + s.amount, 0);
  const totalCreditGiven = sales.filter((s) => s.paymentType === "Credit").reduce((sum, s) => sum + s.amount, 0);
  const recoveryRateVal = totalCreditGiven > 0 ? Math.round((recoverySum / totalCreditGiven) * 100) : 75;
  const pendingCreditsVal = credits.reduce((sum, c) => sum + c.pending, 0);

  // Sales and splits calculations
  const totalSalesAllTime = sales.filter((s) => !s.id.startsWith("REC-")).reduce((sum, s) => sum + s.amount, 0);
  const cashSales = sales.filter((s) => s.paymentType === "Cash" && !s.id.startsWith("REC-")).reduce((sum, s) => sum + s.amount, 0);
  const upiSales = sales.filter((s) => s.paymentType === "UPI" && !s.id.startsWith("REC-")).reduce((sum, s) => sum + s.amount, 0);
  const creditSales = sales.filter((s) => s.paymentType === "Credit").reduce((sum, s) => sum + s.amount, 0);

  const cashPercent = totalSalesAllTime > 0 ? Math.round((cashSales / totalSalesAllTime) * 100) : 0;
  const upiPercent = totalSalesAllTime > 0 ? Math.round((upiSales / totalSalesAllTime) * 100) : 0;
  const creditPercent = totalSalesAllTime > 0 ? Math.round((creditSales / totalSalesAllTime) * 100) : 0;

  // Best selling products dynamic mapping
  const getTopSellingProducts = () => {
    const counts: Record<string, { name: string; sold: number; revenue: number }> = {};
    sales.forEach((sale) => {
      if (sale.items) {
        sale.items.forEach((item) => {
          if (!counts[item.name]) {
            counts[item.name] = { name: item.name, sold: 0, revenue: 0 };
          }
          counts[item.name].sold += item.qty;
          counts[item.name].revenue += item.price * item.qty;
        });
      }
    });
    const sorted = Object.values(counts)
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 5);
    
    return sorted.length > 0 ? sorted : topProducts;
  };
  const dynamicTopProducts = getTopSellingProducts();

  // Top profit items mapping
  const getMostProfitableProducts = () => {
    const list = inventory
      .map((item) => {
        const profit = item.sellingPrice - item.purchasePrice;
        const margin = item.sellingPrice > 0 ? Math.round((profit / item.sellingPrice) * 100) : 0;
        return { name: item.name, margin, profit };
      })
      .sort((a, b) => b.profit - a.profit)
      .slice(0, 5);
    return list.length > 0 ? list : topProfitProducts;
  };
  const dynamicTopProfitProducts = getMostProfitableProducts();

  return (
    <div className="space-y-6 print:space-y-4 print:p-4">
      {/* Action panel at the top (hidden during print) */}
      <div className="flex items-center justify-between no-print">
        <div>
          <h1 className="text-2xl font-bold">📊 Analytics & Reports</h1>
          <p className="text-sm text-muted-foreground">Detailed sales reports and ledger insights</p>
        </div>
        <Button onClick={() => window.print()} className="h-12 text-base font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
          <Printer className="mr-2 h-5 w-5" /> Export PDF Report
        </Button>
      </div>

      {/* Professional PDF Header (Includes Shopkeeper Details - Styled for Screen & Print) */}
      <div className="border-2 border-blue-50 bg-[#f4f7fa]/35 p-5 rounded-2xl flex flex-col md:flex-row md:justify-between gap-4 print:border-b-2 print:border-zinc-300 print:bg-white print:p-0 print:border-none print:rounded-none">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Store className="h-6 w-6 text-blue-600 print:text-zinc-950" />
            <h2 className="text-2xl font-black text-zinc-900 tracking-tight print:text-xl">{shopInfo.shop_name}</h2>
          </div>
          <div className="text-sm text-zinc-550 space-y-1 print:text-xs">
            <p className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 shrink-0 text-zinc-400" /> {shopInfo.address}</p>
            <p className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 shrink-0 text-zinc-400" /> Owner: <span className="font-semibold text-zinc-800">{shopInfo.owner_name}</span> • Tel: <span className="font-semibold text-zinc-800">{shopInfo.phone}</span>
            </p>
          </div>
        </div>
        <div className="md:text-right flex flex-col justify-between items-start md:items-end">
          <Badge className="bg-blue-600 text-white font-bold no-print">Verified Merchant</Badge>
          <div className="text-xs text-zinc-450 mt-2 font-semibold print:text-zinc-500">
            <p>Report Date: {now.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
            <p className="text-[10px] text-zinc-400 mt-0.5">Powered by DukaanSmart Accounting</p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 print:grid-cols-4 print:gap-2">
        <Card className="print:shadow-none print:border-zinc-200">
          <CardContent className="flex items-center gap-3 p-5 print:p-3">
            <div className="rounded-lg bg-[hsl(var(--success))]/10 p-3 text-[hsl(var(--success))] print:bg-zinc-100 print:text-zinc-900"><TrendingUp className="h-5 w-5" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Weekly Growth</p>
              <p className="text-xl font-bold tracking-tight print:text-base">{weekGrowthVal}%</p>
            </div>
          </CardContent>
        </Card>
        <Card className="print:shadow-none print:border-zinc-200">
          <CardContent className="flex items-center gap-3 p-5 print:p-3">
            <div className="rounded-lg bg-primary/10 p-3 text-primary print:bg-zinc-100 print:text-zinc-900"><ArrowUpRight className="h-5 w-5" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Weekly Sales</p>
              <p className="text-xl font-bold tracking-tight print:text-base">{formatCurrency(thisWeekTotalVal)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="print:shadow-none print:border-zinc-200">
          <CardContent className="flex items-center gap-3 p-5 print:p-3">
            <div className="rounded-lg bg-destructive/10 p-3 text-destructive print:bg-zinc-100 print:text-zinc-900"><Users className="h-5 w-5" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Ledger Credit</p>
              <p className="text-xl font-bold tracking-tight print:text-base text-destructive">{formatCurrency(pendingCreditsVal)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="print:shadow-none print:border-zinc-200">
          <CardContent className="flex items-center gap-3 p-5 print:p-3">
            <div className="rounded-lg bg-[hsl(var(--success))]/10 p-3 text-[hsl(var(--success))] print:bg-zinc-100 print:text-zinc-900"><Percent className="h-5 w-5" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Credit Recovery</p>
              <p className="text-xl font-bold tracking-tight print:text-base text-[hsl(var(--success))]">{recoveryRateVal}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Split & Sales Breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 print:grid-cols-3 print:gap-4">
        <Card className="lg:col-span-2 print:shadow-none print:border-zinc-200">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">📊 Revenue Payment Methods (All-time)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex justify-between text-xs text-zinc-550 font-bold">
              <span className="text-[hsl(var(--success))]">💵 Cash: {formatCurrency(cashSales)} ({cashPercent}%)</span>
              <span className="text-primary">📱 UPI: {formatCurrency(upiSales)} ({upiPercent}%)</span>
              <span className="text-[hsl(var(--warning))]">⏳ Credit: {formatCurrency(creditSales)} ({creditPercent}%)</span>
            </div>
            
            <div className="h-4 w-full rounded-full bg-zinc-100 overflow-hidden flex print:border print:border-zinc-200">
              <div style={{ width: `${cashPercent}%` }} className="bg-[hsl(var(--success))] h-full" title="Cash" />
              <div style={{ width: `${upiPercent}%` }} className="bg-primary h-full" title="UPI" />
              <div style={{ width: `${creditPercent}%` }} className="bg-[hsl(var(--warning))] h-full" title="Credit" />
            </div>

            <p className="text-[10px] text-muted-foreground leading-relaxed">
              * Calculations are made automatically based on checkout invoices. Debt collection receipts are categorized separately inside credit recovery statements.
            </p>
          </CardContent>
        </Card>

        <Card className="print:shadow-none print:border-zinc-200">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">🛒 Inventory Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center text-sm border-b border-zinc-100 pb-2">
              <span className="text-muted-foreground">Catalog Products:</span>
              <span className="font-bold">{inventory.length}</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-zinc-100 pb-2">
              <span className="text-muted-foreground">Low Stock Warnings:</span>
              <span className={`font-bold ${inventory.filter((i) => i.stock <= 5).length > 0 ? "text-destructive" : ""}`}>
                {inventory.filter((i) => i.stock <= 5).length}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Total Invoices:</span>
              <span className="font-bold">{sales.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="comparison" className="print:block">
        <TabsList className="no-print">
          <TabsTrigger value="comparison">This vs Last Week</TabsTrigger>
          <TabsTrigger value="daily">Daily Sales</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Trend</TabsTrigger>
        </TabsList>

        <TabsContent value="comparison" className="mt-4 print:mt-0 print:block">
          <Card className="print:shadow-none print:border-zinc-200 print:break-inside-avoid">
            <CardHeader><CardTitle className="text-base">This Week vs Last Week Performance</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={combinedWeekDataVal}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} formatter={(v: number) => formatCurrency(v)} />
                  <Legend />
                  <Bar dataKey="thisWeek" name="This Week" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="lastWeek" name="Last Week" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="daily" className="mt-4 print:hidden">
          <Card>
            <CardHeader><CardTitle className="text-base">Daily Sales</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={salesLast7DaysVal}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} formatter={(v: number) => [formatCurrency(v), "Sales"]} />
                  <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="mt-4 print:hidden">
          <Card>
            <CardHeader><CardTitle className="text-base">Revenue vs Profit</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} formatter={(v: number) => formatCurrency(v)} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" name="Revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="profit" name="Profit" stroke="hsl(var(--success))" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Top Products Tables */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 print:grid-cols-2 print:gap-4 print:break-inside-avoid">
        <Card className="print:shadow-none print:border-zinc-200">
          <CardHeader><CardTitle className="text-base">🏆 Top 5 Best-Selling Products</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Sold</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dynamicTopProducts.map((p) => (
                  <TableRow key={p.name}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell className="text-right">{p.sold}</TableCell>
                    <TableCell className="text-right">{formatCurrency(p.revenue)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="print:shadow-none print:border-zinc-200">
          <CardHeader><CardTitle className="text-base">💰 Top 5 Most Profitable Products</CardTitle></CardHeader>
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
                {dynamicTopProfitProducts.map((p) => (
                  <TableRow key={p.name}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell className="text-right text-[hsl(var(--success))] font-semibold">{p.margin}%</TableCell>
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

export default Reports;
