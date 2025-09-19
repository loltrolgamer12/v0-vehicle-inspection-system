import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Respuesta inmediata sin ninguna conexión a base de datos
    return NextResponse.json([])
  } catch (error) {
    console.error("Error in alerts route:", error)
    return NextResponse.json({ error: "Error fetching active alerts" }, { status: 500 })
  }
}