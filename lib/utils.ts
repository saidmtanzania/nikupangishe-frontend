import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTZS(amount: number): string {
  return `TZS ${amount.toLocaleString("en-US")}`
}

export function formatTZSShort(amount: number): string {
  if (amount >= 1000000) {
    return `TZS ${(amount / 1000000).toFixed(1)}M`
  }
  if (amount >= 1000) {
    return `TZS ${(amount / 1000).toFixed(0)}K`
  }
  return `TZS ${amount}`
}
