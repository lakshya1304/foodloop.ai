'use client';

import { Camera, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';

export default function AIQualityScans() {
  const scans = [
    { id: 'SCN-8821', item: 'Carrots 5kg', conf: 0.99, time: 'Just now', status: 'PASS' },
    { id: 'SCN-8820', item: 'White Bread 10 loaves', conf: 0.96, time: '2 min ago', status: 'PASS' },
    { id: 'SCN-8819', item: 'Apples (Mixed) 3kg', conf: 0.92, time: '5 min ago', status: 'WARNING' },
    { id: 'SCN-8818', item: 'Milk 1Gal', conf: 0.98, time: '12 min ago', status: 'PASS' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">AI Quality Scans</h1>
          <p className="text-slate-500 mt-2 text-lg">Historical log of all vision-based food quality assessments.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-200 flex items-center">
          <Camera className="w-5 h-5 mr-2" />
          New Scan
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="p-6 text-sm font-bold text-slate-500 uppercase tracking-wider">Scan ID</th>
                <th className="p-6 text-sm font-bold text-slate-500 uppercase tracking-wider">Detected Item</th>
                <th className="p-6 text-sm font-bold text-slate-500 uppercase tracking-wider">Confidence</th>
                <th className="p-6 text-sm font-bold text-slate-500 uppercase tracking-wider">Time</th>
                <th className="p-6 text-sm font-bold text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {scans.map((scan) => (
                <tr key={scan.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-6 font-mono text-sm text-indigo-600 font-bold">{scan.id}</td>
                  <td className="p-6 font-semibold text-slate-900">{scan.item}</td>
                  <td className="p-6">
                    <div className="flex items-center">
                      <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden mr-3">
                        <div className={`h-full ${scan.conf > 0.95 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${scan.conf * 100}%` }}></div>
                      </div>
                      <span className="text-sm font-bold text-slate-600">{(scan.conf * 100).toFixed(0)}%</span>
                    </div>
                  </td>
                  <td className="p-6 text-slate-500 text-sm flex items-center">
                    <Clock className="w-4 h-4 mr-2" /> {scan.time}
                  </td>
                  <td className="p-6">
                    {scan.status === 'PASS' ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> PASS
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                        <AlertTriangle className="w-3 h-3 mr-1" /> WARN
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
