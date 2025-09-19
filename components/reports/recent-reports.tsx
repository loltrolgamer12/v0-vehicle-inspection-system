"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  FileText, 
  Download, 
  Eye, 
  MoreHorizontal, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Calendar,
  FileDown
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ReportRecord {
  id: string
  title: string
  type: string
  format: string
  status: "completed" | "processing" | "failed" | "scheduled"
  createdAt: string
  createdBy: string
  fileSize?: string
  downloadUrl?: string
  description?: string
}

export function RecentReports() {
  const [reports, setReports] = useState<ReportRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRecentReports() {
      try {
        const response = await fetch("/api/reports/recent")
        const data = await response.json()
        setReports(data)
      } catch (error) {
        console.error("Error fetching recent reports:", error)
        // Mock data for development
        setReports([
          {
            id: "1",
            title: "Reporte Mensual de Inspecciones",
            type: "inspections",
            format: "pdf",
            status: "completed",
            createdAt: "2024-01-21T10:30:00Z",
            createdBy: "Juan Pérez",
            fileSize: "2.4 MB",
            downloadUrl: "/api/reports/download/1",
            description: "Resumen completo de inspecciones del mes de enero"
          },
          {
            id: "2",
            title: "Estado de Flota Vehicular",
            type: "vehicles",
            format: "excel",
            status: "completed",
            createdAt: "2024-01-20T14:15:00Z",
            createdBy: "María González",
            fileSize: "1.8 MB",
            downloadUrl: "/api/reports/download/2",
            description: "Análisis detallado del estado actual de todos los vehículos"
          },
          {
            id: "3",
            title: "Control de Fatiga Semanal",
            type: "fatigue",
            format: "pdf",
            status: "processing",
            createdAt: "2024-01-21T16:45:00Z",
            createdBy: "Carlos Rodríguez",
            description: "Reporte de control de horas y descanso de conductores"
          },
          {
            id: "4",
            title: "Análisis de Cumplimiento",
            type: "compliance",
            format: "word",
            status: "failed",
            createdAt: "2024-01-19T09:20:00Z",
            createdBy: "Ana López",
            description: "Reporte de métricas de cumplimiento regulatorio"
          },
          {
            id: "5",
            title: "Rendimiento de Conductores",
            type: "drivers",
            format: "pdf",
            status: "scheduled",
            createdAt: "2024-01-22T08:00:00Z",
            createdBy: "Sistema",
            description: "Reporte programado mensual de rendimiento"
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchRecentReports()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "processing":
        return <Clock className="h-4 w-4 text-yellow-600 animate-spin" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "scheduled":
        return <Calendar className="h-4 w-4 text-blue-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completado</Badge>
      case "processing":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Procesando</Badge>
      case "failed":
        return <Badge variant="destructive">Fallido</Badge>
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Programado</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTypeLabel = (type: string) => {
    const types = {
      inspections: "Inspecciones",
      vehicles: "Vehículos", 
      drivers: "Conductores",
      fatigue: "Control de Fatiga",
      compliance: "Cumplimiento"
    }
    return types[type as keyof typeof types] || type
  }

  const getFormatIcon = (format: string) => {
    switch (format.toLowerCase()) {
      case "pdf":
        return "🔴"
      case "excel":
        return "🟢"
      case "word":
        return "🔵"
      case "csv":
        return "📊"
      default:
        return "📄"
    }
  }

  const handleDownload = (report: ReportRecord) => {
    if (report.downloadUrl && report.status === "completed") {
      // In a real implementation, this would trigger the download
      console.log(`Downloading report: ${report.title}`)
      window.open(report.downloadUrl, '_blank')
    }
  }

  const handleRetry = (reportId: string) => {
    console.log(`Retrying report generation: ${reportId}`)
    // In a real implementation, this would retry the failed report
  }

  const handleDelete = (reportId: string) => {
    setReports(prev => prev.filter(r => r.id !== reportId))
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reportes Recientes</CardTitle>
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
            <FileText className="h-5 w-5 mr-2" />
            Reportes Recientes
          </div>
          <Button variant="outline" size="sm">
            Ver Todos
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reports.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No hay reportes recientes</p>
            </div>
          ) : (
            reports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-4 flex-1">
                  {getStatusIcon(report.status)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium truncate">{report.title}</span>
                      <span className="text-xs">{getFormatIcon(report.format)}</span>
                      <Badge variant="outline" className="text-xs">
                        {getTypeLabel(report.type)}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span>{new Date(report.createdAt).toLocaleString("es-ES")}</span>
                      <span>•</span>
                      <span>{report.createdBy}</span>
                      {report.fileSize && (
                        <>
                          <span>•</span>
                          <span>{report.fileSize}</span>
                        </>
                      )}
                    </div>
                    {report.description && (
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {report.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {getStatusBadge(report.status)}
                  
                  <div className="flex items-center space-x-1">
                    {report.status === "completed" && report.downloadUrl && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleDownload(report)}
                        title="Descargar"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      title="Ver detalles"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {report.status === "completed" && report.downloadUrl && (
                          <DropdownMenuItem onClick={() => handleDownload(report)}>
                            <Download className="h-4 w-4 mr-2" />
                            Descargar
                          </DropdownMenuItem>
                        )}
                        {report.status === "failed" && (
                          <DropdownMenuItem onClick={() => handleRetry(report.id)}>
                            <FileDown className="h-4 w-4 mr-2" />
                            Reintentar
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalles
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDelete(report.id)}
                          className="text-red-600"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {reports.length > 0 && (
          <div className="mt-6 pt-4 border-t">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-green-600">
                  {reports.filter(r => r.status === "completed").length}
                </div>
                <div className="text-xs text-muted-foreground">Completados</div>
              </div>
              <div>
                <div className="text-lg font-bold text-yellow-600">
                  {reports.filter(r => r.status === "processing").length}
                </div>
                <div className="text-xs text-muted-foreground">En Proceso</div>
              </div>
              <div>
                <div className="text-lg font-bold text-red-600">
                  {reports.filter(r => r.status === "failed").length}
                </div>
                <div className="text-xs text-muted-foreground">Fallidos</div>
              </div>
              <div>
                <div className="text-lg font-bold text-blue-600">
                  {reports.filter(r => r.status === "scheduled").length}
                </div>
                <div className="text-xs text-muted-foreground">Programados</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}