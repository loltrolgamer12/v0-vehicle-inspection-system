import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Respuesta inmediata sin ninguna conexión a base de datos
    return NextResponse.json([])
  } catch (error) {
    console.error("Error in vehicles route:", error)
    return NextResponse.json({ error: "Error fetching vehicles" }, { status: 500 })
  }
}