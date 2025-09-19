import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Simular generación de reporte sin base de datos
    const report = {
      status: "generated",
      url: null,
      message: "No data available for report generation"
    }
    
    return NextResponse.json(report)
  } catch (error) {
    console.error("Error generating report:", error)
    return NextResponse.json({ error: "Error generating report" }, { status: 500 })
  }
}