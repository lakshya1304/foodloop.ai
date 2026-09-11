'use client';

import { Activity, Cpu, Database, Server, Wifi } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function SystemHealth() {
  const [cpuUsage, setCpuUsage] = useState(45);
  const [ramUsage, setRamUsage] = useState(62);
  const [latency, setLatency] = useState(24);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(prev => Math.max(10, Math.min(100, prev + (Math.random() * 10 - 5))));
      setRamUsage(prev => Math.max(20, Math.min(100, prev + (Math.random() * 4 - 2))));
      setLatency(prev => Math.max(5, Math.min(200, prev + (Math.random() * 20 - 10))));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in zoom-in duration-500">
      <div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">System Health</h1>
        <p className="text-slate-500 mt-2 text-lg">Live telemetry for all microservices and infrastructure.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
              <Cpu className="h-6 w-6" />
            </div>
            <span className="flex items-center text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
              Live
            </span>
          </div>
          <h3 className="text-slate-500 font-semibold mb-1 relative z-10">CPU Usage</h3>
          <p className="text-4xl font-extrabold text-slate-900 relative z-10">{cpuUsage.toFixed(1)}%</p>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden relative z-10">
            <div className="bg-blue-500 h-full rounded-full transition-all duration-1000 ease-in-out" style={{ width: `${cpuUsage}%` }}></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl">
              <Database className="h-6 w-6" />
            </div>
          </div>
          <h3 className="text-slate-500 font-semibold mb-1 relative z-10">Memory Allocation</h3>
          <p className="text-4xl font-extrabold text-slate-900 relative z-10">{ramUsage.toFixed(1)}%</p>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden relative z-10">
            <div className="bg-purple-500 h-full rounded-full transition-all duration-1000 ease-in-out" style={{ width: `${ramUsage}%` }}></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
              <Activity className="h-6 w-6" />
            </div>
          </div>
          <h3 className="text-slate-500 font-semibold mb-1 relative z-10">API Latency</h3>
          <p className="text-4xl font-extrabold text-slate-900 relative z-10">{latency.toFixed(0)} ms</p>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden relative z-10">
            <div className={`h-full rounded-full transition-all duration-1000 ease-in-out ${latency > 100 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(100, latency / 2)}%` }}></div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 p-6 rounded-3xl text-green-400 font-mono text-sm shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50"></div>
        <div className="flex items-center mb-4 text-white">
          <Server className="h-5 w-5 mr-2 text-slate-400" />
          <span className="font-bold">syslog -f /var/log/foodloop-api.log</span>
        </div>
        <div className="space-y-1 opacity-80 h-48 overflow-hidden flex flex-col justify-end">
          <p>[{new Date().toISOString()}] INFO: Validating JWT for driver-1902...</p>
          <p>[{new Date().toISOString()}] DEBUG: OCR service responded in 432ms.</p>
          <p>[{new Date().toISOString()}] INFO: Cache hit for dashboard stats.</p>
          <p>[{new Date().toISOString()}] WARNING: Rate limit approaching for Kitchen-3 API Key.</p>
          <p>[{new Date().toISOString()}] INFO: New websocket connection established from 10.42.0.5.</p>
          <p className="animate-pulse">[{new Date().toISOString()}] INFO: Waiting for logs...</p>
        </div>
      </div>
    </div>
  );
}
