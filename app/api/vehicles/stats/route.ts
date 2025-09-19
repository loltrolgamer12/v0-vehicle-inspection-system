import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const stats = await sql`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active,
        COUNT(CASE WHEN status = 'maintenance' THEN 1 END) as maintenance,
        COUNT(CASE WHEN status = 'critical' THEN 1 END) as critical,
        MAX(last_maintenance) as last_inspection
      FROM vehicles
    `

    const result = stats[0]

    return NextResponse.json({
      total: Number(result.total),
      active: Number(result.active),
      maintenance: Number(result.maintenance),
      critical: Number(result.critical),
      lastInspection: result.last_inspection || new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching vehicle stats:", error)
    return NextResponse.json({ error: "Error fetching vehicle stats" }, { status: 500 })
  }
}
