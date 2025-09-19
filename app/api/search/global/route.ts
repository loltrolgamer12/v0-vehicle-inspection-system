import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")
    const type = searchParams.get("type") || "all"
    const limit = Number.parseInt(searchParams.get("limit") || "20")

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [], total: 0 })
    }

    const searchTerm = `%${query.toLowerCase()}%`
    let results: any[] = []

    // Search in inspections
    if (type === "all" || type === "inspection") {
      const inspectionResults = await sql`
        SELECT 
          'inspection' as type,
          i.id,
          CONCAT('Inspección ', i.vehicle_id, ' - ', i.driver_name) as title,
          TO_CHAR(i.created_at, 'DD "de" Month, YYYY') as subtitle,
          CONCAT('Inspección con ', 
            CASE WHEN i.status = 'approved' THEN 'elementos aprobados'
                 WHEN i.status = 'rejected' THEN 'elementos rechazados'
                 ELSE 'elementos pendientes'
            END
          ) as description,
          i.created_at as date,
          i.status,
          95 as relevance
        FROM inspections i
        WHERE LOWER(i.vehicle_id) LIKE ${searchTerm}
           OR LOWER(i.driver_name) LIKE ${searchTerm}
        ORDER BY i.created_at DESC
        LIMIT ${Math.min(limit, 10)}
      `
      results = [...results, ...inspectionResults]
    }

    // Search in vehicles
    if (type === "all" || type === "vehicle") {
      const vehicleResults = await sql`
        SELECT 
          'vehicle' as type,
          v.id,
          CONCAT(v.brand, ' ', v.model, ' ', v.vehicle_id) as title,
          CONCAT(v.type, ' • ', v.year) as subtitle,
          CONCAT('Vehículo con kilometraje de ', v.mileage, ' km') as description,
          v.registration_date as date,
          v.status,
          88 as relevance
        FROM vehicles v
        WHERE LOWER(v.vehicle_id) LIKE ${searchTerm}
           OR LOWER(v.brand) LIKE ${searchTerm}
           OR LOWER(v.model) LIKE ${searchTerm}
        ORDER BY v.vehicle_id
        LIMIT ${Math.min(limit, 10)}
      `
      results = [...results, ...vehicleResults]
    }

    // Search in drivers
    if (type === "all" || type === "driver") {
      const driverResults = await sql`
        SELECT 
          'driver' as type,
          d.id,
          d.name as title,
          CONCAT('Licencia ', d.license_type, ' • ', d.experience_years, ' años experiencia') as subtitle,
          CONCAT('Conductor con ', d.experience_years, ' años de experiencia') as description,
          d.hire_date as date,
          d.status,
          82 as relevance
        FROM drivers d
        WHERE LOWER(d.name) LIKE ${searchTerm}
           OR LOWER(d.license_number) LIKE ${searchTerm}
        ORDER BY d.name
        LIMIT ${Math.min(limit, 10)}
      `
      results = [...results, ...driverResults]
    }

    // Sort by relevance
    results.sort((a, b) => b.relevance - a.relevance)

    return NextResponse.json({
      results: results.slice(0, limit),
      total: results.length,
      query,
    })
  } catch (error) {
    console.error("Error in global search:", error)
    return NextResponse.json({ error: "Search error" }, { status: 500 })
  }
}
