'use client';

import React, { useState, useCallback } from 'react';
import { CheckCircle, XCircle, Loader2, UploadCloud, Clipboard, Download, Trash2, AlertCircle } from 'lucide-react';
import { cn, detectProvider, maskKey, downloadTxtFile } from '@/lib/utils';

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
  const [isDragging, setIsDragging] = useState(false);

  // ── File Upload Logic ─────────────────────────────────────────────────────
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        // Append to existing keys or replace? Let's append with a newline
        setInputKeys((prev) => (prev ? `${prev}\n${text}` : text));
      }
    };
    reader.readAsText(file);
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }, []);

  // ── Testing Logic ─────────────────────────────────────────────────────────
  const startTest = async () => {
    const lines = inputKeys.split('\n').map(k => k.trim()).filter(Boolean);
    if (lines.length === 0) return;

    // Reset results and start fresh or append?
    // Let's replace results to match the current input exactly.
    const initialResults: KeyResult[] = lines.map(k => ({
      key: k,
      provider: detectProvider(k),
      status: 'IDLE'
    }));

    setResults(initialResults);
    setIsTesting(true);

    // Process in parallel with a concurrency limit? Or simple serial for now?
    // Serial is safer for limiting rate limits on our own backend if we had one.
    // Client-side loop is fine for reasonable batches.
    for (let i = 0; i < initialResults.length; i++) {
      // Mark current as testing
      setResults(prev => {
        const next = [...prev];
        next[i] = { ...next[i], status: 'TESTING' };
        return next;
      });

      try {
        const item = initialResults[i];
        // If provider is unknown, skip network call
        if (item.provider === 'unknown') {
          setResults(prev => {
            const next = [...prev];
            next[i] = { ...next[i], status: 'DEAD', details: 'Unknown provider format' };
            return next;
          });
          continue;
        }

        const resp = await fetch('/api/test-key', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: item.key, provider: item.provider }),
        });

        let data;
        try {
          data = await resp.json();
        } catch (err) {
          data = { status: 'DEAD', details: `Invalid JSON from server: ${resp.statusText}` };
        }

        setResults(prev => {
          const next = [...prev];
          next[i] = { ...next[i], status: data.status, details: data.details };
          return next;
        });

      } catch (e: any) {
        setResults(prev => {
          const next = [...prev];
          next[i] = { ...next[i], status: 'DEAD', details: 'Network error (check console)' };
          return next;
        });
      }
    }

    setIsTesting(false);
  };

  const clearAll = () => {
    setInputKeys('');
    setResults([]);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <section className="py-16 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Validate Your LLM API Keys</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Instant validation for OpenAI, Anthropic, Gemini, and Grok.
          <br /><span className="opacity-70 text-sm">Your keys are processed in-memory and never stored.</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Input Area */}
        <div className="lg:col-span-2 space-y-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="relative group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <textarea
              className="w-full h-64 bg-black/40 border border-white/10 rounded-xl p-6 font-mono text-sm focus:border-secondary focus:ring-1 focus:ring-secondary/50 transition-all outline-none resize-none placeholder:text-white/20"
              placeholder="sk-proj-12345...&#10;sk-ant-api03...&#10;AIzaSy..."
              value={inputKeys}
              onChange={(e) => setInputKeys(e.target.value)}
              spellCheck={false}
            />
            <div className="absolute top-4 right-4 flex gap-2">
              {inputKeys && (
                <button onClick={clearAll} className="text-white/20 hover:text-red-500 transition-colors p-1" title="Clear All">
                  <Trash2 size={16} />
                </button>
              )}
              <div className="text-white/20 pointer-events-none">
                <Clipboard size={18} />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={startTest}
              disabled={isTesting || !inputKeys.trim()}
              className={cn(
                "flex-1 py-4 bg-secondary text-black font-bold rounded-xl hover:bg-[#ffcf4d] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(246,194,54,0.1)] hover:shadow-[0_0_30px_rgba(246,194,54,0.3)]",
                isTesting && "opacity-80"
              )}
            >
              {isTesting ? <Loader2 className="animate-spin" /> : null}
              {isTesting ? 'Validating Keys...' : 'Detect & Test Keys'}
            </button>
          </div>
        </div>

        {/* Upload Area */}
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={cn(
            "animate-slide-up border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-6 transition-all duration-200 bg-black/20",
            isDragging ? "border-secondary bg-secondary/5 scale-[1.02]" : "hover:border-white/20 haver:bg-black/30"
          )}
          style={{ animationDelay: '0.2s' }}
        >
          <div className={cn("p-5 rounded-full transition-colors", isDragging ? "bg-secondary/20" : "bg-white/5")}>
            <UploadCloud size={40} className={cn("transition-colors", isDragging ? "text-secondary" : "text-white/40")} />
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Upload File</h3>
            <p className="text-sm text-muted-foreground">Drag & drop .txt or .csv files<br />containing your API keys</p>
          </div>
          <input
            type="file"
            className="hidden"
            id="file-upload"
            accept=".txt,.csv"
            onChange={handleFileUpload}
          />
          <label
            htmlFor="file-upload"
            className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium cursor-pointer transition-all hover:border-white/30"
          >
            Browse Files
          </label>
        </div>
      </div>

      {/* Results Section */}
      {results.length > 0 && (
        <div className="space-y-8 animate-fade-in">

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <SummaryCard label="Total Keys" value={results.length} />
            <SummaryCard label="Active" value={results.filter(r => r.status === 'ACTIVE').length} color="text-emerald-500" border="border-emerald-500/20" bg="bg-emerald-500/5" />
            <SummaryCard label="Dead / Invalid" value={results.filter(r => r.status === 'DEAD').length} color="text-red-500" border="border-red-500/20" bg="bg-red-500/5" />
            <SummaryCard label="Working..." value={results.filter(r => r.status === 'TESTING').length} color="text-secondary" />
          </div>

          <div className="flex justify-end">
            {results.some(r => r.status === 'ACTIVE') && !isTesting && (
              <button
                onClick={() => {
                  const activeKeys = results
                    .filter(r => r.status === 'ACTIVE')
                    .map(r => `${r.provider.toUpperCase()}: ${r.key}`)
                    .join('\n');
                  downloadTxtFile(activeKeys, 'active_keys.txt');
                }}
                className="px-5 py-2.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-lg font-bold hover:bg-emerald-500/20 transition-all flex items-center gap-2 text-sm"
              >
                <Download size={16} />
                Download Active Keys
              </button>
            )}
          </div>

          {/* Table */}
          <div className="bg-black/40 border border-white/10 rounded-xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead className="bg-white/5 text-xs uppercase tracking-wider text-muted-foreground/70">
                  <tr>
                    <th className="px-6 py-4 font-semibold w-32">Provider</th>
                    <th className="px-6 py-4 font-semibold w-48">Key Mask</th>
                    <th className="px-6 py-4 font-semibold w-32">Status</th>
                    <th className="px-6 py-4 font-semibold">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {results.map((res, i) => (
                    <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <ProviderIcon provider={res.provider} />
                          <span className="capitalize font-medium">{res.provider}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs opacity-60 select-all">{maskKey(res.key)}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={res.status} />
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {res.details ? (
                          <span className={cn(
                            "flex items-center gap-1.5",
                            res.status === 'ACTIVE' && "text-emerald-500/80",
                            res.status === 'DEAD' && "text-red-400/80"
                          )}>
                            {res.status === 'DEAD' && <AlertCircle size={12} />}
                            {res.status === 'ACTIVE' && <CheckCircle size={12} />}
                            {res.details}
                          </span>
                        ) : (
                          <span className="opacity-20">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// ── Subcomponents ──────────────────────────────────────────────────────────

function SummaryCard({ label, value, color = "text-white", border = "border-white/10", bg = "bg-black/40" }: any) {
  return (
    <div className={cn("p-6 rounded-xl border flex flex-col items-center justify-center text-center", border, bg)}>
      <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">{label}</p>
      <p className={cn("text-3xl font-bold", color)}>{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: KeyResult['status'] }) {
  const styles = {
    IDLE: "bg-white/5 text-muted-foreground border-white/5",
    TESTING: "bg-secondary/10 text-secondary border-secondary/20",
    ACTIVE: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    DEAD: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  return (
    <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border flex w-fit items-center gap-1.5", styles[status])}>
      {status === 'TESTING' && <Loader2 size={10} className="animate-spin" />}
      {status}
    </span>
  );
}

function ProviderIcon({ provider }: { provider: string }) {
  // Simple colored dots for now, could be replaced with SVGs
  const colors: Record<string, string> = {
    openai: "bg-green-500",
    anthropic: "bg-orange-500",
    gemini: "bg-blue-500",
    grok: "bg-white",
    unknown: "bg-gray-700"
  };
  return <div className={cn("w-2 h-2 rounded-full", colors[provider] || colors.unknown)} />;
}
