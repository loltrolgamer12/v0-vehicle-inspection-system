"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Eye, Trash2, CheckCircle } from "lucide-react"

interface DuplicateRecord {
  id: string
  vehicleId: string
  driverName: string
  inspectionDate: string
  hash: string
  existingRecordDate: string
  similarity: number
}

export function DuplicatePreview() {
  const [duplicates, setDuplicates] = useState<DuplicateRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDuplicates() {
      try {
        const response = await fetch("/api/upload/duplicates")
        const data = await response.json()
        setDuplicates(data)
      } catch (error) {
        console.error("Error fetching duplicates:", error)
        // Mock data for development
        setDuplicates([
          {
            id: "1",
            vehicleId: "VH-001",
            driverName: "Juan Pérez",
            inspectionDate: "2024-01-21T08:30:00Z",
            hash: "abc123def456",
            existingRecordDate: "2024-01-21T08:30:00Z",
            similarity: 100,
          },
          {
            id: "2",
            vehicleId: "VH-002",
            driverName: "María González",
            inspectionDate: "2024-01-20T14:15:00Z",
            hash: "def456ghi789",
            existingRecordDate: "2024-01-20T14:10:00Z",
            similarity: 95,
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchDuplicates()
  }, [])

  const handleIgnoreDuplicate = (id: string) => {
    setDuplicates((prev) => prev.filter((d) => d.id !== id))
  }

  const handleAcceptDuplicate = (id: string) => {
    // In a real implementation, this would call an API to accept the duplicate
    setDuplicates((prev) => prev.filter((d) => d.id !== id))
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Duplicados Detectados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-3 border rounded-lg">
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (duplicates.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Duplicados Detectados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No se detectaron duplicados en la última carga</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Duplicados Detectados
          <Badge variant="outline" className="text-xs">
            {duplicates.length} encontrado{duplicates.length !== 1 ? "s" : ""}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {duplicates.map((duplicate) => (
            <div key={duplicate.id} className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <div>
                    <p className="font-medium text-sm">
                      {duplicate.vehicleId} • {duplicate.driverName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Similitud: {duplicate.similarity}% con registro existente
                    </p>
                  </div>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 text-xs">Duplicado</Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs mb-3">
                <div>
                  <p className="text-muted-foreground">Nuevo Registro</p>
                  <p className="font-medium">{new Date(duplicate.inspectionDate).toLocaleString("es-ES")}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Registro Existente</p>
                  <p className="font-medium">{new Date(duplicate.existingRecordDate).toLocaleString("es-ES")}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground font-mono">Hash: {duplicate.hash.substring(0, 12)}...</p>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs bg-transparent"
                    onClick={() => handleIgnoreDuplicate(duplicate.id)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Ver Detalles
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs bg-transparent"
                    onClick={() => handleIgnoreDuplicate(duplicate.id)}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Ignorar
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => handleAcceptDuplicate(duplicate.id)}
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Aceptar
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
