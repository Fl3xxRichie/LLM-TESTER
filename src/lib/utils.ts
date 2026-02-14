/**
 * Detects the provider of an API key based on known patterns.
 */
export function detectProvider(key: string): 'openai' | 'anthropic' | 'gemini' | 'unknown' {
  const trimmedKey = key.trim();

  // OpenAI: Starts with sk- and usually 48+ chars
  if (trimmedKey.startsWith('sk-') && !trimmedKey.includes('ant-')) {
    return 'openai';
  }

  // Anthropic: Starts with sk-ant-
  if (trimmedKey.startsWith('sk-ant-')) {
    return 'anthropic';
  }

  // Gemini: Starts with AIza
  if (trimmedKey.startsWith('AIza')) {
    return 'gemini';
  }

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
