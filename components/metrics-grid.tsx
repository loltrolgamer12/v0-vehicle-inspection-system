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
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchMetrics() {
      try {
        setLoading(true)
        setError(false)
        const response = await fetch("/api/dashboard/metrics")
        if (!response.ok) throw new Error('Failed to fetch')
        const data = await response.json()
        setMetrics(data)
      } catch (error) {
        console.error("Error fetching metrics:", error)
        setError(true)
        // Set empty metrics to prevent crashes
        setMetrics({
          totalVehicles: 0,
          totalDrivers: 0,
          todayInspections: 0,
          pendingInspections: 0,
          criticalAlerts: 0,
          approvedInspections: 0,
          rejectedInspections: 0,
          fatigueAlerts: 0,
          weeklyTrend: 0,
          complianceRate: 0
        })
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

  if (error || !metrics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="col-span-full">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No se pudieron cargar las métricas</p>
          </CardContent>
        </Card>
      </div>
    )
  }

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
      badge: metrics.fatigueAlerts > 5 ? "Alto" : metrics.fatigueAlerts > 0 ? "Monitor" : null,
    },
    {
      title: "Cumplimiento",
      value: `${metrics.complianceRate}%`,
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      badge: metrics.complianceRate > 90 ? "Excelente" : null,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metricCards.map((metric, index) => {
        const Icon = metric.icon
        return (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                <Icon className={`h-4 w-4 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {metric.value}
              </div>
              {metric.badge && (
                <Badge variant="secondary" className="mt-2 text-xs">
                  {metric.badge}
                </Badge>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}