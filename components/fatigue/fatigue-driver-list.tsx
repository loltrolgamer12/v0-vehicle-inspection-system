"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { User, Clock, Shield, Car, Eye } from "lucide-react"

interface FatigueDriver {
  id: string
  name: string
  status: "normal" | "warning" | "critical"
  hoursToday: number
  hoursWeek: number
  restHours: number
  maxDailyHours: number
  maxWeeklyHours: number
  minRestHours: number
  currentVehicle?: string
  lastActivity: string
}

export function FatigueDriverList() {
  const [drivers, setDrivers] = useState<FatigueDriver[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDrivers() {
      try {
        const response = await fetch("/api/fatigue/drivers")
        const data = await response.json()
        setDrivers(data)
      } catch (error) {
        console.error("Error fetching fatigue drivers:", error)
        // Mock data for development
        setDrivers([
          {
            id: "1",
            name: "Juan Pérez",
            status: "normal",
            hoursToday: 6.5,
            hoursWeek: 42,
            restHours: 10,
            maxDailyHours: 11,
            maxWeeklyHours: 56,
            minRestHours: 9,
            currentVehicle: "VH-001",
            lastActivity: "2024-01-21T14:30:00Z",
          },
          {
            id: "2",
            name: "María González",
            status: "warning",
            hoursToday: 9.5,
            hoursWeek: 48,
            restHours: 7,
            maxDailyHours: 11,
            maxWeeklyHours: 56,
            minRestHours: 9,
            currentVehicle: "VH-002",
            lastActivity: "2024-01-21T15:15:00Z",
          },
          {
            id: "3",
            name: "Carlos Rodríguez",
            status: "critical",
            hoursToday: 11.5,
            hoursWeek: 52,
            restHours: 6,
            maxDailyHours: 11,
            maxWeeklyHours: 56,
            minRestHours: 9,
            currentVehicle: "VH-003",
            lastActivity: "2024-01-21T15:30:00Z",
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchDrivers()
    // Refresh every 30 seconds
    const interval = setInterval(fetchDrivers, 30000)
    return () => clearInterval(interval)
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "normal":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Normal</Badge>
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Advertencia</Badge>
      case "critical":
        return <Badge variant="destructive">Crítico</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getProgressColor = (percentage: number, status: string) => {
    if (status === "critical") return "bg-red-500"
    if (status === "warning") return "bg-yellow-500"
    return "bg-green-500"
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Estado de Conductores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="h-4 w-4 bg-muted rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                  <div className="h-6 bg-muted rounded w-20" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Estado de Conductores
          <Button variant="outline" size="sm">
            Ver Todos
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {drivers.map((driver) => (
            <div
              key={driver.id}
              className={`p-4 border rounded-lg ${
                driver.status === "critical"
                  ? "border-red-200 bg-red-50"
                  : driver.status === "warning"
                    ? "border-yellow-200 bg-yellow-50"
                    : "border-green-200 bg-green-50"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h4 className="font-medium">{driver.name}</h4>
                    {driver.currentVehicle && (
                      <p className="text-xs text-muted-foreground flex items-center">
                        <Car className="h-3 w-3 mr-1" />
                        {driver.currentVehicle}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(driver.status)}
                  <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                    <Link href={`/drivers/${driver.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      Horas Hoy
                    </span>
                    <span className="font-medium">
                      {driver.hoursToday}h / {driver.maxDailyHours}h
                    </span>
                  </div>
                  <Progress
                    value={(driver.hoursToday / driver.maxDailyHours) * 100}
                    className="h-2"
                    indicatorClassName={getProgressColor(
                      (driver.hoursToday / driver.maxDailyHours) * 100,
                      driver.status,
                    )}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      Horas Semana
                    </span>
                    <span className="font-medium">
                      {driver.hoursWeek}h / {driver.maxWeeklyHours}h
                    </span>
                  </div>
                  <Progress
                    value={(driver.hoursWeek / driver.maxWeeklyHours) * 100}
                    className="h-2"
                    indicatorClassName={getProgressColor(
                      (driver.hoursWeek / driver.maxWeeklyHours) * 100,
                      driver.status,
                    )}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="flex items-center">
                      <Shield className="h-3 w-3 mr-1" />
                      Descanso
                    </span>
                    <span className="font-medium">
                      {driver.restHours}h / {driver.minRestHours}h
                    </span>
                  </div>
                  <Progress
                    value={(driver.restHours / driver.minRestHours) * 100}
                    className="h-2"
                    indicatorClassName={driver.restHours >= driver.minRestHours ? "bg-green-500" : "bg-red-500"}
                  />
                </div>
              </div>

              <div className="mt-3 pt-2 border-t text-xs text-muted-foreground">
                Última actividad: {new Date(driver.lastActivity).toLocaleString("es-ES")}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
