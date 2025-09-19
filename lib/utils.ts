import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utilidad defensiva para asegurar que los arrays no rompan operaciones map
export function safeArray<T>(data: T[] | null | undefined): T[] {
  return Array.isArray(data) ? data : []
}

// Acceso seguro a datos con fallback
export function safeGet<T>(data: any, defaultValue: T): T {
  return data !== null && data !== undefined ? data : defaultValue
}

// Formatear estados con fallbacks apropiados
export function formatStatus(status: string | null | undefined): string {
  const statusMap: { [key: string]: string } = {
    'approved': 'Aprobada',
    'rejected': 'Rechazada', 
    'pending': 'Pendiente',
    'active': 'Activo',
    'maintenance': 'Mantenimiento',
    'critical': 'Crítico'
  }
  
  return status ? statusMap[status] || status : 'Desconocido'
}

// Formatear fechas de manera segura
export function safeFormatDate(date: string | Date | null | undefined): string {
  if (!date) return 'No disponible'
  
  try {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch {
    return 'Fecha inválida'
  }
}

// Validar si un objeto tiene las propiedades necesarias
export function hasRequiredProps<T extends Record<string, any>>(
  obj: any, 
  requiredProps: (keyof T)[]
): obj is T {
  if (!obj || typeof obj !== 'object') return false
  return requiredProps.every(prop => prop in obj)
}
