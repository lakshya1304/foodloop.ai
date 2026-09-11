'use client';

import { Bell, Thermometer, ShieldAlert } from 'lucide-react';

export default function IoTAlerts() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">IoT Sensor Alerts</h1>
        <p className="text-slate-500 mt-2 text-lg">Real-time alerts from smart storage and transportation monitors.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-red-50 p-6 rounded-3xl border border-red-100 shadow-xl shadow-red-200/20 relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-red-100 text-red-600 rounded-2xl">
              <Thermometer className="h-6 w-6" />
            </div>
            <span className="text-xs font-bold text-red-600 bg-white px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
              Critical
            </span>
          </div>
          <h3 className="text-red-900 font-bold text-xl mb-2">Freezer 02 Temp Anomaly</h3>
          <p className="text-red-700 mb-4">Temperature detected at 4°C for over 15 minutes. Threshold is -18°C. Immediate action required to prevent spoilage.</p>
          <button className="bg-red-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-red-700 transition-colors">Acknowledge</button>
        </div>

        <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 shadow-xl shadow-amber-200/20 relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <span className="text-xs font-bold text-amber-600 bg-white px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
              Warning
            </span>
          </div>
          <h3 className="text-amber-900 font-bold text-xl mb-2">Storage Door Open</h3>
          <p className="text-amber-700 mb-4">Pantry door sensor indicates door has been left open. Please close to maintain compliance.</p>
          <button className="bg-amber-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-amber-700 transition-colors">Acknowledge</button>
        </div>
      </div>
    </div>
  );
}
