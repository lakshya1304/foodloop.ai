'use client';

import { Truck, MapPin, Clock, CheckCircle2, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export default function IncomingDeliveries() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleAction = (id: string) => {
    toast.success(`Delivery #${id} status updated successfully.`);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center">
          <Truck className="h-8 w-8 mr-3 text-blue-500" />
          Incoming Deliveries
        </h1>
        <p className="text-slate-500 mt-2">Track deliveries assigned to your NGO in real-time.</p>
      </div>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center text-slate-400">
          <Loader2 className="h-10 w-10 animate-spin mb-4 text-blue-500" />
          <p className="font-medium animate-pulse">Syncing with drivers network...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {[
            { id: 'DEL-8924', driver: 'Rajesh K.', eta: '12 mins away', status: 'IN_TRANSIT', items: '20kg Mixed Veg, 10L Soup' },
            { id: 'DEL-8927', driver: 'Amit S.', eta: '45 mins away', status: 'ASSIGNED', items: '15kg Apples, 40 loaves Bread' }
          ].map((del) => (
            <div key={del.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between">
              <div className="flex-1 mb-4 md:mb-0">
                <div className="flex items-center mb-2">
                  <span className="font-black text-xl text-slate-900 mr-4">{del.id}</span>
                  <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                    del.status === 'IN_TRANSIT' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {del.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-slate-600 font-medium mb-1 flex items-center">
                  <Truck className="h-4 w-4 mr-2 text-slate-400" />
                  Driver: {del.driver}
                </div>
                <div className="text-slate-600 font-medium flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-slate-400" />
                  Contents: {del.items}
                </div>
              </div>
              
              <div className="flex flex-col items-end border-l border-slate-100 pl-6">
                <div className="text-right mb-4">
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">ETA</p>
                  <p className="text-2xl font-black text-blue-600 flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    {del.eta}
                  </p>
                </div>
                <button 
                  onClick={() => handleAction(del.id)}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold transition-colors flex items-center shadow-md shadow-emerald-500/20"
                >
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  Mark Arrived
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
