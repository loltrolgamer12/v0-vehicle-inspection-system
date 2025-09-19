import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validar tipo de archivo
    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      return NextResponse.json({ error: "Invalid file type. Only Excel files are allowed." }, { status: 400 })
    }

    // Validar tamaño (10MB límite)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File size exceeds 10MB limit" }, { status: 400 })
    }

    // Simular procesamiento exitoso sin base de datos
    const results = {
      totalRecords: 0,
      newRecords: 0,
      duplicates: 0,
      errors: 0,
      message: "File processed successfully (no database configured)"
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error("Error processing Excel upload:", error)
    return NextResponse.json({ error: "Error processing file" }, { status: 500 })
  }
}

