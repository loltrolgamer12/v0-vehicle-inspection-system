import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Respuesta inmediata sin ninguna conexión a base de datos
    const emptyChartData = {
      daily: [],
      status: []
    }
    
    return NextResponse.json(emptyChartData)
  } catch (error) {
    console.error("Error in charts route:", error)
    return NextResponse.json({ error: "Error fetching chart data" }, { status: 500 })
  }
}
