import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";
import { Download, TrendingUp, ArrowUpRight, Percent, Users } from "lucide-react";
import {
  monthlyRevenue, salesLast7Days, lastWeekSales, formatCurrency,
  topProfitProducts, topProducts, creditRecoveryRate, thisWeekTotal, lastWeekTotal, weekGrowth,
} from "@/lib/mockData";
import { toast } from "sonner";

const combinedWeekData = salesLast7Days.map((d, i) => ({
  day: d.day,
  thisWeek: d.sales,
  lastWeek: lastWeekSales[i].sales,
}));

const Reports = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">📊 Analytics & Reports</h1>
        <Button variant="outline" onClick={() => toast.success("Report download started")}>
          <Download className="mr-2 h-4 w-4" /> Export
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <div className="rounded-lg bg-success/10 p-3 text-success"><TrendingUp className="h-5 w-5" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Weekly Growth</p>
              <p className="text-xl font-bold">{weekGrowth}%</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <div className="rounded-lg bg-primary/10 p-3 text-primary"><ArrowUpRight className="h-5 w-5" /></div>
            <div>
              <p className="text-xs text-muted-foreground">This Week Sales</p>
              <p className="text-xl font-bold">{formatCurrency(thisWeekTotal)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <div className="rounded-lg bg-warning/10 p-3 text-warning"><Percent className="h-5 w-5" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Avg Margin</p>
              <p className="text-xl font-bold">15.6%</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <div className="rounded-lg bg-success/10 p-3 text-success"><Users className="h-5 w-5" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Credit Recovery</p>
              <p className="text-xl font-bold">{creditRecoveryRate}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="comparison">
        <TabsList>
          <TabsTrigger value="comparison">This vs Last Week</TabsTrigger>
          <TabsTrigger value="daily">Daily Sales</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Trend</TabsTrigger>
        </TabsList>

        <TabsContent value="comparison" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">This Week vs Last Week</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={combinedWeekData}>
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

        <TabsContent value="daily" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Daily Sales</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesLast7Days}>
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

        <TabsContent value="monthly" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Revenue vs Profit</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
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
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">🏆 Top 5 Best-Selling</CardTitle></CardHeader>
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
                {topProducts.map((p) => (
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

        <Card>
          <CardHeader><CardTitle className="text-base">💰 Top 5 Most Profitable</CardTitle></CardHeader>
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
      </div>
    </div>
  );
};

export default Reports;
