import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Respuesta inmediata sin ninguna conexión a base de datos
    const emptyMetrics = {
      totalVehicles: 0,
      totalDrivers: 0,
      todayInspections: 0,
      pendingInspections: 0,
      criticalAlerts: 0,
      approvedInspections: 0,
      rejectedInspections: 0,
      fatigueAlerts: 0,
      weeklyTrend: 0,
      complianceRate: 0
    }
    
    return NextResponse.json(emptyMetrics)
  } catch (error) {
    console.error("Error in metrics route:", error)
    return NextResponse.json({ error: "Error fetching metrics" }, { status: 500 })
  }
}