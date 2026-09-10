import Link from 'next/link';
import { Leaf, ArrowRight, ShieldCheck, TrendingDown, Clock, MapPin, Zap, Globe, Sparkles } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 overflow-hidden relative selection:bg-emerald-200 selection:text-emerald-900">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 inset-x-0 h-screen overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-emerald-400/20 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 blur-[120px]" />
        <div className="absolute bottom-[10%] left-[20%] w-[60%] h-[40%] rounded-full bg-teal-400/10 blur-[150px]" />
      </div>

      {/* Navbar */}
      <header className="fixed top-0 inset-x-0 bg-white/70 backdrop-blur-xl border-b border-white/50 px-6 py-4 flex items-center justify-between z-50 transition-all shadow-sm">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-600 group cursor-pointer">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg shadow-emerald-500/30 group-hover:scale-105 transition-transform duration-300">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-slate-900 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">FoodLoop AI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">
              Sign In
            </Link>
            <Link href="/register" className="px-6 py-2.5 text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2">
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center text-center px-6 pt-40 pb-20 lg:pt-48 lg:pb-32 relative z-10">
        <div className="animate-fade-in-up flex flex-col items-center">

          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 max-w-5xl mb-8 leading-[1.1]">
            Smart Food Waste Management & <br className="hidden md:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600">
              Redistribution
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mb-12 leading-relaxed font-medium">
            AI-powered demand prediction, automated inventory tracking, and seamless surplus redistribution for a zero-waste future.
          </p>
          <div className="flex flex-col sm:flex-row gap-5">
            <Link href="/login" className="px-8 py-4 text-lg font-bold bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl shadow-xl shadow-slate-900/20 hover:shadow-slate-900/40 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 group">
              Try Demo 
              <div className="bg-white/20 rounded-full p-1 group-hover:bg-white/30 transition-colors">
                <ArrowRight className="h-5 w-5" />
              </div>
            </Link>
            <Link href="https://github.com" className="px-8 py-4 text-lg font-bold bg-white text-slate-800 border-2 border-slate-200 rounded-2xl shadow-sm hover:bg-slate-50 hover:border-slate-300 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
              <Globe className="h-5 w-5 text-slate-500" /> View Source
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full mt-32 text-left relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-50/50 to-transparent -mx-screen blur-3xl -z-10" />
          
          <div className="group bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-xl shadow-slate-200/40 border border-white/50 hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-500 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-100 rounded-full opacity-50 blur-2xl group-hover:bg-blue-200 transition-colors duration-500" />
            <div className="h-14 w-14 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-500">
              <TrendingDown className="h-7 w-7" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 mb-4 tracking-tight">Demand Prediction</h3>
            <p className="text-slate-600 leading-relaxed font-medium">
              AI models predict exact food demand based on historical data, weather, and events to stop overproduction before it happens.
            </p>
          </div>
          
          <div className="group bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-xl shadow-slate-200/40 border border-white/50 hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-500 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-purple-100 rounded-full opacity-50 blur-2xl group-hover:bg-purple-200 transition-colors duration-500" />
            <div className="h-14 w-14 bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-500">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 mb-4 tracking-tight">Smart Inventory</h3>
            <p className="text-slate-600 leading-relaxed font-medium">
              Automated expiry tracking using barcode/OCR scanning. Get alerts before items expire so they can be used or donated.
            </p>
          </div>

          <div className="group bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-xl shadow-slate-200/40 border border-white/50 hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-500 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-amber-100 rounded-full opacity-50 blur-2xl group-hover:bg-amber-200 transition-colors duration-500" />
            <div className="h-14 w-14 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform duration-500">
              <MapPin className="h-7 w-7" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 mb-4 tracking-tight">Optimized Logistics</h3>
            <p className="text-slate-600 leading-relaxed font-medium">
              Automatically matches surplus food with the nearest NGOs and calculates the most efficient delivery route for drivers.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 pt-20 pb-10 px-6 border-t border-slate-800 relative z-10 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-emerald-500 opacity-90">
            <Leaf className="h-6 w-6" />
            <span className="text-xl font-extrabold tracking-tight text-white">FoodLoop AI</span>
          </div>
          <p className="text-slate-400 font-medium text-sm">© 2026 FoodLoop AI. Empowering communities toward zero waste.</p>
        </div>
      </footer>
    </div>
  );
}
