"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Download, CheckCircle, XCircle, Clock, AlertTriangle, User, Calendar } from "lucide-react"
import Link from "next/link"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface VehicleInspectionRecord {
  id: string
  driverName: string
  date: string
  status: "approved" | "pending" | "rejected"
  criticalIssues: number
  totalElements: number
  mileage?: number
  contract?: string
  shift?: string
  observations?: string
}

interface VehicleInspectionHistoryProps {
  vehicleId: string
}

export function VehicleInspectionHistory({ vehicleId }: VehicleInspectionHistoryProps) {
  const [inspections, setInspections] = useState<VehicleInspectionRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<"week" | "month" | "quarter">("month")

  useEffect(() => {
    async function fetchInspectionHistory() {
      try {
        const response = await fetch(`/api/vehicles/${vehicleId}/inspections?range=${timeRange}`)
        const data = await response.json()
        setInspections(data)
      } catch (error) {
        console.error("Error fetching inspection history:", error)
        // Mock data for development
        setInspections([
          {
            id: "1",
            driverName: "Juan Pérez",
            date: "2024-01-21T08:30:00Z",
            status: "rejected",
            criticalIssues: 3,
            totalElements: 45,
            mileage: 156420,
            contract: "ECOPETROL-2024",
            shift: "Diurno",
            observations: "Frenos presentan desgaste excesivo, aceite del motor muy negro"
          },
          {
            id: "2",
            driverName: "María González",
            date: "2024-01-20T14:15:00Z",
            status: "approved",
            criticalIssues: 0,
            totalElements: 45,
            mileage: 156180,
            contract: "ECOPETROL-2024",
            shift: "Diurno",
            observations: "Vehículo en óptimas condiciones"
          },
          {
            id: "3",
            driverName: "Carlos Rodríguez",
            date: "2024-01-19T16:45:00Z",
            status: "approved",
            criticalIssues: 0,
            totalElements: 45,
            mileage: 155950,
            contract: "ECOPETROL-2024",
            shift: "Nocturno",
            observations: "Revisión rutinaria completada satisfactoriamente"
          },
          {
            id: "4",
            driverName: "Ana López",
            date: "2024-01-18T07:20:00Z",
            status: "pending",
            criticalIssues: 1,
            totalElements: 45,
            mileage: 155720,
            contract: "ECOPETROL-2024",
            shift: "Diurno",
            observations: "Batería presenta baja carga, requiere verificación"
          },
          {
            id: "5",
            driverName: "Pedro Martín",
            date: "2024-01-17T13:10:00Z",
            status: "approved",
            criticalIssues: 0,
            totalElements: 45,
            mileage: 155480,
            contract: "ECOPETROL-2024",
            shift: "Diurno",
            observations: "Inspección diaria sin novedad"
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchInspectionHistory()
  }, [vehicleId, timeRange])

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

  // Prepare chart data
  const chartData = inspections.slice(-7).map((inspection, index) => ({
    date: new Date(inspection.date).toLocaleDateString("es-ES", { month: 'short', day: 'numeric' }),
    mileage: inspection.mileage || 0,
    criticalIssues: inspection.criticalIssues,
    status: inspection.status === "approved" ? 1 : inspection.status === "pending" ? 0.5 : 0
  })).reverse()

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
                      <div className="h-4 bg-muted rounded w-48" />
                      <div className="h-3 bg-muted rounded w-32" />
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
          <div className="flex items-center">
            Historial de Inspecciones
            <Badge variant="outline" className="ml-2">
              {inspections.length} inspecciones
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as "week" | "month" | "quarter")}
              className="text-sm border rounded px-2 py-1"
            >
              <option value="week">Última semana</option>
              <option value="month">Último mes</option>
              <option value="quarter">Último trimestre</option>
            </select>
            <Button variant="outline" size="sm">
              Ver Todas
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Trend Chart */}
        <div>
          <h4 className="font-medium mb-3">Tendencia de Kilometraje e Inspecciones</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="mileage" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Kilometraje"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="criticalIssues" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="Fallas Críticas"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inspections List */}
        <div className="space-y-4">
          {inspections.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No hay inspecciones registradas para este vehículo</p>
            </div>
          ) : (
            inspections.map((inspection) => (
              <div
                key={inspection.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-4 flex-1">
                  {getStatusIcon(inspection.status)}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{inspection.driverName}</span>
                      {inspection.shift && (
                        <Badge variant="outline" className="text-xs">
                          {inspection.shift}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(inspection.date).toLocaleString("es-ES")}</span>
                      {inspection.mileage && (
                        <>
                          <span>•</span>
                          <span>{inspection.mileage.toLocaleString()} km</span>
                        </>
                      )}
                      {inspection.criticalIssues > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-red-600 font-medium flex items-center">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {inspection.criticalIssues} problema{inspection.criticalIssues > 1 ? "s" : ""} crítico{inspection.criticalIssues > 1 ? "s" : ""}
                          </span>
                        </>
                      )}
                    </div>
                    {inspection.observations && (
                      <p className="text-xs text-muted-foreground mt-1 bg-muted/50 p-2 rounded">
                        <strong>Observaciones:</strong> {inspection.observations}
                      </p>
                    )}
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

        {/* Summary Statistics */}
        {inspections.length > 0 && (
          <div className="mt-6 pt-4 border-t">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-green-600">
                  {inspections.filter(i => i.status === "approved").length}
                </div>
                <div className="text-xs text-muted-foreground">Aprobadas</div>
              </div>
              <div>
                <div className="text-lg font-bold text-red-600">
                  {inspections.filter(i => i.status === "rejected").length}
                </div>
                <div className="text-xs text-muted-foreground">Rechazadas</div>
              </div>
              <div>
                <div className="text-lg font-bold text-yellow-600">
                  {inspections.filter(i => i.status === "pending").length}
                </div>
                <div className="text-xs text-muted-foreground">Pendientes</div>
              </div>
              <div>
                <div className="text-lg font-bold text-blue-600">
                  {inspections.reduce((sum, i) => sum + i.criticalIssues, 0)}
                </div>
                <div className="text-xs text-muted-foreground">Fallas Críticas</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}