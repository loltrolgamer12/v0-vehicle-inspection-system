import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const overview = await sql`
      SELECT 
        COUNT(DISTINCT d.id) as total_drivers,
        COUNT(DISTINCT CASE WHEN fc.hours_driven > 0 THEN d.id END) as drivers_on_duty,
        COUNT(CASE WHEN fc.fatigue_status = 'normal' THEN 1 END) as normal_status,
        COUNT(CASE WHEN fc.fatigue_status = 'warning' THEN 1 END) as warning_status,
        COUNT(CASE WHEN fc.fatigue_status = 'critical' THEN 1 END) as critical_status,
        AVG(fc.hours_driven) as avg_hours_today,
        (COUNT(CASE WHEN fc.fatigue_status = 'normal' THEN 1 END) * 100.0 / COUNT(*)) as compliance_rate
      FROM drivers d
      LEFT JOIN fatigue_control fc ON d.id = fc.driver_id 
        AND fc.created_at >= CURRENT_DATE
    `

    // Calculate weekly trend (mock calculation)
    const weeklyTrend = 2.1

    const result = overview[0]

    return NextResponse.json({
      totalDrivers: Number(result.total_drivers),
      driversOnDuty: Number(result.drivers_on_duty),
      normalStatus: Number(result.normal_status),
      warningStatus: Number(result.warning_status),
      criticalStatus: Number(result.critical_status),
      avgHoursToday: Number(result.avg_hours_today) || 0,
      complianceRate: Number(result.compliance_rate) || 0,
      weeklyTrend,
    })
  } catch (error) {
    console.error("Error fetching fatigue overview:", error)
    return NextResponse.json({ error: "Error fetching fatigue overview" }, { status: 500 })
  }
}
