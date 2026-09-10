'use client';

import { Database, ShieldAlert, FileText, Download } from 'lucide-react';

export default function AuditTrail() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center">
            <Database className="h-8 w-8 mr-3 text-rose-500" />
            Immutable Audit Trail
          </h1>
          <p className="text-slate-500 mt-2">Cryptographically secure logs of all critical system actions.</p>
        </div>
        <button className="bg-rose-50 text-rose-600 hover:bg-rose-100 px-5 py-2.5 rounded-xl font-bold flex items-center transition-colors border border-rose-200">
          <Download className="h-5 w-5 mr-2" />
          Export Logs
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center bg-rose-50/30">
          <ShieldAlert className="h-5 w-5 text-rose-500 mr-2" />
          <span className="text-sm font-bold text-rose-700">System Integrity: VERIFIED (Last check: 2 minutes ago)</span>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-bold">Timestamp</th>
              <th className="px-6 py-4 font-bold">Action</th>
              <th className="px-6 py-4 font-bold">Actor</th>
              <th className="px-6 py-4 font-bold">IP Address</th>
              <th className="px-6 py-4 font-bold font-mono">Hash signature</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono text-sm">
            {[
              { time: '2026-10-24 14:32:01', action: 'CREATE_DELIVERY', actor: 'SysAdmin', ip: '192.168.1.45', hash: 'a1b2c3d4e5f6...7890' },
              { time: '2026-10-24 14:15:22', action: 'UPDATE_INVENTORY', actor: 'KitchenManager_01', ip: '10.0.0.12', hash: 'f6e5d4c3b2a1...0987' },
              { time: '2026-10-24 13:45:10', action: 'USER_LOGIN', actor: 'Driver_Rajesh', ip: '172.16.2.100', hash: 'c3b2a1f6e5d4...5678' },
              { time: '2026-10-24 12:05:55', action: 'OCR_ANALYSIS_RUN', actor: 'KitchenManager_02', ip: '10.0.0.15', hash: 'b2a1f6e5d4c3...1234' },
              { time: '2026-10-24 11:30:00', action: 'SYSTEM_BACKUP', actor: 'Automated_Job', ip: '127.0.0.1', hash: 'e5d4c3b2a1f6...4321' },
            ].map((log, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 text-slate-500">{log.time}</td>
                <td className="px-6 py-4 font-bold text-slate-700">{log.action}</td>
                <td className="px-6 py-4 text-indigo-600">{log.actor}</td>
                <td className="px-6 py-4 text-slate-400">{log.ip}</td>
                <td className="px-6 py-4 text-slate-400 text-xs truncate max-w-[150px]">{log.hash}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
