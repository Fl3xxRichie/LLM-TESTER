import React from 'react';
import { Sparkles, Terminal, Cpu, Zap, Wind, Search, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProviderLogoProps {
  provider: string;
  className?: string;
}

export const ProviderLogo: React.FC<ProviderLogoProps> = ({ provider, className }) => {
  const p = provider.toLowerCase();

  // ── OpenAI (Green / Black) ────────────────────────────────────────────────
  if (p === 'openai') {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={cn("text-green-500", className)}>
        <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.0462 6.0462 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0843 8.0146-4.6106.0039-.0024H21.28c.1107 1.1578-.4426 2.3486-1.503 3.1953a4.538 4.538 0 0 1-2.5293.7537 4.5126 4.5126 0 0 1-3.9878-1.7828 4.5422 4.5422 0 0 1 .0001.0021l-.0001-.0004zm-8.8148-3.3283a4.475 4.475 0 0 1-.3013-3.0556l.1419.0843 8.019 4.6223a.0667.0667 0 0 1 .004.0024v2.7013a4.498 4.498 0 0 1-2.5029.7493 4.5388 4.5388 0 0 1-3.1939-1.5064 4.5202 4.5202 0 0 1-1.7779-3.9912l-.3889.3938zm.3999-9.1579a4.5 4.5 0 0 1 2.8715 1.0506l-.1418.0842-8.0188 4.6133-.0041.0022h-2.735a4.4927 4.4927 0 0 1 1.5074-3.1973 4.5417 4.5417 0 0 1 3.2051-1.4984 4.5022 4.5022 0 0 1 2.8943 1.0506l.4214-.4052zm9.0305-2.091a4.479 4.479 0 0 1 3.2031 1.4883l-.1418.0843h-.002l-8.0116 4.6166v-2.7003a4.4716 4.4716 0 0 1 2.508-2.9867 4.5113 4.5113 0 0 1 2.4443-3.0023l.0001.0001zm8.7997 12.3392a4.478 4.478 0 0 1-2.88 1.0457l.1419-.0842h.0019l8.015-4.6179v2.7093a4.4996 4.4996 0 0 1-2.5159 2.9915 4.5422 4.5422 0 0 1-2.7629.9557l-.0001-.0001zm1.189-9.0116a4.4727 4.4727 0 0 1 .2889 3.0645l-.1419-.0843-8.0135-4.6202-.0041-.0023v-2.698a4.469 4.469 0 0 1 2.4936-.7577 4.538 4.538 0 0 1 3.193 1.5173 4.523 4.523 0 0 1 1.7853 4.004l.3986-.4233zM12 10.9663l-2.0227 1.1678v2.3356l2.0227 1.1678 2.0227-1.1678v-2.3356L12 10.9663z" />
      </svg>
    );
  }

  // ── Anthropic (Orange / Beige) ────────────────────────────────────────────
  if (p === 'anthropic') {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={cn("text-orange-400", className)}>
        {/* Simple stylized 'A' shape */}
        <path d="M12 2L2 22h4l2-4h8l2 4h4L12 2zm0 4.5L15.5 15h-7L12 6.5z" />
      </svg>
    );
  }

  // ── Gemini (Blue / Purple Gradient simulation via class) ──────────────────
  if (p === 'gemini') {
    return <Sparkles className={cn("text-blue-400", className)} />;
  }

  // ── Grok (White / Black) ──────────────────────────────────────────────────
  if (p === 'grok') {
    return (
      <div className={cn("relative flex items-center justify-center font-bold font-mono", className)}>
        <span className="text-[1.2em]">X</span>
      </div>
    );
  }

  // ── Mistral (Yellow / Orange) ─────────────────────────────────────────────
  if (p === 'mistral') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={cn("text-yellow-500", className)}>
        {/* Stylized 'M' / Wave */}
        <path d="M4 18s2-8 5-8 5 8 8 0 2-8 3-8" />
      </svg>
    );
  }

  // ── Groq (Orange-Red) ─────────────────────────────────────────────────────
  if (p === 'groq') {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={cn("text-[#f55036]", className)}>
        {/* Stylized 'g' or slash */}
        <path d="M4 4h4v12a4 4 0 0 0 8 0V4h4v12a8 8 0 0 1-16 0V4z" />
      </svg>
    );
  }

  // ── DeepSeek (Blue) ───────────────────────────────────────────────────────
  if (p === 'deepseek') {
    return (
      <div className={cn("relative flex items-center justify-center font-bold", className)}>
        <span className="text-blue-500 text-[1.1em]">DS</span>
      </div>
    );
  }

  // ── OpenRouter (Purple/Pink) ──────────────────────────────────────────────
  if (p === 'openrouter') {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={cn("text-purple-400", className)}>
        {/* Simple stylized 'O' / router waves */}
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
      </svg>
    );
  }

  // ── Cerebras (Coral/Orange) ───────────────────────────────────────────────
  if (p === 'cerebras') {
    return (
      <div className={cn("relative flex items-center justify-center font-bold", className)}>
        <span className="text-[#f26522] text-[1.1em]">CB</span>
      </div>
    );
  }

  // ── Unknown ───────────────────────────────────────────────────────────────
  return <HelpCircle className={cn("text-muted-foreground", className)} />;
};
