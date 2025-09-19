"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Clock, Shield, Bell } from "lucide-react"

interface Alert {
  id: string
  type: "critical" | "warning" | "fatigue" | "maintenance"
  title: string
  description: string
  vehicleId?: string
  driverName?: string
  timestamp: string
  priority: "high" | "medium" | "low"
}

export function AlertsPanel() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const response = await fetch("/api/alerts/active")
        const data = await response.json()
        setAlerts(data)
      } catch (error) {
        console.error("Error fetching alerts:", error)
        // Mock data for development
        setAlerts([
          {
            id: "1",
            type: "critical",
            title: "Falla Crítica en Frenos",
            description: "Sistema de frenos presenta anomalías graves",
            vehicleId: "VH-002",
            driverName: "María González",
            timestamp: "2024-01-21T09:15:00Z",
            priority: "high",
          },
          {
            id: "2",
            type: "fatigue",
            title: "Alerta de Fatiga",
            description: "Conductor excede límite de horas de conducción",
            vehicleId: "VH-005",
            driverName: "Pedro Martínez",
            timestamp: "2024-01-21T11:30:00Z",
            priority: "high",
          },
          {
            id: "3",
            type: "maintenance",
            title: "Mantenimiento Preventivo",
            description: "Vehículo próximo a mantenimiento programado",
            vehicleId: "VH-001",
            timestamp: "2024-01-21T08:00:00Z",
            priority: "medium",
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
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "fatigue":
        return <Shield className="h-4 w-4 text-orange-600" />
      case "maintenance":
        return <Clock className="h-4 w-4 text-blue-600" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <Badge variant="destructive" className="text-xs">
            Alta
          </Badge>
        )
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 text-xs">Media</Badge>
      case "low":
        return (
          <Badge variant="outline" className="text-xs">
            Baja
          </Badge>
        )
      default:
        return null
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Alertas Activas</CardTitle>
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
          Alertas Activas
          <Badge variant="outline" className="text-xs">
            {alerts.length} activa{alerts.length !== 1 ? "s" : ""}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No hay alertas activas</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div key={alert.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getAlertIcon(alert.type)}
                    <span className="font-medium text-sm">{alert.title}</span>
                  </div>
                  {getPriorityBadge(alert.priority)}
                </div>

                <p className="text-xs text-muted-foreground mb-2">{alert.description}</p>

                <div className="flex items-center justify-between text-xs">
                  <div className="text-muted-foreground">
                    {alert.vehicleId && <span className="font-medium">{alert.vehicleId}</span>}
                    {alert.driverName && <span> • {alert.driverName}</span>}
                  </div>
                  <span className="text-muted-foreground">
                    {new Date(alert.timestamp).toLocaleTimeString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {alerts.length > 0 && (
          <div className="mt-4 pt-3 border-t">
            <Button variant="outline" size="sm" className="w-full bg-transparent">
              Ver Todas las Alertas
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
