'use client';

import { PackageOpen, Plus, Search, Filter, Loader2, Edit2, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export default function SmartInventory() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleAction = (action: string) => {
    toast.success(`Action "${action}" triggered successfully.`);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center">
            <PackageOpen className="h-8 w-8 mr-3 text-emerald-500" />
            Smart Inventory
          </h1>
          <p className="text-slate-500 mt-2">Manage your raw materials and check AI-predicted spoilage alerts.</p>
        </div>
        <button 
          onClick={() => handleAction('Add Item')}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center transition-all shadow-lg shadow-emerald-500/20"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Item
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Total Items', value: '1,248', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Low Stock Alerts', value: '12', color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Expiring Soon', value: '4', color: 'text-red-600', bg: 'bg-red-50' }
        ].map((stat, i) => (
          <div key={i} className={`${stat.bg} rounded-2xl p-6 border border-white/50 shadow-sm relative overflow-hidden`}>
            <div className="relative z-10">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">{stat.label}</p>
              <p className={`text-4xl font-black ${stat.color}`}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Table Area */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search inventory..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 transition-all bg-white"
            />
          </div>
          <button className="flex items-center px-4 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
        </div>

        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="h-8 w-8 animate-spin mb-4 text-emerald-500" />
            <p className="font-medium animate-pulse">Loading smart inventory data...</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-bold">Item Name</th>
                <th className="px-6 py-4 font-bold">Category</th>
                <th className="px-6 py-4 font-bold">Quantity</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { name: 'Fresh Tomatoes', cat: 'Vegetables', qty: '45 kg', status: 'Optimal', color: 'emerald' },
                { name: 'Wheat Flour', cat: 'Grains', qty: '120 kg', status: 'Optimal', color: 'emerald' },
                { name: 'Milk', cat: 'Dairy', qty: '15 L', status: 'Low Stock', color: 'amber' },
                { name: 'Cabbage', cat: 'Vegetables', qty: '8 kg', status: 'Expiring Soon', color: 'red' },
              ].map((item, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 font-semibold text-slate-900">{item.name}</td>
                  <td className="px-6 py-4 text-slate-500">{item.cat}</td>
                  <td className="px-6 py-4 font-medium text-slate-700">{item.qty}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-${item.color}-100 text-${item.color}-700`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleAction('Edit')} className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleAction('Delete')} className="p-2 text-slate-400 hover:text-red-600 transition-colors ml-2">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
