import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IndianRupee, TrendingUp, CreditCard, Banknote, Smartphone, Clock, Send } from "lucide-react";
import { dailySummary, formatCurrency } from "@/lib/mockData";
import { toast } from "sonner";

const stats = [
  { label: "Total Sales", value: dailySummary.totalSales, icon: IndianRupee, color: "text-primary" },
  { label: "Total Profit", value: dailySummary.totalProfit, icon: TrendingUp, color: "text-[hsl(var(--success))]" },
  { label: "Credit Given", value: dailySummary.creditGiven, icon: CreditCard, color: "text-[hsl(var(--warning))]" },
  { label: "Cash Received", value: dailySummary.cashReceived, icon: Banknote, color: "text-[hsl(var(--success))]" },
  { label: "UPI Received", value: dailySummary.upiReceived, icon: Smartphone, color: "text-primary" },
  { label: "Pending Collection", value: dailySummary.pendingCollection, icon: Clock, color: "text-destructive" },
];

const DailySummary = () => {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  const summaryText = `🏪 *DukaanSmart Daily Summary*\n📅 ${dateStr}\n\n💰 Total Sales: ${formatCurrency(dailySummary.totalSales)}\n📈 Profit: ${formatCurrency(dailySummary.totalProfit)}\n📋 Credit Given: ${formatCurrency(dailySummary.creditGiven)}\n💵 Cash: ${formatCurrency(dailySummary.cashReceived)}\n📱 UPI: ${formatCurrency(dailySummary.upiReceived)}\n⏳ Pending: ${formatCurrency(dailySummary.pendingCollection)}\n💸 Expenses: ${formatCurrency(dailySummary.totalExpenses)}\n✅ Real Profit: ${formatCurrency(dailySummary.realProfit)}`;

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
      <Card className="border-2 border-[hsl(var(--success))]">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="text-sm text-muted-foreground">Real Profit (Sales – Expenses)</p>
            <p className="text-4xl font-black text-[hsl(var(--success))] tabular-nums">
              {formatCurrency(dailySummary.realProfit)}
            </p>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <p>Expenses today: {formatCurrency(950)}</p>
            <p>Monthly total: {formatCurrency(dailySummary.totalExpenses)}</p>
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
