import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Respuesta inmediata sin ninguna conexión a base de datos
    const emptyResults = {
      vehicles: [],
      drivers: [],
      inspections: []
    }
    
    return NextResponse.json(emptyResults)
  } catch (error) {
    console.error("Error in global search route:", error)
    return NextResponse.json({ error: "Error en búsqueda global" }, { status: 500 })
  }
}