import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Respuesta inmediata sin ninguna conexión a base de datos
    return NextResponse.json({ error: "Driver not found" }, { status: 404 })
  } catch (error) {
    console.error("Error in driver detail route:", error)
    return NextResponse.json({ error: "Error fetching driver" }, { status: 500 })
  }
}