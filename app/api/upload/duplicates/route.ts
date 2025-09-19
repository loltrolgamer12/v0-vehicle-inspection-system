import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    // In a real implementation, this would fetch actual duplicate records
    // For now, we'll return mock data
    const duplicates = await sql`
      SELECT 
        i1.id,
        i1.vehicle_id,
        i1.driver_name,
        i1.created_at as inspection_date,
        i1.hash,
        i2.created_at as existing_record_date,
        100 as similarity
      FROM inspections i1
      JOIN inspections i2 ON i1.hash = i2.hash AND i1.id != i2.id
      WHERE i1.created_at >= CURRENT_DATE - INTERVAL '1 day'
      ORDER BY i1.created_at DESC
      LIMIT 10
    `

    const formattedDuplicates = duplicates.map((duplicate) => ({
      id: duplicate.id,
      vehicleId: duplicate.vehicle_id,
      driverName: duplicate.driver_name,
      inspectionDate: duplicate.inspection_date,
      hash: duplicate.hash,
      existingRecordDate: duplicate.existing_record_date,
      similarity: Number(duplicate.similarity),
    }))

    return NextResponse.json(formattedDuplicates)
  } catch (error) {
    console.error("Error fetching duplicates:", error)
    return NextResponse.json({ error: "Error fetching duplicates" }, { status: 500 })
  }
}
