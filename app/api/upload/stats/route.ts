import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const stats = await sql`
      SELECT 
        COUNT(*) as total_uploads,
        COUNT(CASE WHEN status = 'success' THEN 1 END) as successful_uploads,
        SUM(duplicates) as duplicates_detected,
        SUM(new_records) as records_processed,
        MAX(created_at) as last_upload
      FROM upload_logs
      WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
    `

    const result = stats[0]

    return NextResponse.json({
      totalUploads: Number(result.total_uploads) || 0,
      successfulUploads: Number(result.successful_uploads) || 0,
      duplicatesDetected: Number(result.duplicates_detected) || 0,
      recordsProcessed: Number(result.records_processed) || 0,
      lastUpload: result.last_upload || new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching upload stats:", error)
    return NextResponse.json({ error: "Error fetching upload stats" }, { status: 500 })
  }
}
