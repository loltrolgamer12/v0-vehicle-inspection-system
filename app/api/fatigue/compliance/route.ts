import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Respuesta inmediata sin ninguna conexión a base de datos
    const emptyCompliance = {
      totalDrivers: 0,
      compliant: 0,
      nonCompliant: 0,
      pending: 0
    }
    
    return NextResponse.json(emptyCompliance)
  } catch (error) {
    console.error("Error in fatigue compliance route:", error)
    return NextResponse.json({ error: "Error fetching compliance data" }, { status: 500 })
  }
}