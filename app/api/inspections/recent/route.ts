import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const recentInspections = await sql`
      SELECT 
        i.id,
        i.vehicle_id,
        i.driver_name,
        i.created_at,
        i.status,
        COUNT(CASE WHEN ie.status = 'rejected' THEN 1 END) as critical_issues,
        COUNT(ie.id) as total_elements
      FROM inspections i
      LEFT JOIN inspection_elements ie ON i.id = ie.inspection_id
      WHERE i.created_at >= CURRENT_DATE - INTERVAL '1 day'
      GROUP BY i.id, i.vehicle_id, i.driver_name, i.created_at, i.status
      ORDER BY i.created_at DESC
      LIMIT 10
    `

    const formattedInspections = recentInspections.map((inspection) => ({
      id: inspection.id,
      vehicleId: inspection.vehicle_id,
      driverName: inspection.driver_name,
      date: inspection.created_at,
      status: inspection.status,
      criticalIssues: Number(inspection.critical_issues),
      totalElements: Number(inspection.total_elements),
    }))

    return NextResponse.json(formattedInspections)
  } catch (error) {
    console.error("Error fetching recent inspections:", error)
    return NextResponse.json({ error: "Error fetching recent inspections" }, { status: 500 })
  }
}
