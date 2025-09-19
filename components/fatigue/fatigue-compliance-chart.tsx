"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"

interface ComplianceData {
  daily: Array<{
    date: string
    compliant: number
    violations: number
    totalDrivers: number
  }>
  weekly: Array<{
    week: string
    complianceRate: number
    avgHours: number
  }>
}

export function FatigueComplianceChart() {
  const [data, setData] = useState<ComplianceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<"daily" | "weekly">("daily")

  useEffect(() => {
    async function fetchComplianceData() {
      try {
        const response = await fetch("/api/fatigue/compliance")
        const chartData = await response.json()
        setData(chartData)
      } catch (error) {
        console.error("Error fetching compliance data:", error)
        // Mock data for development
        setData({
          daily: [
            { date: "2024-01-15", compliant: 26, violations: 2, totalDrivers: 28 },
            { date: "2024-01-16", compliant: 25, violations: 3, totalDrivers: 28 },
            { date: "2024-01-17", compliant: 27, violations: 1, totalDrivers: 28 },
            { date: "2024-01-18", compliant: 24, violations: 4, totalDrivers: 28 },
            { date: "2024-01-19", compliant: 26, violations: 2, totalDrivers: 28 },
            { date: "2024-01-20", compliant: 25, violations: 3, totalDrivers: 28 },
            { date: "2024-01-21", compliant: 25, violations: 3, totalDrivers: 28 },
          ],
          weekly: [
            { week: "Sem 1", complianceRate: 92.8, avgHours: 7.2 },
            { week: "Sem 2", complianceRate: 89.3, avgHours: 7.8 },
            { week: "Sem 3", complianceRate: 94.6, avgHours: 6.9 },
            { week: "Sem 4", complianceRate: 87.5, avgHours: 8.1 },
          ],
        })
      } finally {
        setLoading(false)
      }
    }

    fetchComplianceData()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Análisis de Cumplimiento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse bg-muted h-80 rounded" />
        </CardContent>
      </Card>
    )
  }

  if (!data) return null

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Análisis de Cumplimiento</CardTitle>
          <div className="flex space-x-2">
            <Badge
              variant={view === "daily" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setView("daily")}
            >
              Diario
            </Badge>
            <Badge
              variant={view === "weekly" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setView("weekly")}
            >
              Semanal
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {view === "daily" ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.daily}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("es-ES", {
                    month: "short",
                    day: "numeric",
                  })
                }
              />
              <YAxis />
              <Tooltip
                labelFormatter={(value) => new Date(value).toLocaleDateString("es-ES")}
                formatter={(value, name) => [value, name === "compliant" ? "Cumplimiento" : "Violaciones"]}
              />
              <Bar dataKey="compliant" stackId="a" fill="#22c55e" name="Cumplimiento" />
              <Bar dataKey="violations" stackId="a" fill="#ef4444" name="Violaciones" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.weekly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="complianceRate"
                stroke="#3b82f6"
                strokeWidth={2}
                name="% Cumplimiento"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="avgHours"
                stroke="#f59e0b"
                strokeWidth={2}
                name="Promedio Horas"
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <p className="text-muted-foreground">Cumplimiento Promedio</p>
            <p className="text-lg font-semibold text-green-600">89.3%</p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground">Violaciones Esta Semana</p>
            <p className="text-lg font-semibold text-red-600">12</p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground">Promedio Horas/Día</p>
            <p className="text-lg font-semibold text-blue-600">7.2h</p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground">Conductores Monitoreados</p>
            <p className="text-lg font-semibold text-purple-600">28</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
