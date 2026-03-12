/**
 * Detects the provider of an API key based on known patterns.
 */
export function detectProvider(key: string): 'openai' | 'anthropic' | 'gemini' | 'grok' | 'groq' | 'mistral' | 'deepseek' | 'openrouter' | 'cerebras' | 'unknown' {
  const trimmedKey = key.trim();

  // Anthropic: ALWAYS starts with sk-ant-
  if (trimmedKey.startsWith('sk-ant-')) {
    return 'anthropic';
  }

  // OpenRouter: Starts with sk-or-
  if (trimmedKey.startsWith('sk-or-')) {
    return 'openrouter';
  }

  // OpenAI: Starts with sk- and usually 40+ chars.
  // Note: 'sk-proj-' is common now, but legacy keys are just sk-...
  // We check this AFTER Anthropic and OpenRouter because they also start with sk-
  if (trimmedKey.startsWith('sk-')) {
    return 'openai';
  }

  // Gemini: Starts with AIza
  if (trimmedKey.startsWith('AIza')) {
    return 'gemini';
  }

  // Groq: Starts with gsk_
  if (trimmedKey.startsWith('gsk_')) {
    return 'groq';
  }

  // Grok: Starts with xai-
  if (trimmedKey.startsWith('xai-')) {
    return 'grok';
  }

  // Cerebras: While it has no standard prefix, some tools use cerebras/ prefix or it might just be a long alphanumeric.
  // We'll add a simple check if it explicitly starts with something cerebras related, or default to unknown
  // for now, we won't auto-detect cerebras since there isn't a solid public prefix, but users can manually select it.
  
  return 'unknown';
}

/**
 * Mask an API key for display.
 */
export function maskKey(key: string): string {
  const trimmed = key.trim();
  if (trimmed.length < 8) return '****';
  return `${trimmed.slice(0, 4)}...${trimmed.slice(-4)}`;
}

/**
 * Utility for combining Tailwind classes.
 */
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Downloads a text file in the browser.
 */
export function downloadTxtFile(content: string, filename: string) {
  const element = document.createElement('a');
  const file = new Blob([content], { type: 'text/plain' });
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
