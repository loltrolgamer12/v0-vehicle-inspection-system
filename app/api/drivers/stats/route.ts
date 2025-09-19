import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const stats = await sql`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active,
        COUNT(CASE WHEN fc.hours_driven > 0 THEN 1 END) as on_duty,
        COUNT(CASE WHEN fc.fatigue_status IN ('warning', 'critical') THEN 1 END) as fatigue_alerts,
        AVG(fc.hours_driven) as avg_hours_per_day
      FROM drivers d
      LEFT JOIN fatigue_control fc ON d.id = fc.driver_id 
        AND fc.created_at >= CURRENT_DATE
    `

    const result = stats[0]

    return NextResponse.json({
      total: Number(result.total),
      active: Number(result.active),
      onDuty: Number(result.on_duty),
      fatigueAlerts: Number(result.fatigue_alerts),
      avgHoursPerDay: Number(result.avg_hours_per_day) || 0,
    })
  } catch (error) {
    console.error("Error fetching driver stats:", error)
    return NextResponse.json({ error: "Error fetching driver stats" }, { status: 500 })
  }
}
