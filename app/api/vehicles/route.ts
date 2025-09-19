import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const vehicles = await sql`
      SELECT 
        v.*,
        i.driver_name,
        i.created_at as last_inspection,
        COUNT(i.id) as inspection_count
      FROM vehicles v
      LEFT JOIN inspections i ON v.vehicle_id = i.vehicle_id
      GROUP BY v.id, v.vehicle_id, v.brand, v.model, v.year, v.type, v.status, 
               v.vin, v.license_plate, v.mileage, v.fuel_type, v.capacity,
               v.location, v.last_maintenance, v.next_maintenance, v.registration_date,
               i.driver_name, i.created_at
      ORDER BY v.vehicle_id
    `

    const formattedVehicles = vehicles.map((vehicle) => ({
      id: vehicle.id,
      vehicleId: vehicle.vehicle_id,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      type: vehicle.type,
      status: vehicle.status,
      lastInspection: vehicle.last_inspection,
      nextMaintenance: vehicle.next_maintenance,
      driverName: vehicle.driver_name,
      mileage: vehicle.mileage,
      inspectionCount: Number(vehicle.inspection_count),
    }))

    return NextResponse.json(formattedVehicles)
  } catch (error) {
    console.error("Error fetching vehicles:", error)
    return NextResponse.json({ error: "Error fetching vehicles" }, { status: 500 })
  }
}
