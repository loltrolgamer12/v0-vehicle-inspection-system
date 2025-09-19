import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const drivers = await sql`
      SELECT 
        d.*,
        fc.hours_driven as hours_today,
        fc.hours_week,
        fc.fatigue_status,
        i.created_at as last_inspection,
        v.vehicle_id as current_vehicle
      FROM drivers d
      LEFT JOIN fatigue_control fc ON d.id = fc.driver_id 
        AND fc.created_at >= CURRENT_DATE
      LEFT JOIN inspections i ON d.name = i.driver_name
      LEFT JOIN vehicles v ON i.vehicle_id = v.vehicle_id
      GROUP BY d.id, d.name, d.license_number, d.license_type, d.status, 
               d.phone, d.email, d.address, d.birth_date, d.hire_date,
               d.experience_years, d.emergency_contact, d.emergency_phone,
               fc.hours_driven, fc.hours_week, fc.fatigue_status,
               i.created_at, v.vehicle_id
      ORDER BY d.name
    `

    const formattedDrivers = drivers.map((driver) => ({
      id: driver.id,
      name: driver.name,
      licenseNumber: driver.license_number,
      licenseType: driver.license_type,
      status: driver.status,
      dutyStatus: driver.hours_today > 0 ? "on-duty" : "off-duty",
      fatigueStatus: driver.fatigue_status || "normal",
      currentVehicle: driver.current_vehicle,
      hoursToday: Number(driver.hours_today) || 0,
      hoursWeek: Number(driver.hours_week) || 0,
      lastInspection: driver.last_inspection || new Date().toISOString(),
      experienceYears: driver.experience_years,
      phone: driver.phone,
    }))

    return NextResponse.json(formattedDrivers)
  } catch (error) {
    console.error("Error fetching drivers:", error)
    return NextResponse.json({ error: "Error fetching drivers" }, { status: 500 })
  }
}
