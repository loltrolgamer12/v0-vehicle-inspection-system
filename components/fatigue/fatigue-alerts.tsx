"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Clock, Shield, User, Phone } from "lucide-react"

interface FatigueAlert {
  id: string
  driverId: string
  driverName: string
  type: "hours_exceeded" | "rest_insufficient" | "continuous_driving"
  severity: "warning" | "critical"
  message: string
  hoursToday: number
  hoursWeek: number
  restHours: number
  vehicleId?: string
  timestamp: string
}

export function FatigueAlerts() {
  const [alerts, setAlerts] = useState<FatigueAlert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const response = await fetch("/api/fatigue/alerts")
        const data = await response.json()
        setAlerts(data)
      } catch (error) {
        console.error("Error fetching fatigue alerts:", error)
        // Mock data for development
        setAlerts([
          {
            id: "1",
            driverId: "3",
            driverName: "Carlos Rodríguez",
            type: "hours_exceeded",
            severity: "critical",
            message: "Conductor excede 11 horas de conducción diaria",
            hoursToday: 11.5,
            hoursWeek: 52,
            restHours: 6,
            vehicleId: "VH-003",
            timestamp: "2024-01-21T15:30:00Z",
          },
          {
            id: "2",
            driverId: "2",
            driverName: "María González",
            type: "rest_insufficient",
            severity: "warning",
            message: "Descanso insuficiente entre jornadas",
            hoursToday: 9.5,
            hoursWeek: 48,
            restHours: 7,
            vehicleId: "VH-002",
            timestamp: "2024-01-21T14:15:00Z",
          },
          {
            id: "3",
            driverId: "5",
            driverName: "Pedro Martínez",
            type: "continuous_driving",
            severity: "warning",
            message: "Conducción continua sin descanso por 4.5 horas",
            hoursToday: 8,
            hoursWeek: 44,
            restHours: 8,
            vehicleId: "VH-005",
            timestamp: "2024-01-21T13:00:00Z",
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchAlerts()
    // Refresh every 60 seconds
    const interval = setInterval(fetchAlerts, 60000)
    return () => clearInterval(interval)
  }, [])

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "hours_exceeded":
        return <Clock className="h-4 w-4 text-red-600" />
      case "rest_insufficient":
        return <Shield className="h-4 w-4 text-yellow-600" />
      case "continuous_driving":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return (
          <Badge variant="destructive" className="text-xs">
            Crítico
          </Badge>
        )
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 text-xs">Advertencia</Badge>
      default:
        return null
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Alertas de Fatiga</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse p-3 border rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="h-4 w-4 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </div>
                <div className="h-3 bg-muted rounded w-3/4" />
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
          Alertas de Fatiga
          <Badge variant="outline" className="text-xs">
            {alerts.length} activa{alerts.length !== 1 ? "s" : ""}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No hay alertas de fatiga activas</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 border rounded-lg ${
                  alert.severity === "critical" ? "border-red-200 bg-red-50" : "border-yellow-200 bg-yellow-50"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getAlertIcon(alert.type)}
                    <span className="font-medium text-sm">{alert.driverName}</span>
                  </div>
                  {getSeverityBadge(alert.severity)}
                </div>

                <p className="text-sm text-muted-foreground mb-3">{alert.message}</p>

                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>Hoy: {alert.hoursToday}h</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>Semana: {alert.hoursWeek}h</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Shield className="h-3 w-3" />
                    <span>Descanso: {alert.restHours}h</span>
                  </div>
                  {alert.vehicleId && (
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>{alert.vehicleId}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{new Date(alert.timestamp).toLocaleString("es-ES")}</span>
                  <div className="flex space-x-1">
                    <Button size="sm" variant="outline" className="h-6 text-xs bg-transparent">
                      <Phone className="h-3 w-3 mr-1" />
                      Contactar
                    </Button>
                    <Button
                      size="sm"
                      variant={alert.severity === "critical" ? "destructive" : "secondary"}
                      className="h-6 text-xs"
                    >
                      Resolver
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {alerts.length > 0 && (
          <div className="mt-4 pt-3 border-t">
            <Button variant="outline" size="sm" className="w-full bg-transparent">
              Ver Historial de Alertas
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
