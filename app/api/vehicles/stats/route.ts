import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Respuesta inmediata sin ninguna conexión a base de datos
    const emptyStats = {
      total: 0,
      active: 0,
      maintenance: 0,
      critical: 0,
      lastInspection: null
    }
    
    return NextResponse.json(emptyStats)
  } catch (error) {
    console.error("Error in vehicle stats route:", error)
    return NextResponse.json({ error: "Error fetching vehicle stats" }, { status: 500 })
  }
}