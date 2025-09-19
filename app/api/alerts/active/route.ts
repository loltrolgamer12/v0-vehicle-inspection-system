import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    // Get critical inspection issues
    const criticalIssues = await sql`
      SELECT DISTINCT
        i.id,
        'critical' as type,
        'Falla Crítica Detectada' as title,
        CONCAT('Elemento crítico rechazado: ', ie.element_name) as description,
        i.vehicle_id,
        i.driver_name,
        i.created_at as timestamp,
        'high' as priority
      FROM inspections i
      JOIN inspection_elements ie ON i.id = ie.inspection_id
      WHERE ie.status = 'rejected' 
        AND ie.element_name IN (
          'Frenos delanteros', 'Frenos traseros', 'Sistema de dirección',
          'Neumáticos delanteros', 'Neumáticos traseros', 'Luces principales'
        )
        AND i.created_at >= CURRENT_DATE - INTERVAL '24 hours'
      ORDER BY i.created_at DESC
      LIMIT 5
    `

    // Get fatigue control alerts
    const fatigueAlerts = await sql`
      SELECT 
        fc.id,
        'fatigue' as type,
        'Alerta de Control de Fatiga' as title,
        CASE 
          WHEN fc.hours_driven > 10 THEN 'Conductor excede límite de horas de conducción'
          WHEN fc.rest_hours < 8 THEN 'Conductor no cumple horas mínimas de descanso'
          ELSE 'Revisión de control de fatiga requerida'
        END as description,
        fc.vehicle_id,
        fc.driver_name,
        fc.created_at as timestamp,
        'high' as priority
      FROM fatigue_control fc
      WHERE (fc.hours_driven > 10 OR fc.rest_hours < 8)
        AND fc.created_at >= CURRENT_DATE - INTERVAL '24 hours'
      ORDER BY fc.created_at DESC
      LIMIT 3
    `

    const allAlerts = [
      ...criticalIssues.map((alert) => ({
        id: `critical-${alert.id}`,
        type: alert.type,
        title: alert.title,
        description: alert.description,
        vehicleId: alert.vehicle_id,
        driverName: alert.driver_name,
        timestamp: alert.timestamp,
        priority: alert.priority,
      })),
      ...fatigueAlerts.map((alert) => ({
        id: `fatigue-${alert.id}`,
        type: alert.type,
        title: alert.title,
        description: alert.description,
        vehicleId: alert.vehicle_id,
        driverName: alert.driver_name,
        timestamp: alert.timestamp,
        priority: alert.priority,
      })),
    ]

    // Sort by timestamp descending
    allAlerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    return NextResponse.json(allAlerts.slice(0, 10))
  } catch (error) {
    console.error("Error fetching active alerts:", error)
    return NextResponse.json({ error: "Error fetching active alerts" }, { status: 500 })
  }
}
