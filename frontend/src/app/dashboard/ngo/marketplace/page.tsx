'use client';

import { ShoppingCart, Search, Filter, Loader2, MapPin, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export default function SurplusMarketplace() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleClaim = (item: string) => {
    toast.success(`Successfully requested claim for ${item}. Waiting for driver assignment.`);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center">
            <ShoppingCart className="h-8 w-8 mr-3 text-orange-500" />
            Surplus Marketplace
          </h1>
          <p className="text-slate-500 mt-2">Browse and claim available surplus food in your network.</p>
        </div>
      </div>

      <div className="flex space-x-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search for specific food types..." 
            className="w-full pl-12 pr-4 py-3 rounded-2xl border-slate-200 focus:border-orange-500 focus:ring-orange-500 transition-all shadow-sm"
          />
        </div>
        <button className="flex items-center px-6 py-3 font-bold text-slate-600 bg-white border border-slate-200 rounded-2xl shadow-sm hover:bg-slate-50 transition-colors">
          <Filter className="h-5 w-5 mr-2" />
          Filters
        </button>
      </div>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center text-slate-400">
          <Loader2 className="h-10 w-10 animate-spin mb-4 text-orange-500" />
          <p className="font-medium animate-pulse">Loading live marketplace data...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { id: 1, food: 'Mixed Vegetable Curry', qty: '20 kg', distance: '2.4 km', time: 'Expires in 4h', source: 'City Central Kitchen', type: 'Cooked' },
            { id: 2, food: 'Fresh Apples', qty: '15 kg', distance: '4.1 km', time: 'Expires in 2 days', source: 'Green Grocers', type: 'Raw' },
            { id: 3, food: 'Steamed Rice', qty: '35 kg', distance: '1.2 km', time: 'Expires in 3h', source: 'Downtown Catering', type: 'Cooked' },
            { id: 4, food: 'Whole Wheat Bread', qty: '40 loaves', distance: '5.5 km', time: 'Expires in 1 day', source: 'Sunrise Bakery', type: 'Baked' },
            { id: 5, food: 'Lentil Soup', qty: '10 L', distance: '3.0 km', time: 'Expires in 5h', source: 'City Central Kitchen', type: 'Cooked' },
          ].map((item) => (
            <div key={item.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                 <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-600">
                   {item.type}
                 </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1 pr-16">{item.food}</h3>
              <p className="text-orange-600 font-black text-lg mb-4">{item.qty}</p>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm font-semibold text-slate-500">
                  <MapPin className="h-4 w-4 mr-2 text-slate-400" />
                  {item.source} <span className="ml-2 px-2 py-0.5 bg-slate-100 rounded-md text-slate-600 text-xs">{item.distance}</span>
                </div>
                <div className="flex items-center text-sm font-semibold text-red-500">
                  <Clock className="h-4 w-4 mr-2" />
                  {item.time}
                </div>
              </div>

              <button 
                onClick={() => handleClaim(item.food)}
                className="w-full py-3 bg-slate-900 hover:bg-orange-500 text-white rounded-xl font-bold transition-colors shadow-md group-hover:shadow-orange-500/30"
              >
                Claim Delivery
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
