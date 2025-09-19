import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const driver = await sql`
      SELECT 
        d.*,
        fc.fatigue_status
      FROM drivers d
      LEFT JOIN fatigue_control fc ON d.id = fc.driver_id 
        AND fc.created_at >= CURRENT_DATE
      WHERE d.id = ${params.id}
    `

    if (driver.length === 0) {
      return NextResponse.json({ error: "Driver not found" }, { status: 404 })
    }

    const driverData = driver[0]

    return NextResponse.json({
      id: driverData.id,
      name: driverData.name,
      licenseNumber: driverData.license_number,
      licenseType: driverData.license_type,
      status: driverData.status,
      dutyStatus: "on-duty", // This would be calculated based on current activity
      fatigueStatus: driverData.fatigue_status || "normal",
      phone: driverData.phone,
      email: driverData.email,
      address: driverData.address,
      birthDate: driverData.birth_date,
      hireDate: driverData.hire_date,
      experienceYears: driverData.experience_years,
      emergencyContact: driverData.emergency_contact,
      emergencyPhone: driverData.emergency_phone,
    })
  } catch (error) {
    console.error("Error fetching driver:", error)
    return NextResponse.json({ error: "Error fetching driver" }, { status: 500 })
  }
}
