
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, formatDistance, formatRelative } from "date-fns"
import { pt } from "date-fns/locale"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatDateTime(date: Date): string {
  return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: pt })
}

export function formatRelativeTime(date: Date): string {
  return formatDistance(date, new Date(), { 
    addSuffix: true,
    locale: pt
  })
}
