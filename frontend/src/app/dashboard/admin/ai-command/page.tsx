'use client';

import { Cpu, Brain, Zap, Target } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AICommandCenter() {
  const [scans, setScans] = useState(1240);
  const [accuracy, setAccuracy] = useState(98.4);

  useEffect(() => {
    const interval = setInterval(() => {
      setScans(prev => prev + Math.floor(Math.random() * 3));
      setAccuracy(prev => Math.max(95, Math.min(99.9, prev + (Math.random() * 0.2 - 0.1))));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in slide-in-from-bottom-8 duration-700">
      <div>
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 tracking-tight">AI Command Center</h1>
        <p className="text-slate-500 mt-2 text-lg">Live monitoring of the Gemini Vision OCR and ML recommendation models.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-2xl shadow-indigo-500/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Brain className="w-48 h-48 text-indigo-500" />
          </div>
          <div className="relative z-10 space-y-6">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl">
                <Target className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-slate-500 font-semibold">Vision OCR Accuracy</h3>
                <p className="text-5xl font-black text-slate-900">{accuracy.toFixed(1)}%</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl">
                <Zap className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-slate-500 font-semibold">Total Processed Scans</h3>
                <p className="text-5xl font-black text-slate-900">{scans.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-[2rem] text-slate-300 relative overflow-hidden shadow-2xl">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/20 blur-3xl rounded-full"></div>
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <Cpu className="mr-3 text-indigo-400" /> 
            Live Processing Feed
          </h3>
          <div className="space-y-4">
            {[
              { id: 'SCN-8821', item: 'Carrots 5kg', conf: 0.99, time: 'Just now' },
              { id: 'SCN-8820', item: 'White Bread 10 loaves', conf: 0.96, time: '2 min ago' },
              { id: 'SCN-8819', item: 'Apples (Mixed) 3kg', conf: 0.92, time: '5 min ago' },
              { id: 'SCN-8818', item: 'Milk 1Gal', conf: 0.98, time: '12 min ago' },
            ].map(log => (
              <div key={log.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 transition-colors">
                <div>
                  <span className="text-indigo-400 font-mono text-sm">{log.id}</span>
                  <p className="text-white font-medium">{log.item}</p>
                </div>
                <div className="text-right">
                  <span className={`text-sm px-2 py-1 rounded-full ${log.conf > 0.95 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {(log.conf * 100).toFixed(0)}% Conf
                  </span>
                  <p className="text-slate-500 text-xs mt-1">{log.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
