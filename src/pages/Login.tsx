import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Store, LogIn, User, Key, Sparkles, Receipt, Package, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    setTimeout(() => {
      const result = login(email, password);
      setLoading(false);
      if (result.success) {
        navigate("/");
      } else {
        setError(result.error || "Login failed");
      }
    }, 450);
  };

  return (
    <div className="h-screen w-screen flex bg-zinc-50 text-zinc-900 overflow-hidden font-sans relative select-none">
      
      {/* Self-contained CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideInLeft {
          from { transform: translateX(-30px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        @keyframes slideInRight {
          from { transform: translateX(30px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        @keyframes fadeInUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes drawStroke {
          from { stroke-dashoffset: 120; }
          to { stroke-dashoffset: 0; }
        }

        .animate-fade-in {
          animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-slide-left {
          opacity: 0;
          animation: slideInLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-slide-right {
          opacity: 0;
          animation: slideInRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-fade-up {
          opacity: 0;
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-draw {
          stroke-dasharray: 120;
          stroke-dashoffset: 120;
          animation: drawStroke 1.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .delay-1 { animation-delay: 80ms; }
        .delay-2 { animation-delay: 180ms; }
        .delay-3 { animation-delay: 300ms; }
        .delay-4 { animation-delay: 450ms; }
        .delay-5 { animation-delay: 600ms; }
      `}</style>

      {/* Left Panel - Brand & Live Dashboard Preview (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-7/12 flex-col justify-between p-12 relative overflow-hidden bg-zinc-100/40 border-r border-zinc-200/60">
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.25] pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center space-x-2.5 z-10 animate-fade-in">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 shadow-sm transition-transform duration-300 hover:rotate-12">
            <Store className="h-5 w-5 text-white" />
          </div>
          <span className="text-base font-bold tracking-tight text-zinc-900">
            DukaanSmart
          </span>
        </div>

        {/* High-Fidelity Dashboard Mockup Elements */}
        <div className="my-auto z-10 space-y-8 max-w-lg">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-zinc-200/60 text-zinc-800 animate-fade-in delay-1">
              <Sparkles className="h-3 w-3 text-zinc-900" /> POS & Store Management
            </span>
            <h1 className="text-3xl xl:text-4xl font-black text-zinc-900 tracking-tight leading-[1.12] animate-slide-left delay-2">
              All your retail operations <br />
              <span className="text-zinc-400">in one modern dashboard.</span>
            </h1>
            <p className="text-zinc-500 text-xs leading-relaxed animate-slide-left delay-3">
              Optimize checkout lines, track inventory items, audit store ledger entries, and visualize sales reports. Engineered for modern retail store management.
            </p>
          </div>

          {/* High Fidelity Business Elements Visuals */}
          <div className="space-y-4 relative">
            
            {/* Sales Chart Mockup */}
            <div className="p-4 rounded-2xl border border-zinc-200 bg-white shadow-sm flex items-center justify-between animate-slide-left delay-4 hover:border-zinc-300 hover:shadow-md transition-all duration-300">
              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-wider font-semibold text-zinc-400 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-zinc-500" /> Daily Revenue
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-extrabold text-zinc-900 tracking-tight">₹45,820.00</span>
                  <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-lg animate-pulse">+14.2% today</span>
                </div>
              </div>
              {/* Mini Sparkline SVG */}
              <svg className="w-24 h-10" viewBox="0 0 100 30" fill="none">
                <path className="animate-draw delay-5" d="M0 25 Q15 15 30 20 T60 5 T90 15" stroke="#18181b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M0 25 Q15 15 30 20 T60 5 T90 15 L100 30 L0 30 Z" fill="url(#spark-grad)" opacity="0.03" />
                <defs>
                  <linearGradient id="spark-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#18181b" />
                    <stop offset="100%" stopColor="#18181b" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Stock Mockup */}
              <div className="p-4 rounded-2xl border border-zinc-200 bg-white shadow-sm space-y-3 animate-slide-left delay-5 hover:border-zinc-300 transition-all duration-300">
                <span className="text-[9px] uppercase tracking-wider font-semibold text-zinc-400 flex items-center gap-1">
                  <Package className="h-3 w-3 text-zinc-500" /> Inventory Alerts
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-900">1,248 items in catalog</span>
                  <span className="text-[8px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-semibold border border-amber-100">2 warnings</span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-zinc-900 h-full rounded-full transition-all duration-1000 delay-5" style={{ width: '88%' }}></div>
                </div>
              </div>

              {/* Transactions Stream Mockup */}
              <div className="p-4 rounded-2xl border border-zinc-200 bg-white shadow-sm space-y-2 animate-slide-left delay-5 hover:border-zinc-300 transition-all duration-300 flex flex-col justify-between">
                <span className="text-[9px] uppercase tracking-wider font-semibold text-zinc-400 flex items-center gap-1">
                  <Receipt className="h-3 w-3 text-zinc-500" /> Live Register Receipts
                </span>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-zinc-650 font-medium">Inv #1024</span>
                    <span className="text-emerald-600 bg-emerald-50 px-1 py-0.2 rounded font-semibold text-[8px]">₹450 Paid</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-zinc-650 font-medium">Inv #1023</span>
                    <span className="text-zinc-500 bg-zinc-100 px-1 py-0.2 rounded font-semibold text-[8px]">₹1,200 Credit</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer Info */}
        <div className="text-[9px] text-zinc-455 z-10 animate-fade-in delay-5">
          &copy; {new Date().getFullYear()} DukaanSmart Dashboard. Verified secure workspace environment.
        </div>
      </div>

      {/* Right Panel - Login Form (Centered) */}
      <div className="w-full lg:w-5/12 flex items-center justify-center p-6 z-10 relative">
        {/* Subtle background overlay for texture in mobile */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-[0.15] lg:hidden pointer-events-none" />

        <div className="w-full max-w-sm space-y-6 z-10">
          
          {/* Logo header for mobile screens */}
          <div className="flex lg:hidden flex-col items-center text-center space-y-2 animate-fade-in">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-900 shadow-sm">
              <Store className="h-5.5 w-5.5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900">DukaanSmart</h1>
            <p className="text-zinc-500 text-xs">Sign in to your shop dashboard</p>
          </div>

          {/* Form Card */}
          <Card className="border-zinc-200 bg-white shadow-xl shadow-zinc-200/40 rounded-3xl overflow-hidden animate-slide-right delay-2">
            <CardContent className="pt-8 p-6 space-y-5">
              
              <div className="space-y-1">
                <h2 className="text-lg font-bold tracking-tight text-zinc-900">Sign in</h2>
                <p className="text-zinc-400 text-xs">Enter your details below to access your account.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {error && (
                  <div className="rounded-xl border border-red-100 bg-red-50/50 p-3.5 text-xs text-red-800 flex items-center gap-2 animate-bounce">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-600 shrink-0 animate-pulse" />
                    {error}
                  </div>
                )}

                <div className="space-y-1.5 animate-fade-up delay-3">
                  <Label htmlFor="email" className="text-zinc-500 font-semibold text-[9px] uppercase tracking-wider">
                    Email Address
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@shop.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                      className="pl-9 border-zinc-200 bg-zinc-50/60 text-zinc-900 placeholder-zinc-400 focus-visible:ring-zinc-900 focus-visible:border-zinc-900 focus:bg-white rounded-xl text-xs h-10 transition-all duration-300 shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 animate-fade-up delay-3">
                  <Label htmlFor="password" className="text-zinc-500 font-semibold text-[9px] uppercase tracking-wider">
                    Password
                  </Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                      className="pl-9 border-zinc-200 bg-zinc-50/60 text-zinc-900 placeholder-zinc-400 focus-visible:ring-zinc-900 focus-visible:border-zinc-900 focus:bg-white rounded-xl text-xs h-10 transition-all duration-300 shadow-sm"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-semibold h-10 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-xs shadow-md shadow-zinc-950/10 transform hover:scale-[1.01] active:scale-[0.99] animate-fade-up delay-4"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing In...
                    </span>
                  ) : (
                    <>
                      Sign In <LogIn className="h-3.5 w-3.5" />
                    </>
                  )}
                </Button>
              </form>

            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default Login;
