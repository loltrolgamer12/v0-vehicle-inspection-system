"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

interface Inspection {
  id: string
  vehicleId: string
  driverName: string
  date: string
  status: 'approved' | 'rejected' | 'pending'
  criticalIssues: number
  totalElements: number
}

export function RecentInspections() {
  const [inspections, setInspections] = useState<Inspection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchInspections() {
      try {
        setLoading(true)
        setError(false)
        const response = await fetch("/api/inspections/recent")
        if (!response.ok) throw new Error('Failed to fetch')
        const data = await response.json()
        setInspections(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Error fetching recent inspections:", error)
        setError(true)
        setInspections([])
      } finally {
        setLoading(false)
      }
    }

    fetchInspections()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-muted rounded w-1/4" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-4 bg-muted rounded w-20" />
                <div className="h-4 bg-muted rounded flex-1" />
                <div className="h-6 bg-muted rounded w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Aprobada</Badge>
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rechazada</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pendiente</Badge>
      default:
        return <Badge variant="secondary">Desconocido</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Inspecciones Recientes</CardTitle>
        <p className="text-sm text-muted-foreground">Últimas inspecciones realizadas</p>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="text-center py-8 text-muted-foreground">
            No se pudieron cargar las inspecciones
          </div>
        ) : inspections.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No hay inspecciones recientes
          </div>
        ) : (
          <div className="space-y-4">
            {inspections.map((inspection) => (
              <div key={inspection.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <div className="font-medium text-sm">
                      Vehículo {inspection.vehicleId}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {inspection.driverName}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(inspection.date), { 
                        addSuffix: true, 
                        locale: es 
                      })}
                    </div>
                  </div>
                  {inspection.criticalIssues > 0 && (
                    <div className="text-xs text-red-600 mt-1">
                      {inspection.criticalIssues} problema(s) crítico(s)
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(inspection.status)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}