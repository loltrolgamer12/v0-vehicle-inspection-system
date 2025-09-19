import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    // Get daily compliance data for the last 7 days
    const dailyData = await sql`
      SELECT 
        DATE(fc.created_at) as date,
        COUNT(CASE WHEN fc.fatigue_status = 'normal' THEN 1 END) as compliant,
        COUNT(CASE WHEN fc.fatigue_status IN ('warning', 'critical') THEN 1 END) as violations,
        COUNT(*) as total_drivers
      FROM fatigue_control fc
      WHERE fc.created_at >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY DATE(fc.created_at)
      ORDER BY date DESC
    `

    // Mock weekly data for development
    const weeklyData = [
      { week: "Sem 1", complianceRate: 92.8, avgHours: 7.2 },
      { week: "Sem 2", complianceRate: 89.3, avgHours: 7.8 },
      { week: "Sem 3", complianceRate: 94.6, avgHours: 6.9 },
      { week: "Sem 4", complianceRate: 87.5, avgHours: 8.1 },
    ]

    return NextResponse.json({
      daily: dailyData,
      weekly: weeklyData,
    })
  } catch (error) {
    console.error("Error fetching compliance data:", error)
    return NextResponse.json({ error: "Error fetching compliance data" }, { status: 500 })
  }
}
