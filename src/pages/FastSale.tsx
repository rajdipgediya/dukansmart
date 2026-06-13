import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Minus, Trash2, Search, X, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const quickProducts = [
  { id: "q1", name: "Amul Butter", price: 50, emoji: "🧈" },
  { id: "q2", name: "Milk 500ml", price: 28, emoji: "🥛" },
  { id: "q3", name: "Bread", price: 35, emoji: "🍞" },
  { id: "q4", name: "Eggs (6)", price: 42, emoji: "🥚" },
  { id: "q5", name: "Parle-G", price: 10, emoji: "🍪" },
  { id: "q6", name: "Cold Drink", price: 40, emoji: "🥤" },
  { id: "q7", name: "Tata Salt", price: 20, emoji: "🧂" },
  { id: "q8", name: "Maggi", price: 14, emoji: "🍜" },
  { id: "q9", name: "Surf Excel", price: 130, emoji: "🧴" },
  { id: "q10", name: "Dettol Soap", price: 42, emoji: "🧼" },
  { id: "q11", name: "Rice 1kg", price: 55, emoji: "🍚" },
  { id: "q12", name: "Sugar 1kg", price: 45, emoji: "🍬" },
  { id: "q13", name: "Tea 250g", price: 110, emoji: "🍵" },
  { id: "q14", name: "Oil 1L", price: 150, emoji: "🫗" },
  { id: "q15", name: "Atta 1kg", price: 38, emoji: "🌾" },
  { id: "q16", name: "Dal 1kg", price: 120, emoji: "🫘" },
  { id: "q17", name: "Biscuit Pack", price: 20, emoji: "🍘" },
  { id: "q18", name: "Chips", price: 20, emoji: "🥔" },
  { id: "q19", name: "Colgate", price: 100, emoji: "🪥" },
  { id: "q20", name: "Vim Bar", price: 22, emoji: "🧽" },
];

interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  emoji: string;
}

const FastSale = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [recentSales, setRecentSales] = useState<{ items: CartItem[]; total: number; method: string; time: string }[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [busyMode, setBusyMode] = useState(true);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const searchRef = useRef<HTMLInputElement>(null);
  const beepAudio = useRef<AudioContext | null>(null);

  // Offline detection
  useEffect(() => {
    const goOffline = () => setIsOffline(true);
    const goOnline = () => setIsOffline(false);
    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => { window.removeEventListener("offline", goOffline); window.removeEventListener("online", goOnline); };
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const addProduct = useCallback((product: typeof quickProducts[0]) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { ...product, qty: 1 }];
    });
  }, []);

  const updateQty = useCallback((id: string, delta: number) => {
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty: i.qty + delta } : i)).filter((i) => i.qty > 0));
  }, []);

  const removeItem = useCallback((id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const playBeep = useCallback(() => {
    if (!busyMode) return;
    try {
      if (!beepAudio.current) beepAudio.current = new AudioContext();
      const ctx = beepAudio.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 800;
      gain.gain.value = 0.15;
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {}
  }, [busyMode]);

  const completeSale = useCallback(
    (method: string) => {
      if (cart.length === 0) return;
      playBeep();
      setRecentSales((prev) => [
        { items: [...cart], total, method, time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) },
        ...prev.slice(0, 9),
      ]);
      setCart([]);
      setSearch("");
      if (busyMode) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 600);
      }
    },
    [cart, total, playBeep, busyMode]
  );

  const repeatLastSale = useCallback(() => {
    if (recentSales.length === 0) return;
    setCart(recentSales[0].items.map((i) => ({ ...i })));
  }, [recentSales]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "F1") { e.preventDefault(); completeSale("Cash"); }
      if (e.key === "F2") { e.preventDefault(); completeSale("UPI"); }
      if (e.key === "F3") { e.preventDefault(); completeSale("Credit"); }
      if (e.key === "F4") { e.preventDefault(); repeatLastSale(); }
      if (e.key === "Escape") { setCart([]); setSearch(""); }
      if (e.key.length === 1 && /[a-zA-Z]/.test(e.key) && document.activeElement !== searchRef.current) {
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [completeSale, repeatLastSale]);

  const filteredProducts = search
    ? quickProducts.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    : quickProducts;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      {showSuccess && (
        <div className="absolute inset-0 z-[60] pointer-events-none flex items-center justify-center">
          <div className="bg-[hsl(var(--success))]/20 rounded-full p-8 animate-ping" />
          <span className="absolute text-3xl font-bold text-[hsl(var(--success))]">✓ Saved!</span>
        </div>
      )}

      {/* Offline Banner */}
      {isOffline && (
        <div className="bg-[hsl(var(--warning))] text-[hsl(var(--warning-foreground))] text-center py-1 text-sm font-semibold shrink-0">
          📡 Offline — Sales will sync when connection returns
        </div>
      )}

      <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3 shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/sales")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">⚡ Fast Sale</h1>
          <Badge
            variant={busyMode ? "default" : "secondary"}
            className="cursor-pointer select-none"
            onClick={() => setBusyMode(!busyMode)}
          >
            {busyMode ? "Busy Mode ON" : "Busy Mode OFF"}
          </Badge>
        </div>
        <div className="flex items-center gap-4">
          {/* Repeat Last Sale */}
          <Button
            variant="outline"
            onClick={repeatLastSale}
            disabled={recentSales.length === 0}
            className="h-10"
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Repeat Last
          </Button>
          <div className="text-right">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Total</p>
            <p className={cn("text-3xl font-black tabular-nums transition-colors", total > 0 ? "text-[hsl(var(--success))]" : "text-muted-foreground")}>
              {formatCurrency(total)}
            </p>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Product Grid */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-border shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input ref={searchRef} placeholder="Type to search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 pr-9" />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2">
              {filteredProducts.map((product) => {
                const inCart = cart.find((i) => i.id === product.id);
                return (
                  <button
                    key={product.id}
                    onClick={() => addProduct(product)}
                    className={cn(
                      "relative flex flex-col items-center justify-center gap-1 rounded-xl border-2 p-3 text-center transition-all active:scale-95 hover:shadow-md min-h-[100px]",
                      inCart ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card hover:border-primary/40"
                    )}
                  >
                    <span className="text-2xl">{product.emoji}</span>
                    <span className="text-xs font-semibold leading-tight line-clamp-2">{product.name}</span>
                    <span className="text-xs font-bold text-primary">{formatCurrency(product.price)}</span>
                    {inCart && (
                      <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs font-bold">
                        {inCart.qty}
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-4 border-t border-border px-4 py-2 text-xs text-muted-foreground shrink-0">
            <span><kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">F1</kbd> Cash</span>
            <span><kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">F2</kbd> UPI</span>
            <span><kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">F3</kbd> Credit</span>
            <span><kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">F4</kbd> Repeat</span>
            <span><kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">Esc</kbd> Clear</span>
          </div>
        </div>

        {/* Right: Cart + Payment */}
        <div className="w-80 xl:w-96 border-l border-border bg-card flex flex-col shrink-0">
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Cart ({cart.reduce((s, i) => s + i.qty, 0)} items)
            </h2>
            {cart.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Click products to add</p>}
            {cart.map((item) => (
              <div key={item.id} className="flex items-center gap-2 rounded-lg border border-border p-2 bg-background">
                <span className="text-lg">{item.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{formatCurrency(item.price)} × {item.qty} = {formatCurrency(item.price * item.qty)}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => updateQty(item.id, -1)} className="h-7 w-7 rounded-md border border-border flex items-center justify-center hover:bg-muted transition-colors">
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-6 text-center text-sm font-bold tabular-nums">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)} className="h-7 w-7 rounded-md border border-border flex items-center justify-center hover:bg-muted transition-colors">
                    <Plus className="h-3 w-3" />
                  </button>
                  <button onClick={() => removeItem(item.id)} className="h-7 w-7 rounded-md flex items-center justify-center text-destructive hover:bg-destructive/10 transition-colors ml-1">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border p-4 space-y-3 shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">Total</span>
              <span className={cn("text-2xl font-black tabular-nums", total > 0 ? "text-[hsl(var(--success))]" : "text-muted-foreground")}>
                {formatCurrency(total)}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Button onClick={() => completeSale("Cash")} disabled={cart.length === 0} className="h-14 text-base font-bold bg-[hsl(var(--success))] hover:bg-[hsl(142,71%,38%)] text-white">
                💵 Cash
              </Button>
              <Button onClick={() => completeSale("UPI")} disabled={cart.length === 0} className="h-14 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground">
                📱 UPI
              </Button>
              <Button onClick={() => completeSale("Credit")} disabled={cart.length === 0} variant="destructive" className="h-14 text-base font-bold">
                📋 Credit
              </Button>
            </div>
            <Button variant="outline" className="w-full" onClick={() => { setCart([]); setSearch(""); }} disabled={cart.length === 0}>
              Clear Cart
            </Button>
          </div>

          {recentSales.length > 0 && (
            <div className="border-t border-border p-3 shrink-0">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Recent</h3>
              <div className="space-y-1">
                {recentSales.slice(0, 5).map((sale, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{sale.time}</span>
                    <Badge variant="secondary" className="text-[10px]">{sale.method}</Badge>
                    <span className="font-semibold">{formatCurrency(sale.total)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FastSale;
