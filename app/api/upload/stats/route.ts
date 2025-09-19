import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Respuesta inmediata sin ninguna conexión a base de datos
    const emptyStats = {
      totalUploads: 0,
      successfulUploads: 0,
      failedUploads: 0,
      lastUpload: null
    }
    
    return NextResponse.json(emptyStats)
  } catch (error) {
    console.error("Error in upload stats route:", error)
    return NextResponse.json({ error: "Error fetching upload stats" }, { status: 500 })
  }
}