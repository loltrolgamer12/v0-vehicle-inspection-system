"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Car, Users, AlertTriangle, CheckCircle, Clock, TrendingUp, FileText, Shield } from "lucide-react"

interface DashboardMetrics {
  totalVehicles: number
  totalDrivers: number
  todayInspections: number
  pendingInspections: number
  criticalAlerts: number
  approvedInspections: number
  rejectedInspections: number
  fatigueAlerts: number
  weeklyTrend: number
  complianceRate: number
}

export function MetricsGrid() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const response = await fetch("/api/dashboard/metrics")
        const data = await response.json()
        setMetrics(data)
      } catch (error) {
        console.error("Error fetching metrics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
    // Refresh every 30 seconds
    const interval = setInterval(fetchMetrics, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
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

  if (!metrics) return null

  const metricCards = [
    {
      title: "Vehículos Totales",
      value: metrics.totalVehicles,
      icon: Car,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Conductores Activos",
      value: metrics.totalDrivers,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Inspecciones Hoy",
      value: metrics.todayInspections,
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Pendientes",
      value: metrics.pendingInspections,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Alertas Críticas",
      value: metrics.criticalAlerts,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      badge: metrics.criticalAlerts > 0 ? "Urgente" : null,
    },
    {
      title: "Aprobadas",
      value: metrics.approvedInspections,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Control Fatiga",
      value: metrics.fatigueAlerts,
      icon: Shield,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      badge: metrics.fatigueAlerts > 5 ? "Atención" : null,
    },
    {
      title: "Cumplimiento",
      value: `${metrics.complianceRate}%`,
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      trend: metrics.weeklyTrend,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metricCards.map((metric, index) => (
        <Card key={index} className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{metric.title}</CardTitle>
            <div className={`p-2 rounded-lg ${metric.bgColor}`}>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{metric.value}</div>
              {metric.badge && (
                <Badge variant="destructive" className="text-xs">
                  {metric.badge}
                </Badge>
              )}
              {metric.trend !== undefined && (
                <div className={`flex items-center text-xs ${metric.trend >= 0 ? "text-green-600" : "text-red-600"}`}>
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {metric.trend >= 0 ? "+" : ""}
                  {metric.trend}%
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
