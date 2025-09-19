"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Car, User, FileText, Calendar, Eye, Download, Search } from "lucide-react"

interface SearchResult {
  id: string
  type: "inspection" | "vehicle" | "driver"
  title: string
  subtitle: string
  description: string
  date: string
  status: string
  relevance: number
  metadata: Record<string, any>
}

export function SearchResults() {
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState("relevance")
  const [filterType, setFilterType] = useState("all")

  useEffect(() => {
    // Mock search results
    setResults([
      {
        id: "1",
        type: "inspection",
        title: "Inspección VH-001 - Juan Pérez",
        subtitle: "21 de Enero, 2024",
        description: "Inspección diaria completada con 2 elementos rechazados en sistema de frenos",
        date: "2024-01-21T08:30:00Z",
        status: "rejected",
        relevance: 95,
        metadata: { vehicleId: "VH-001", driverName: "Juan Pérez", criticalIssues: 2 },
      },
      {
        id: "2",
        type: "vehicle",
        title: "Mercedes-Benz Actros VH-001",
        subtitle: "Camión • 2022",
        description: "Vehículo con historial de 156 inspecciones, última inspección rechazada",
        date: "2024-01-21T08:30:00Z",
        status: "critical",
        relevance: 88,
        metadata: { brand: "Mercedes-Benz", model: "Actros", year: 2022 },
      },
      {
        id: "3",
        type: "driver",
        title: "Juan Pérez",
        subtitle: "Licencia A2 • 8 años experiencia",
        description: "Conductor activo con 89% de cumplimiento en inspecciones",
        date: "2024-01-21T08:30:00Z",
        status: "active",
        relevance: 82,
        metadata: { licenseType: "A2", experienceYears: 8, complianceRate: 89 },
      },
    ])
  }, [])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "inspection":
        return <FileText className="h-4 w-4" />
      case "vehicle":
        return <Car className="h-4 w-4" />
      case "driver":
        return <User className="h-4 w-4" />
      default:
        return <Search className="h-4 w-4" />
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "inspection":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Inspección</Badge>
      case "vehicle":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Vehículo</Badge>
      case "driver":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Conductor</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Aprobado</Badge>
      case "rejected":
        return <Badge variant="destructive">Rechazado</Badge>
      case "critical":
        return <Badge variant="destructive">Crítico</Badge>
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Activo</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const filteredResults = results.filter((result) => filterType === "all" || result.type === filterType)

  const sortedResults = [...filteredResults].sort((a, b) => {
    switch (sortBy) {
      case "relevance":
        return b.relevance - a.relevance
      case "date":
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      case "title":
        return a.title.localeCompare(b.title)
      default:
        return 0
    }
  })

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Resultados de Búsqueda</span>
              <Badge variant="outline">{filteredResults.length} encontrados</Badge>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="inspection">Inspecciones</SelectItem>
                  <SelectItem value="vehicle">Vehículos</SelectItem>
                  <SelectItem value="driver">Conductores</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevancia</SelectItem>
                  <SelectItem value="date">Fecha</SelectItem>
                  <SelectItem value="title">Título</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="h-4 w-4 bg-muted rounded" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-1/2" />
                      <div className="h-3 bg-muted rounded w-3/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : sortedResults.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No se encontraron resultados</p>
              <p className="text-sm">Intenta con diferentes términos de búsqueda</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedResults.map((result) => (
                <div key={result.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-muted rounded-lg">{getTypeIcon(result.type)}</div>
                      <div>
                        <h3 className="font-medium">{result.title}</h3>
                        <p className="text-sm text-muted-foreground">{result.subtitle}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getTypeBadge(result.type)}
                      {getStatusBadge(result.status)}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">{result.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(result.date).toLocaleDateString("es-ES")}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>Relevancia: {result.relevance}%</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">
                        <Eye className="h-3 w-3 mr-1" />
                        Ver
                      </Button>
                      <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">
                        <Download className="h-3 w-3 mr-1" />
                        Exportar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
