import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const drivers = await sql`
      SELECT 
        d.id,
        d.name,
        fc.hours_driven,
        fc.hours_week,
        fc.rest_hours,
        fc.fatigue_status,
        fc.created_at as last_activity,
        i.vehicle_id as current_vehicle
      FROM drivers d
      LEFT JOIN fatigue_control fc ON d.id = fc.driver_id 
        AND fc.created_at >= CURRENT_DATE
      LEFT JOIN inspections i ON d.name = i.driver_name
      WHERE d.status = 'active'
      GROUP BY d.id, d.name, fc.hours_driven, fc.hours_week, fc.rest_hours, 
               fc.fatigue_status, fc.created_at, i.vehicle_id
      ORDER BY 
        CASE fc.fatigue_status 
          WHEN 'critical' THEN 1 
          WHEN 'warning' THEN 2 
          ELSE 3 
        END,
        d.name
    `

    const formattedDrivers = drivers.map((driver) => ({
      id: driver.id,
      name: driver.name,
      status: driver.fatigue_status || "normal",
      hoursToday: Number(driver.hours_driven) || 0,
      hoursWeek: Number(driver.hours_week) || 0,
      restHours: Number(driver.rest_hours) || 8,
      maxDailyHours: 11,
      maxWeeklyHours: 56,
      minRestHours: 9,
      currentVehicle: driver.current_vehicle,
      lastActivity: driver.last_activity || new Date().toISOString(),
    }))

    return NextResponse.json(formattedDrivers)
  } catch (error) {
    console.error("Error fetching fatigue drivers:", error)
    return NextResponse.json({ error: "Error fetching fatigue drivers" }, { status: 500 })
  }
}
