import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Respuesta inmediata sin ninguna conexión a base de datos
    const emptyOverview = {
      totalAlerts: 0,
      activeAlerts: 0,
      resolvedAlerts: 0,
      driversAtRisk: 0
    }
    
    return NextResponse.json(emptyOverview)
  } catch (error) {
    console.error("Error in fatigue overview route:", error)
    return NextResponse.json({ error: "Error fetching fatigue overview" }, { status: 500 })
  }
}