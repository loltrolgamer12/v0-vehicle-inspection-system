import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const alerts = await sql`
      SELECT 
        fc.id,
        fc.driver_id,
        d.name as driver_name,
        fc.hours_driven,
        fc.hours_week,
        fc.rest_hours,
        fc.fatigue_status,
        fc.created_at,
        i.vehicle_id
      FROM fatigue_control fc
      JOIN drivers d ON fc.driver_id = d.id
      LEFT JOIN inspections i ON d.name = i.driver_name
      WHERE fc.fatigue_status IN ('warning', 'critical')
        AND fc.created_at >= CURRENT_DATE - INTERVAL '24 hours'
      ORDER BY 
        CASE fc.fatigue_status 
          WHEN 'critical' THEN 1 
          WHEN 'warning' THEN 2 
          ELSE 3 
        END,
        fc.created_at DESC
      LIMIT 10
    `

    const formattedAlerts = alerts.map((alert) => {
      let type = "hours_exceeded"
      let message = "Alerta de control de fatiga"

      if (alert.hours_driven > 11) {
        type = "hours_exceeded"
        message = `Conductor excede ${alert.hours_driven} horas de conducción diaria`
      } else if (alert.rest_hours < 9) {
        type = "rest_insufficient"
        message = "Descanso insuficiente entre jornadas"
      } else if (alert.hours_driven > 4) {
        type = "continuous_driving"
        message = `Conducción continua sin descanso por ${alert.hours_driven} horas`
      }

      return {
        id: alert.id,
        driverId: alert.driver_id,
        driverName: alert.driver_name,
        type,
        severity: alert.fatigue_status,
        message,
        hoursToday: Number(alert.hours_driven),
        hoursWeek: Number(alert.hours_week),
        restHours: Number(alert.rest_hours),
        vehicleId: alert.vehicle_id,
        timestamp: alert.created_at,
      }
    })

    return NextResponse.json(formattedAlerts)
  } catch (error) {
    console.error("Error fetching fatigue alerts:", error)
    return NextResponse.json({ error: "Error fetching fatigue alerts" }, { status: 500 })
  }
}
