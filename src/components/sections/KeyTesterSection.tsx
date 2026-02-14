'use client';

import React, { useState } from 'react';
import { Layout, CheckCircle, XCircle, Loader2, UploadCloud, Clipboard } from 'lucide-react';
import { cn, detectProvider, maskKey } from '@/lib/utils';

interface KeyResult {
  key: string;
  provider: string;
  status: 'IDLE' | 'TESTING' | 'ACTIVE' | 'DEAD';
  details?: string;
}

export default function KeyTesterSection() {
  const [inputKeys, setInputKeys] = useState('');
  const [results, setResults] = useState<KeyResult[]>([]);
  const [isTesting, setIsTesting] = useState(false);

  const startTest = async () => {
    const keys = inputKeys.split('\n').filter(k => k.trim());
    const initialResults: KeyResult[] = keys.map(k => ({
      key: k,
      provider: detectProvider(k),
      status: 'IDLE'
    }));

    setResults(initialResults);
    setIsTesting(true);

    for (let i = 0; i < initialResults.length; i++) {
      setResults(prev => prev.map((r, idx) => idx === i ? { ...r, status: 'TESTING' } : r));

      try {
        const resp = await fetch('/api/test-key', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: initialResults[i].key, provider: initialResults[i].provider }),
        });
        const data = await resp.json();
        setResults(prev => prev.map((r, idx) => idx === i ? { ...r, status: data.status, details: data.details } : r));
      } catch (e) {
        setResults(prev => prev.map((r, idx) => idx === i ? { ...r, status: 'DEAD', details: 'Network error' } : r));
      }
    }

    setIsTesting(false);
  };

  return (
    <section className="py-16 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Validate Your LLM API Keys</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Instant validation for OpenAI, Anthropic, Gemini, and more.
          Your keys are processed in-memory and never stored.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2 space-y-6">
          <div className="relative group">
            <textarea
              className="w-full h-64 bg-black/40 border border-white/10 rounded-xl p-6 font-mono text-sm focus:border-secondary focus:ring-1 focus:ring-secondary transition-all outline-none resize-none"
              placeholder="Paste your keys here (one per line)..."
              value={inputKeys}
              onChange={(e) => setInputKeys(e.target.value)}
            />
            <div className="absolute top-4 right-4 text-white/20 pointer-events-none group-hover:text-white/40 transition-colors">
              <Clipboard size={20} />
            </div>
          </div>

          <button
            onClick={startTest}
            disabled={isTesting || !inputKeys.trim()}
            className="w-full py-4 bg-secondary text-black font-semibold rounded-lg hover:bg-yellow-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isTesting ? <Loader2 className="animate-spin" /> : null}
            {isTesting ? 'Testing Keys...' : 'Detect & Test'}
          </button>
        </div>

        <div className="bg-black/40 border border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-4">
          <div className="p-4 bg-white/5 rounded-full">
            <UploadCloud size={32} className="text-secondary" />
          </div>
          <div>
            <h3 className="font-semibold mb-1">Upload File</h3>
            <p className="text-xs text-muted-foreground">Drag & drop your .txt or .csv key files here</p>
          </div>
          <input type="file" className="hidden" id="file-upload" />
          <label htmlFor="file-upload" className="px-4 py-2 border border-white/20 rounded-md text-sm cursor-pointer hover:bg-white/5 transition-colors">
            Browse Files
          </label>
        </div>
      </div>

      {results.length > 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <SummaryCard label="Total" value={results.length} />
            <SummaryCard label="Active" value={results.filter(r => r.status === 'ACTIVE').length} color="text-emerald-500" />
            <SummaryCard label="Dead" value={results.filter(r => r.status === 'DEAD').length} color="text-red-600" />
            <SummaryCard label="Testing" value={results.filter(r => r.status === 'TESTING').length} color="text-secondary" />
          </div>

          <div className="bg-black/40 border border-white/10 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white/5 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 font-semibold">Provider</th>
                  <th className="px-6 py-4 font-semibold">Masked Key</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {results.map((res, i) => (
                  <tr key={i} className="group hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 capitalize">{res.provider}</td>
                    <td className="px-6 py-4 font-mono text-xs opacity-60">{maskKey(res.key)}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={res.status} />
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground max-w-xs truncate">
                      {res.details || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}

function SummaryCard({ label, value, color = "text-white" }: { label: string, value: number, color?: string }) {
  return (
    <div className="bg-black/40 border border-white/10 p-6 rounded-xl">
      <p className="text-xs text-muted-foreground mb-1 uppercase tracking-tight">{label}</p>
      <p className={cn("text-3xl font-bold", color)}>{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: KeyResult['status'] }) {
  const styles = {
    IDLE: "bg-white/5 text-muted-foreground",
    TESTING: "bg-secondary/10 text-secondary border border-secondary/20 animate-pulse",
    ACTIVE: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
    DEAD: "bg-red-500/10 text-red-500 border border-red-500/20",
  };

  return (
    <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase", styles[status])}>
      {status === 'TESTING' && <Loader2 size={10} className="inline mr-1 animate-spin" />}
      {status}
    </span>
  );
}
