import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    // Get daily inspection data for the last 7 days
    const dailyData = await sql`
      SELECT 
        DATE(created_at) as date,
        COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved,
        COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending
      FROM inspections 
      WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `

    // Get status distribution
    const statusData = await sql`
      SELECT 
        status,
        COUNT(*) as count
      FROM inspections 
      WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY status
    `

    const statusMapping = {
      approved: { name: "Aprobadas", color: "#22c55e" },
      rejected: { name: "Rechazadas", color: "#ef4444" },
      pending: { name: "Pendientes", color: "#f59e0b" },
    }

    const formattedStatus = statusData.map((item) => ({
      name: statusMapping[item.status as keyof typeof statusMapping]?.name || item.status,
      value: Number(item.count),
      color: statusMapping[item.status as keyof typeof statusMapping]?.color || "#6b7280",
    }))

    return NextResponse.json({
      daily: dailyData,
      status: formattedStatus,
    })
  } catch (error) {
    console.error("Error fetching chart data:", error)
    return NextResponse.json({ error: "Error fetching chart data" }, { status: 500 })
  }
}
