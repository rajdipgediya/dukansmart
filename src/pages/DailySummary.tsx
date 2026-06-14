import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IndianRupee, TrendingUp, CreditCard, Banknote, Smartphone, Clock, Send } from "lucide-react";
import { formatCurrency } from "@/lib/mockData";
import { useData } from "@/contexts/DataContext";
import { toast } from "sonner";

const DailySummary = () => {
  const { sales, expenses, credits, inventory } = useData();

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const todayStr = now.toISOString().split("T")[0];

  // Calculations based on live context data
  const todaySalesList = sales.filter((s) => s.date === todayStr);

  // New sales made today (non-recovery)
  const newSalesToday = todaySalesList.filter((s) => !s.id.startsWith("REC-"));
  const totalSalesVal = newSalesToday.reduce((sum, s) => sum + s.amount, 0);

  // Credit given today (new credit sales)
  const creditGivenVal = newSalesToday.filter((s) => s.paymentType === "Credit").reduce((sum, s) => sum + s.amount, 0);

  // Cash received today: Cash sales today + Credit recoveries in Cash today
  const cashSalesVal = newSalesToday.filter((s) => s.paymentType === "Cash").reduce((sum, s) => sum + s.amount, 0);
  const cashRecoveriesVal = todaySalesList.filter((s) => s.id.startsWith("REC-") && s.paymentType === "Cash").reduce((sum, s) => sum + s.amount, 0);
  const cashReceivedVal = cashSalesVal + cashRecoveriesVal;

  // UPI received today: UPI sales today + Credit recoveries in UPI today
  const upiSalesVal = newSalesToday.filter((s) => s.paymentType === "UPI").reduce((sum, s) => sum + s.amount, 0);
  const upiRecoveriesVal = todaySalesList.filter((s) => s.id.startsWith("REC-") && s.paymentType === "UPI").reduce((sum, s) => sum + s.amount, 0);
  const upiReceivedVal = upiSalesVal + upiRecoveriesVal;

  // Total pending collection across all customers
  const pendingCollectionVal = credits.reduce((sum, c) => sum + c.pending, 0);

  // Total monthly expenses logged
  const totalExpensesVal = expenses.reduce((sum, e) => sum + e.amount, 0);
  const dailyExpensesShare = Math.round(totalExpensesVal / 30);

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

  const totalProfitVal = calculateTodayProfit();
  const realProfitVal = totalProfitVal - dailyExpensesShare;

  const stats = [
    { label: "Total Sales", value: totalSalesVal, icon: IndianRupee, color: "text-primary" },
    { label: "Total Profit", value: totalProfitVal, icon: TrendingUp, color: "text-[hsl(var(--success))]" },
    { label: "Credit Given", value: creditGivenVal, icon: CreditCard, color: "text-[hsl(var(--warning))]" },
    { label: "Cash Received", value: cashReceivedVal, icon: Banknote, color: "text-[hsl(var(--success))]" },
    { label: "UPI Received", value: upiReceivedVal, icon: Smartphone, color: "text-primary" },
    { label: "Pending Collection", value: pendingCollectionVal, icon: Clock, color: "text-destructive" },
  ];

  const summaryText = `🏪 *DukaanSmart Daily Summary*\n📅 ${dateStr}\n\n💰 Total Sales: ${formatCurrency(totalSalesVal)}\n📈 Profit: ${formatCurrency(totalProfitVal)}\n📋 Credit Given: ${formatCurrency(creditGivenVal)}\n💵 Cash: ${formatCurrency(cashReceivedVal)}\n📱 UPI: ${formatCurrency(upiReceivedVal)}\n⏳ Pending: ${formatCurrency(pendingCollectionVal)}\n💸 Expenses: ${formatCurrency(totalExpensesVal)}\n✅ Real Profit: ${formatCurrency(realProfitVal)}`;

  const sendWhatsApp = () => {
    const encoded = encodeURIComponent(summaryText);
    window.open(`https://wa.me/?text=${encoded}`, "_blank");
    toast.success("Opening WhatsApp...");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(summaryText);
    toast.success("Summary copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">📊 Daily Summary</h1>
          <p className="text-muted-foreground">{dateStr}</p>
        </div>
        <Badge variant="secondary" className="text-sm">Auto-generated at 9 PM</Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`rounded-lg bg-accent p-3 ${s.color}`}>
                <s.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold tabular-nums">{formatCurrency(s.value)}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Real Profit Card */}
      <Card className={realProfitVal >= 0 ? "border-2 border-[hsl(var(--success))]" : "border-2 border-destructive bg-destructive/5"}>
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="text-sm text-muted-foreground">Real Profit (Sales Profit – Expenses Share)</p>
            <p className={`text-4xl font-black ${realProfitVal >= 0 ? "text-[hsl(var(--success))]" : "text-destructive"} tabular-nums`}>
              {formatCurrency(realProfitVal)}
            </p>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <p>Daily share of expenses: {formatCurrency(dailyExpensesShare)}</p>
            <p>Monthly expenses: {formatCurrency(totalExpensesVal)}</p>
          </div>
        </CardContent>
      </Card>

      {/* WhatsApp Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Share Summary</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Button onClick={sendWhatsApp} className="h-14 flex-1 text-base font-bold bg-[hsl(142,71%,45%)] hover:bg-[hsl(142,71%,38%)] text-white">
            <Send className="mr-2 h-5 w-5" /> Send on WhatsApp
          </Button>
          <Button variant="outline" onClick={copyToClipboard} className="h-14 flex-1 text-base font-bold">
            📋 Copy Summary
          </Button>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Preview Message</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="whitespace-pre-wrap rounded-lg bg-muted p-4 text-sm font-mono">
            {summaryText}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
};

export default DailySummary;
