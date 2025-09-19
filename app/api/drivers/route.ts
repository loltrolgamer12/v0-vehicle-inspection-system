import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Respuesta inmediata sin ninguna conexión a base de datos
    return NextResponse.json([])
  } catch (error) {
    console.error("Error in drivers route:", error)
    return NextResponse.json({ error: "Error fetching drivers" }, { status: 500 })
  }
}