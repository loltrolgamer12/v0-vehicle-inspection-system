// Configuración de base de datos PostgreSQL para el sistema de inspección vehicular
import { neon } from "@neondatabase/serverless"

// Configuración de conexión a Neon PostgreSQL
const sql = neon(process.env.DATABASE_URL!)

// Función para ejecutar consultas
export async function query(text: string, params?: any[]) {
  const start = Date.now()

  try {
    const res = await sql`${text}`
    const duration = Date.now() - start
    console.log("[DB Query]", { text, duration, rows: res.length })

    return {
      rows: res,
      rowCount: res.length,
    }
  } catch (error) {
    console.error("[DB Error]", { text, error })
    throw error
  }
}

export async function transaction(callback: (client: any) => Promise<any>) {
  try {
    await sql("BEGIN")
    const result = await callback({ query: sql })
    await sql("COMMIT")
    return result
  } catch (error) {
    await sql("ROLLBACK")
    console.error("[DB Transaction Error]", error)
    throw error
  }
}

// Función para calcular hash único (anti-duplicados)
export function calcularHashInspeccion(
  marcaTemporal: Date,
  conductor: string,
  placa: string,
  kilometraje: number,
): string {
  // Simple hash function that works in all environments
  const data = `${marcaTemporal.toISOString()}${conductor.toUpperCase().trim()}${placa.toUpperCase().trim()}${kilometraje || 0}`

  let hash = 0
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }

  return Math.abs(hash).toString(16).padStart(8, "0")
}

// Tipos TypeScript para el sistema
export interface Inspeccion {
  id?: number
  marca_temporal: Date
  conductor_nombre: string
  contrato?: string
  campo_coordinacion?: string
  placa_vehiculo: string
  kilometraje?: number
  turno?: string
  observaciones?: string
  mes_datos: number
  año_datos: number
  hash_unico: string
  fecha_subida?: Date
}

export interface ElementoInspeccion {
  id?: number
  inspeccion_id: number
  elemento: string
  cumple: boolean
  es_critico: boolean
}

export interface ControlFatiga {
  id?: number
  inspeccion_id: number
  dormido_7_horas: boolean
  libre_fatiga: boolean
  condiciones_conducir: boolean
  medicamentos_alerta: boolean
  score_fatiga: number
  estado_fatiga: "verde" | "amarillo" | "rojo"
}

export interface ConductorEstado {
  id?: number
  conductor_nombre: string
  ultima_inspeccion: Date
  dias_sin_inspeccion: number
  estado: "verde" | "amarillo" | "rojo"
  total_inspecciones: number
  placa_asignada?: string
  campo_coordinacion?: string
  contrato?: string
}

export interface VehiculoEstado {
  id?: number
  placa_vehiculo: string
  ultima_inspeccion: Date
  ultimo_conductor: string
  estado: "verde" | "amarillo" | "naranja" | "rojo"
  fallas_criticas: number
  fallas_menores: number
  total_inspecciones: number
  observaciones_recientes?: string
  campo_coordinacion?: string
}

// Elementos de inspección del formato HQ-FO-40
export const ELEMENTOS_INSPECCION = [
  { nombre: "ALTAS Y BAJAS", critico: false },
  { nombre: "DIRECCIONALES DERECHA E IZQUIERDA", critico: true },
  { nombre: "LUCES DE PARQUEO", critico: true },
  { nombre: "LUCES DE FRENO", critico: true },
  { nombre: "LUCES DE REVERSA", critico: true },
  { nombre: "ESPEJOS", critico: true },
  { nombre: "VIDRIO FRONTAL", critico: true },
  { nombre: "ORDEN Y ASEO", critico: false },
  { nombre: "PITO", critico: true },
  { nombre: "GPS Y MONITOREO", critico: false },
  { nombre: "FRENOS", critico: true },
  { nombre: "FRENOS DE EMERGENCIA", critico: true },
  { nombre: "CINTURONES DE SEGURIDAD", critico: true },
  { nombre: "PUERTAS", critico: true },
  { nombre: "VIDRIOS", critico: false },
  { nombre: "LIMPIA BRISAS", critico: true },
  { nombre: "EXTINTOR", critico: true },
  { nombre: "BOTIQUIN", critico: true },
  { nombre: "TAPICERIA", critico: false },
  { nombre: "INDICADORES DEL TABLERO", critico: true },
  { nombre: "OBJETOS SUELTOS", critico: false },
  { nombre: "ACEITE DEL MOTOR", critico: true },
  { nombre: "FLUIDO DE FRENOS", critico: true },
  { nombre: "FLUIDO DE DIRECCION", critico: true },
  { nombre: "FLUIDO REFRIGERANTE", critico: true },
  { nombre: "FLUIDO LIMPIA PARABRISAS", critico: false },
  { nombre: "CORREAS", critico: true },
  { nombre: "BATERIAS", critico: true },
  { nombre: "LLANTAS LABRADO", critico: true },
  { nombre: "LLANTAS CORTADURAS", critico: true },
  { nombre: "LLANTA DE REPUESTO", critico: true },
  { nombre: "PERNOS DE LLANTAS", critico: true },
  { nombre: "SUSPENSION", critico: true },
  { nombre: "DIRECCION Y TERMINALES", critico: true },
  { nombre: "TAPA DE COMBUSTIBLE", critico: false },
  { nombre: "EQUIPO DE CARRETERA", critico: true },
  { nombre: "KIT AMBIENTAL", critico: false },
  { nombre: "DOCUMENTACION DEL VEHICULO", critico: true },
]

export default sql
