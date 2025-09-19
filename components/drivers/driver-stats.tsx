"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, CheckCircle, AlertTriangle, Shield, Clock } from "lucide-react"

interface DriverStats {
  total: number
  active: number
  fatigueAlerts: number
  onDuty: number
  avgHoursPerDay: number
}

export function DriverStats() {
  const [stats, setStats] = useState<DriverStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/drivers/stats")
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error("Error fetching driver stats:", error)
        // Mock data for development
        setStats({
          total: 28,
          active: 24,
          fatigueAlerts: 3,
          onDuty: 18,
          avgHoursPerDay: 8.5,
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
      title: "Total Conductores",
      value: stats.total,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Activos",
      value: stats.active,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "En Servicio",
      value: stats.onDuty,
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Alertas Fatiga",
      value: stats.fatigueAlerts,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Promedio Horas/Día",
      value: `${stats.avgHoursPerDay}h`,
      icon: Shield,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
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
