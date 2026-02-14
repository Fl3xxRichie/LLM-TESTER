import KeyTesterSection from '@/components/sections/KeyTesterSection';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#121212] text-white selection:bg-secondary selection:text-black">
      {/* Header */}
      <nav className="border-b border-white/5 py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center font-bold text-black">LT</div>
          <span className="text-xl font-bold tracking-tight">LLM Tester</span>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full text-[10px] text-emerald-500 font-bold uppercase tracking-widest border border-emerald-500/20">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          System Active
        </div>
      </nav>

      {/* Main Content */}
      <KeyTesterSection />

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6 mt-12 bg-black/20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-muted-foreground text-sm">
            © 2026 LLM Tester. Secure, local-only API testing.
          </div>
          <div className="flex gap-8 text-sm text-muted-foreground">
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
