import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const history = await sql`
      SELECT 
        id,
        filename,
        created_at as upload_date,
        status,
        total_records,
        new_records,
        duplicates,
        errors,
        uploaded_by
      FROM upload_logs
      ORDER BY created_at DESC
      LIMIT 20
    `

    const formattedHistory = history.map((record) => ({
      id: record.id,
      filename: record.filename,
      uploadDate: record.upload_date,
      status: record.status,
      totalRecords: Number(record.total_records),
      newRecords: Number(record.new_records),
      duplicates: Number(record.duplicates),
      errors: Number(record.errors),
      uploadedBy: record.uploaded_by,
    }))

    return NextResponse.json(formattedHistory)
  } catch (error) {
    console.error("Error fetching upload history:", error)
    return NextResponse.json({ error: "Error fetching upload history" }, { status: 500 })
  }
}
