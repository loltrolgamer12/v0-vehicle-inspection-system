"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, CheckCircle, AlertTriangle, Upload, Database } from "lucide-react"

interface UploadStats {
  totalUploads: number
  successfulUploads: number
  duplicatesDetected: number
  recordsProcessed: number
  lastUpload: string
}

export function UploadStats() {
  const [stats, setStats] = useState<UploadStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/upload/stats")
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error("Error fetching upload stats:", error)
        // Mock data for development
        setStats({
          totalUploads: 156,
          successfulUploads: 148,
          duplicatesDetected: 23,
          recordsProcessed: 4567,
          lastUpload: "2024-01-21T14:30:00Z",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded w-3/4 mb-2" />
              <div className="h-8 bg-muted rounded w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) return null

  const statCards = [
    {
      title: "Total Cargas",
      value: stats.totalUploads,
      icon: Upload,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Cargas Exitosas",
      value: stats.successfulUploads,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Duplicados Detectados",
      value: stats.duplicatesDetected,
      icon: AlertTriangle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Registros Procesados",
      value: stats.recordsProcessed.toLocaleString(),
      icon: Database,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Última Carga",
      value: new Date(stats.lastUpload).toLocaleDateString("es-ES"),
      icon: FileText,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {statCards.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
