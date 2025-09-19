import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      return NextResponse.json({ error: "Invalid file type. Only Excel files are allowed." }, { status: 400 })
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File size exceeds 10MB limit" }, { status: 400 })
    }

    // In a real implementation, you would:
    // 1. Parse the Excel file using a library like 'xlsx'
    // 2. Validate the data structure
    // 3. Check for duplicates using the hash system
    // 4. Insert new records into the database

    // Mock processing for development
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simulate duplicate detection
    const mockResults = {
      totalRecords: 150,
      newRecords: 142,
      duplicates: 8,
      errors: 0,
    }

    // Log the upload
    await sql`
      INSERT INTO upload_logs (filename, status, total_records, new_records, duplicates, errors, uploaded_by)
      VALUES (${file.name}, 'success', ${mockResults.totalRecords}, ${mockResults.newRecords}, ${mockResults.duplicates}, ${mockResults.errors}, 'System')
    `

    return NextResponse.json(mockResults)
  } catch (error) {
    console.error("Error processing Excel upload:", error)
    return NextResponse.json({ error: "Error processing file" }, { status: 500 })
  }
}
