import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Minus, Trash2, Search, X, RotateCcw, User, Phone, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { useData } from "@/contexts/DataContext";
import { toast } from "sonner";

interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  emoji: string;
}

const getEmoji = (name: string, category: string) => {
  const n = name.toLowerCase();
  if (n.includes("butter")) return "🧈";
  if (n.includes("milk")) return "🥛";
  if (n.includes("bread")) return "🍞";
  if (n.includes("egg")) return "🥚";
  if (n.includes("salt")) return "🧂";
  if (n.includes("maggi") || n.includes("noodle")) return "🍜";
  if (n.includes("soap") || n.includes("dettol")) return "🧼";
  if (n.includes("rice")) return "🍚";
  if (n.includes("sugar")) return "🍬";
  if (n.includes("tea")) return "🍵";
  if (n.includes("oil")) return "🫗";
  if (n.includes("atta") || n.includes("flour")) return "🌾";
  if (n.includes("dal") || n.includes("bean")) return "🫘";
  if (n.includes("chips") || n.includes("potato")) return "🥔";
  if (n.includes("colgate") || n.includes("brush")) return "🪥";
  if (n.includes("vim") || n.includes("sponge")) return "🧽";
  if (n.includes("biscuit") || n.includes("parle") || n.includes("cookie")) return "🍪";
  if (n.includes("cold drink") || n.includes("cola") || n.includes("beverage")) return "🥤";
  
  const cat = category.toLowerCase();
  if (cat.includes("grocery")) return "🛒";
  if (cat.includes("dairy")) return "🥛";
  if (cat.includes("snacks")) return "🍪";
  if (cat.includes("cleaning")) return "🧼";
  if (cat.includes("personal")) return "🧴";
  return "📦";
};

const FastSale = () => {
  const navigate = useNavigate();
  const { inventory, addSale, credits } = useData();
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [recentSales, setRecentSales] = useState<{ items: CartItem[]; total: number; method: string; time: string }[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [busyMode, setBusyMode] = useState(true);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  
  // Credit Dialog States
  const [creditDialogOpen, setCreditDialogOpen] = useState(false);
  const [creditCustomerName, setCreditCustomerName] = useState("");
  const [creditCustomerPhone, setCreditCustomerPhone] = useState("");
  
  const searchRef = useRef<HTMLInputElement>(null);
  const beepAudio = useRef<AudioContext | null>(null);

  // Map inventory items to POS catalog
  const products = inventory.map(item => ({
    id: item.id,
    name: item.name,
    price: item.sellingPrice,
    emoji: getEmoji(item.name, item.category),
    stock: item.stock,
    category: item.category
  }));

  // Offline detection
  useEffect(() => {
    const goOffline = () => setIsOffline(true);
    const goOnline = () => setIsOffline(false);
    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const addProduct = useCallback((product: typeof products[0]) => {
    // Check stock limit
    const existing = cart.find((i) => i.id === product.id);
    const currentQty = existing ? existing.qty : 0;
    
    if (currentQty >= product.stock) {
      toast.error(`Cannot add more. Only ${product.stock} items left in inventory!`);
      return;
    }

    setCart((prev) => {
      if (existing) return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { id: product.id, name: product.name, price: product.price, qty: 1, emoji: product.emoji }];
    });
  }, [cart]);

  const updateQty = useCallback((id: string, delta: number) => {
    const product = products.find(p => p.id === id);
    if (delta > 0 && product) {
      const existing = cart.find(i => i.id === id);
      if (existing && existing.qty >= product.stock) {
        toast.error(`Cannot add more. Only ${product.stock} items in stock!`);
        return;
      }
    }

    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty: i.qty + delta } : i)).filter((i) => i.qty > 0));
  }, [cart, products]);

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
    (method: "Cash" | "UPI" | "Credit", customerName = "Walk-in Customer", customerPhone = "") => {
      if (cart.length === 0) return;
      
      // Call DataContext to execute transaction and deduct stocks
      addSale(cart, method, customerName, customerPhone);
      
      playBeep();
      setRecentSales((prev) => [
        { 
          items: [...cart], 
          total, 
          method, 
          time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) 
        },
        ...prev.slice(0, 9),
      ]);
      setCart([]);
      setSearch("");
      
      if (busyMode) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 600);
      }
    },
    [cart, total, playBeep, busyMode, addSale]
  );

  const handleCreditCheckout = () => {
    if (cart.length === 0) return;
    setCreditCustomerName("");
    setCreditCustomerPhone("");
    setCreditDialogOpen(true);
  };

  const submitCreditSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (!creditCustomerName) {
      toast.error("Please enter a customer name");
      return;
    }
    completeSale("Credit", creditCustomerName, creditCustomerPhone);
    setCreditDialogOpen(false);
  };

  const repeatLastSale = useCallback(() => {
    if (recentSales.length === 0) return;
    
    // Check if stock is available for all items
    const canRepeat = recentSales[0].items.every(item => {
      const prod = products.find(p => p.id === item.id);
      return prod && prod.stock >= item.qty;
    });

    if (!canRepeat) {
      toast.error("Cannot repeat last sale. Some items do not have enough stock available!");
      return;
    }

    setCart(recentSales[0].items.map((i) => ({ ...i })));
  }, [recentSales, products]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "F1") { e.preventDefault(); completeSale("Cash"); }
      if (e.key === "F2") { e.preventDefault(); completeSale("UPI"); }
      if (e.key === "F3") { e.preventDefault(); handleCreditCheckout(); }
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
    ? products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()))
    : products;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background select-none">
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

      <header className="flex h-14 items-center justify-between border-b border-zinc-200 bg-white px-4 shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => navigate("/sales")}>
            <ArrowLeft className="h-4 w-4 text-zinc-500" />
          </Button>
          <h1 className="text-sm font-bold text-zinc-900 tracking-tight">⚡ Fast Sale</h1>
          <Badge
            variant={busyMode ? "default" : "secondary"}
            className="cursor-pointer select-none text-[10px]"
            onClick={() => setBusyMode(!busyMode)}
          >
            {busyMode ? "Beep ON" : "Beep OFF"}
          </Badge>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={repeatLastSale}
            disabled={recentSales.length === 0}
            className="h-8 rounded-lg text-xs"
          >
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Repeat Last
          </Button>
          <div className="text-right">
            <p className="text-[9px] text-zinc-400 uppercase tracking-wide">Total Amount</p>
            <p className="text-xl font-black tabular-nums text-zinc-900 leading-tight">
              {formatCurrency(total)}
            </p>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Product Grid */}
        <div className="flex-1 flex flex-col overflow-hidden bg-zinc-50">
          <div className="p-3 border-b border-zinc-200/60 bg-white shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input ref={searchRef} placeholder="Type to search catalog..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 pr-9 h-9 rounded-xl border-zinc-200" />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 text-sm text-zinc-400 font-medium">
                No matching items in stock
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {filteredProducts.map((product) => {
                  const inCart = cart.find((i) => i.id === product.id);
                  const isOutOfStock = product.stock <= 0;
                  
                  return (
                    <button
                      key={product.id}
                      onClick={() => !isOutOfStock && addProduct(product)}
                      disabled={isOutOfStock}
                      className={cn(
                        "relative flex flex-col items-center justify-center gap-1.5 rounded-2xl border p-3.5 text-center transition-all bg-white min-h-[108px] select-none",
                        isOutOfStock
                          ? "opacity-45 border-zinc-200 bg-zinc-100 cursor-not-allowed"
                          : inCart 
                            ? "border-blue-500 ring-1 ring-blue-500 shadow-sm" 
                            : "border-zinc-200 hover:border-zinc-300 hover:shadow-sm active:scale-95"
                      )}
                    >
                      <span className="text-2xl">{product.emoji}</span>
                      <span className="text-[10px] font-bold text-zinc-850 leading-tight line-clamp-2">{product.name}</span>
                      <span className="text-xs font-black text-blue-600">{formatCurrency(product.price)}</span>
                      
                      {/* Stock level badge */}
                      <span className={cn(
                        "text-[8px] font-semibold mt-0.5 px-1.5 py-0.2 rounded-full border",
                        isOutOfStock
                          ? "bg-zinc-200 text-zinc-500 border-zinc-350"
                          : product.stock <= 5
                            ? "bg-red-50 text-red-650 border-red-100"
                            : "bg-zinc-50 text-zinc-500 border-zinc-200"
                      )}>
                        {isOutOfStock ? "Out of Stock" : `${product.stock} left`}
                      </span>

                      {inCart && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] font-black bg-blue-600 text-white">
                          {inCart.qty}
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 border-t border-zinc-200/80 bg-white px-4 py-2 text-[10px] text-zinc-400 shrink-0 font-medium">
            <span><kbd className="rounded bg-zinc-100 border border-zinc-200 px-1 py-0.2 font-mono text-[9px]">F1</kbd> Cash</span>
            <span><kbd className="rounded bg-zinc-100 border border-zinc-200 px-1 py-0.2 font-mono text-[9px]">F2</kbd> UPI</span>
            <span><kbd className="rounded bg-zinc-100 border border-zinc-200 px-1 py-0.2 font-mono text-[9px]">F3</kbd> Credit</span>
            <span><kbd className="rounded bg-zinc-100 border border-zinc-200 px-1 py-0.2 font-mono text-[9px]">F4</kbd> Repeat</span>
            <span><kbd className="rounded bg-zinc-100 border border-zinc-200 px-1 py-0.2 font-mono text-[9px]">Esc</kbd> Clear</span>
          </div>
        </div>

        {/* Right: Cart + Payment */}
        <div className="w-80 border-l border-zinc-200 bg-white flex flex-col shrink-0">
          <div className="flex-1 overflow-y-auto p-4 space-y-1.5 no-scrollbar">
            <h2 className="text-[9px] font-bold text-zinc-450 uppercase tracking-wider mb-2 block">
              Cart ({cart.reduce((s, i) => s + i.qty, 0)} items)
            </h2>
            {cart.length === 0 && (
              <div className="text-center py-16 text-zinc-400 space-y-2">
                <span className="text-3xl block">🛒</span>
                <p className="text-xs font-semibold">Basket is empty</p>
                <p className="text-[10px] text-zinc-400 leading-tight">Select products on the grid to build invoice.</p>
              </div>
            )}
            {cart.map((item) => (
              <div key={item.id} className="flex items-center gap-2 rounded-xl border border-zinc-200 p-2 bg-zinc-50/40">
                <span className="text-lg shrink-0">{item.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-zinc-850 truncate">{item.name}</p>
                  <p className="text-[10px] text-zinc-400 font-medium">{formatCurrency(item.price)} × {item.qty} = {formatCurrency(item.price * item.qty)}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => updateQty(item.id, -1)} className="h-6 w-6 rounded-md border border-zinc-200 flex items-center justify-center hover:bg-zinc-100 transition-colors">
                    <Minus className="h-3 w-3 text-zinc-500" />
                  </button>
                  <span className="w-5 text-center text-xs font-black tabular-nums">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)} className="h-6 w-6 rounded-md border border-zinc-200 flex items-center justify-center hover:bg-zinc-100 transition-colors">
                    <Plus className="h-3 w-3 text-zinc-500" />
                  </button>
                  <button onClick={() => removeItem(item.id)} className="h-6 w-6 rounded-md flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors ml-0.5">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-zinc-100 p-4 space-y-3.5 shrink-0 bg-zinc-50/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-500">Subtotal</span>
              <span className="text-lg font-black tabular-nums text-zinc-950">
                {formatCurrency(total)}
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <Button 
                onClick={() => completeSale("Cash")} 
                disabled={cart.length === 0} 
                className="h-12 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm"
              >
                💵 Cash
              </Button>
              <Button 
                onClick={() => completeSale("UPI")} 
                disabled={cart.length === 0} 
                className="h-12 text-xs font-bold bg-blue-600 hover:bg-blue-750 text-white rounded-xl shadow-sm"
              >
                📱 UPI
              </Button>
              <Button 
                onClick={handleCreditCheckout} 
                disabled={cart.length === 0} 
                className="h-12 text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white rounded-xl shadow-sm"
              >
                📋 Credit
              </Button>
            </div>
            
            <Button variant="ghost" className="w-full text-xs hover:bg-zinc-100 h-8 rounded-lg text-zinc-500" onClick={() => { setCart([]); setSearch(""); }} disabled={cart.length === 0}>
              Clear Cart
            </Button>
          </div>

          {recentSales.length > 0 && (
            <div className="border-t border-zinc-100 p-3 shrink-0 bg-white">
              <h3 className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Recent Bills</h3>
              <div className="space-y-1.5">
                {recentSales.slice(0, 4).map((sale, i) => (
                  <div key={i} className="flex items-center justify-between text-[10px]">
                    <span className="text-zinc-400 font-medium">{sale.time}</span>
                    <Badge variant="secondary" className="text-[8px] py-0 bg-zinc-100 text-zinc-600 border border-zinc-200/50">{sale.method}</Badge>
                    <span className="font-bold text-zinc-800">{formatCurrency(sale.total)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Select Credit Customer Dialog */}
      <Dialog open={creditDialogOpen} onOpenChange={setCreditDialogOpen}>
        <DialogContent className="max-w-xs p-5 rounded-2xl border-zinc-200">
          <DialogHeader className="space-y-1.5">
            <DialogTitle className="text-sm font-bold text-zinc-900">Record Credit Transaction</DialogTitle>
            <p className="text-[10px] text-zinc-400">Specify details for the Udhari ledger.</p>
          </DialogHeader>
          <form onSubmit={submitCreditSale} className="space-y-3 pt-2">
            <div className="space-y-1">
              <Label htmlFor="custName" className="text-[10px] font-semibold text-zinc-500">Customer Name *</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                <Input
                  id="custName"
                  placeholder="Enter name"
                  value={creditCustomerName}
                  onChange={(e) => setCreditCustomerName(e.target.value)}
                  className="pl-9 text-xs h-9 rounded-xl border-zinc-200 bg-zinc-50/40"
                  required
                />
              </div>
              
              {/* Existing customers auto-fill links */}
              {credits.length > 0 && !creditCustomerName && (
                <div className="mt-1.5 space-y-1">
                  <span className="text-[8px] font-semibold text-zinc-400 uppercase block tracking-wider">Select Existing:</span>
                  <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto no-scrollbar">
                    {credits.slice(0, 5).map(c => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setCreditCustomerName(c.name);
                          setCreditCustomerPhone(c.phone);
                        }}
                        className="text-[9px] bg-zinc-100 hover:bg-zinc-200 text-zinc-700 px-1.5 py-0.5 rounded border border-zinc-200/80"
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="custPhone" className="text-[10px] font-semibold text-zinc-500">Phone Number (Optional)</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                <Input
                  id="custPhone"
                  placeholder="e.g. 98765 43210"
                  value={creditCustomerPhone}
                  onChange={(e) => setCreditCustomerPhone(e.target.value)}
                  className="pl-9 text-xs h-9 rounded-xl border-zinc-200 bg-zinc-50/40"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-9 rounded-xl text-xs">
                Confirm Credit Sale (₹{total})
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FastSale;
