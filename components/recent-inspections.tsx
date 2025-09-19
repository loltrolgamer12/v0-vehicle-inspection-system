"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Download, AlertTriangle, CheckCircle, Clock } from "lucide-react"

interface RecentInspection {
  id: string
  vehicleId: string
  driverName: string
  date: string
  status: "approved" | "rejected" | "pending"
  criticalIssues: number
  totalElements: number
}

export function RecentInspections() {
  const [inspections, setInspections] = useState<RecentInspection[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRecentInspections() {
      try {
        const response = await fetch("/api/inspections/recent")
        const data = await response.json()
        setInspections(data)
      } catch (error) {
        console.error("Error fetching recent inspections:", error)
        // Mock data for development
        setInspections([
          {
            id: "1",
            vehicleId: "VH-001",
            driverName: "Juan Pérez",
            date: "2024-01-21T08:30:00Z",
            status: "approved",
            criticalIssues: 0,
            totalElements: 40,
          },
          {
            id: "2",
            vehicleId: "VH-002",
            driverName: "María González",
            date: "2024-01-21T09:15:00Z",
            status: "rejected",
            criticalIssues: 3,
            totalElements: 40,
          },
          {
            id: "3",
            vehicleId: "VH-003",
            driverName: "Carlos Rodríguez",
            date: "2024-01-21T10:00:00Z",
            status: "pending",
            criticalIssues: 1,
            totalElements: 40,
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchRecentInspections()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "rejected":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Aprobada</Badge>
      case "rejected":
        return <Badge variant="destructive">Rechazada</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pendiente</Badge>
      default:
        return null
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Inspecciones Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse flex items-center space-x-4 p-4 border rounded-lg">
                <div className="h-4 w-4 bg-muted rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
                <div className="h-6 bg-muted rounded w-20" />
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
          Inspecciones Recientes
          <Button variant="outline" size="sm">
            Ver Todas
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {inspections.map((inspection) => (
            <div
              key={inspection.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                {getStatusIcon(inspection.status)}
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{inspection.vehicleId}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">{inspection.driverName}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <span>{new Date(inspection.date).toLocaleString("es-ES")}</span>
                    {inspection.criticalIssues > 0 && (
                      <>
                        <span>•</span>
                        <span className="text-red-600 font-medium">
                          {inspection.criticalIssues} problema{inspection.criticalIssues > 1 ? "s" : ""} crítico
                          {inspection.criticalIssues > 1 ? "s" : ""}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {getStatusBadge(inspection.status)}
                <div className="flex space-x-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
