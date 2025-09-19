"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Download, CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react"
import Link from "next/link"

interface InspectionRecord {
  id: string
  vehicleId: string
  date: string
  status: "approved" | "pending" | "rejected"
  criticalIssues: number
  totalElements: number
  inspectorName?: string
}

interface DriverInspectionHistoryProps {
  driverId: string
}

export function DriverInspectionHistory({ driverId }: DriverInspectionHistoryProps) {
  const [inspections, setInspections] = useState<InspectionRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchInspectionHistory() {
      try {
        const response = await fetch(`/api/drivers/${driverId}/inspections`)
        const data = await response.json()
        setInspections(data)
      } catch (error) {
        console.error("Error fetching inspection history:", error)
        // Mock data for development
        setInspections([
          {
            id: "1",
            vehicleId: "SAS-001",
            date: "2024-01-21T10:30:00Z",
            status: "approved",
            criticalIssues: 0,
            totalElements: 45,
            inspectorName: "Juan Pérez"
          },
          {
            id: "2",
            vehicleId: "SAS-002",
            date: "2024-01-20T14:15:00Z",
            status: "rejected",
            criticalIssues: 3,
            totalElements: 45,
            inspectorName: "María González"
          },
          {
            id: "3",
            vehicleId: "SAS-001",
            date: "2024-01-19T08:45:00Z",
            status: "approved",
            criticalIssues: 0,
            totalElements: 45,
            inspectorName: "Juan Pérez"
          },
          {
            id: "4",
            vehicleId: "SAS-003",
            date: "2024-01-18T16:20:00Z",
            status: "pending",
            criticalIssues: 1,
            totalElements: 45,
            inspectorName: "Carlos Rodríguez"
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchInspectionHistory()
  }, [driverId])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
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
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historial de Inspecciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="h-4 w-4 bg-muted rounded-full" />
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-32" />
                      <div className="h-3 bg-muted rounded w-48" />
                    </div>
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
          Historial de Inspecciones
          <Button variant="outline" size="sm">
            Ver Todas
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {inspections.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No hay inspecciones registradas para este conductor</p>
            </div>
          ) : (
            inspections.map((inspection) => (
              <div
                key={inspection.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  {getStatusIcon(inspection.status)}
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{inspection.vehicleId}</span>
                      {inspection.inspectorName && (
                        <>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">
                            Inspector: {inspection.inspectorName}
                          </span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span>{new Date(inspection.date).toLocaleString("es-ES")}</span>
                      {inspection.criticalIssues > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-red-600 font-medium flex items-center">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {inspection.criticalIssues} problema{inspection.criticalIssues > 1 ? "s" : ""} crítico
                            {inspection.criticalIssues > 1 ? "s" : ""}
                          </span>
                        </>
                      )}
                      <span>•</span>
                      <span>{inspection.totalElements} elementos inspeccionados</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {getStatusBadge(inspection.status)}
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                      <Link href={`/inspections/${inspection.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {inspections.length > 0 && (
          <div className="mt-6 pt-4 border-t">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {inspections.filter(i => i.status === "approved").length}
                </div>
                <div className="text-xs text-muted-foreground">Aprobadas</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {inspections.filter(i => i.status === "rejected").length}
                </div>
                <div className="text-xs text-muted-foreground">Rechazadas</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {inspections.filter(i => i.status === "pending").length}
                </div>
                <div className="text-xs text-muted-foreground">Pendientes</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}