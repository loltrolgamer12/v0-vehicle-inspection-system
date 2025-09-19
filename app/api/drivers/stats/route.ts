import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Respuesta inmediata sin ninguna conexión a base de datos
    const emptyStats = {
      total: 0,
      active: 0,
      warning: 0,
      critical: 0,
      lastUpdate: new Date().toISOString()
    }
    
    return NextResponse.json(emptyStats)
  } catch (error) {
    console.error("Error in driver stats route:", error)
    return NextResponse.json({ error: "Error fetching driver stats" }, { status: 500 })
  }
}
