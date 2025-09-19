import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const vehicle = await sql`
      SELECT * FROM vehicles WHERE id = ${params.id}
    `

    if (vehicle.length === 0) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 })
    }

    const vehicleData = vehicle[0]

    return NextResponse.json({
      id: vehicleData.id,
      vehicleId: vehicleData.vehicle_id,
      brand: vehicleData.brand,
      model: vehicleData.model,
      year: vehicleData.year,
      type: vehicleData.type,
      status: vehicleData.status,
      vin: vehicleData.vin,
      licensePlate: vehicleData.license_plate,
      mileage: vehicleData.mileage,
      fuelType: vehicleData.fuel_type,
      capacity: vehicleData.capacity,
      location: vehicleData.location,
      lastMaintenance: vehicleData.last_maintenance,
      nextMaintenance: vehicleData.next_maintenance,
      registrationDate: vehicleData.registration_date,
    })
  } catch (error) {
    console.error("Error fetching vehicle:", error)
    return NextResponse.json({ error: "Error fetching vehicle" }, { status: 500 })
  }
}
