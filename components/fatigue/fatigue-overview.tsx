"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Clock, AlertTriangle, CheckCircle, Users, TrendingUp } from "lucide-react"

interface FatigueOverview {
  totalDrivers: number
  driversOnDuty: number
  normalStatus: number
  warningStatus: number
  criticalStatus: number
  avgHoursToday: number
  complianceRate: number
  weeklyTrend: number
}

export function FatigueOverview() {
  const [overview, setOverview] = useState<FatigueOverview | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOverview() {
      try {
        const response = await fetch("/api/fatigue/overview")
        const data = await response.json()
        setOverview(data)
      } catch (error) {
        console.error("Error fetching fatigue overview:", error)
        // Mock data for development
        setOverview({
          totalDrivers: 28,
          driversOnDuty: 18,
          normalStatus: 25,
          warningStatus: 2,
          criticalStatus: 1,
          avgHoursToday: 7.2,
          complianceRate: 89.3,
          weeklyTrend: 2.1,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchOverview()
    // Refresh every 30 seconds
    const interval = setInterval(fetchOverview, 30000)
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

  if (!overview) return null

  const overviewCards = [
    {
      title: "Conductores Totales",
      value: overview.totalDrivers,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "En Servicio",
      value: overview.driversOnDuty,
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Estado Normal",
      value: overview.normalStatus,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Advertencias",
      value: overview.warningStatus,
      icon: AlertTriangle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      badge: overview.warningStatus > 0 ? "Atención" : null,
    },
    {
      title: "Estado Crítico",
      value: overview.criticalStatus,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      badge: overview.criticalStatus > 0 ? "Urgente" : null,
    },
    {
      title: "Promedio Horas Hoy",
      value: `${overview.avgHoursToday}h`,
      icon: Clock,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      title: "Cumplimiento",
      value: `${overview.complianceRate}%`,
      icon: Shield,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      trend: overview.weeklyTrend,
    },
    {
      title: "Tendencia Semanal",
      value: `${overview.weeklyTrend >= 0 ? "+" : ""}${overview.weeklyTrend}%`,
      icon: TrendingUp,
      color: overview.weeklyTrend >= 0 ? "text-green-600" : "text-red-600",
      bgColor: overview.weeklyTrend >= 0 ? "bg-green-50" : "bg-red-50",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {overviewCards.map((card, index) => (
        <Card key={index} className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
            <div className={`p-2 rounded-lg ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{card.value}</div>
              {card.badge && (
                <Badge variant={card.badge === "Urgente" ? "destructive" : "secondary"} className="text-xs">
                  {card.badge}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
