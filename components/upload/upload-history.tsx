"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Download, Eye, CheckCircle, AlertTriangle } from "lucide-react"

interface UploadRecord {
  id: string
  filename: string
  uploadDate: string
  status: "success" | "error" | "partial"
  totalRecords: number
  newRecords: number
  duplicates: number
  errors: number
  uploadedBy: string
}

export function UploadHistory() {
  const [history, setHistory] = useState<UploadRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchHistory() {
      try {
        const response = await fetch("/api/upload/history")
        const data = await response.json()
        setHistory(data)
      } catch (error) {
        console.error("Error fetching upload history:", error)
        // Mock data for development
        setHistory([
          {
            id: "1",
            filename: "inspecciones_enero_2024.xlsx",
            uploadDate: "2024-01-21T14:30:00Z",
            status: "success",
            totalRecords: 245,
            newRecords: 238,
            duplicates: 7,
            errors: 0,
            uploadedBy: "Admin",
          },
          {
            id: "2",
            filename: "inspecciones_diciembre_2023.xlsx",
            uploadDate: "2024-01-20T09:15:00Z",
            status: "partial",
            totalRecords: 189,
            newRecords: 175,
            duplicates: 12,
            errors: 2,
            uploadedBy: "Supervisor",
          },
          {
            id: "3",
            filename: "inspecciones_noviembre_2023.xlsx",
            uploadDate: "2024-01-19T16:45:00Z",
            status: "success",
            totalRecords: 203,
            newRecords: 203,
            duplicates: 0,
            errors: 0,
            uploadedBy: "Admin",
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Exitoso</Badge>
      case "partial":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Parcial</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "partial":
      case "error":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historial de Cargas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
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
          Historial de Cargas
          <Button variant="outline" size="sm">
            Ver Todo
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {history.map((record) => (
            <div key={record.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(record.status)}
                  <span className="font-medium text-sm truncate max-w-[200px]">{record.filename}</span>
                </div>
                {getStatusBadge(record.status)}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-2">
                <div>Total: {record.totalRecords}</div>
                <div>Nuevos: {record.newRecords}</div>
                <div>Duplicados: {record.duplicates}</div>
                <div>Errores: {record.errors}</div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="text-muted-foreground">
                  <span>{new Date(record.uploadDate).toLocaleDateString("es-ES")}</span>
                  <span className="mx-1">•</span>
                  <span>{record.uploadedBy}</span>
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Download className="h-3 w-3" />
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
