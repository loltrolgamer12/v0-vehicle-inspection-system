"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

interface ChartData {
  daily: Array<{
    date: string
    approved: number
    rejected: number
    pending: number
  }>
  status: Array<{
    name: string
    value: number
    color: string
  }>
}

export function InspectionChart() {
  const [data, setData] = useState<ChartData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchChartData() {
      try {
        const response = await fetch("/api/dashboard/charts")
        const chartData = await response.json()
        setData(chartData)
      } catch (error) {
        console.error("Error fetching chart data:", error)
        // Mock data for development
        setData({
          daily: [
            { date: "2024-01-15", approved: 45, rejected: 8, pending: 12 },
            { date: "2024-01-16", approved: 52, rejected: 6, pending: 15 },
            { date: "2024-01-17", approved: 38, rejected: 12, pending: 8 },
            { date: "2024-01-18", approved: 61, rejected: 4, pending: 18 },
            { date: "2024-01-19", approved: 48, rejected: 9, pending: 14 },
            { date: "2024-01-20", approved: 55, rejected: 7, pending: 11 },
            { date: "2024-01-21", approved: 42, rejected: 11, pending: 16 },
          ],
          status: [
            { name: "Aprobadas", value: 341, color: "#22c55e" },
            { name: "Rechazadas", value: 57, color: "#ef4444" },
            { name: "Pendientes", value: 94, color: "#f59e0b" },
          ],
        })
      } finally {
        setLoading(false)
      }
    }

    fetchChartData()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Análisis de Inspecciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse bg-muted h-80 rounded" />
        </CardContent>
      </Card>
    )
  }

  if (!data) return null

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Inspecciones por Día
            <Badge variant="outline">Últimos 7 días</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
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
              <Tooltip labelFormatter={(value) => new Date(value).toLocaleDateString("es-ES")} />
              <Bar dataKey="approved" stackId="a" fill="#22c55e" name="Aprobadas" />
              <Bar dataKey="rejected" stackId="a" fill="#ef4444" name="Rechazadas" />
              <Bar dataKey="pending" stackId="a" fill="#f59e0b" name="Pendientes" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Distribución de Estados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <ResponsiveContainer width="60%" height={200}>
              <PieChart>
                <Pie
                  data={data.status}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.status.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="space-y-2">
              {data.status.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm font-medium">{item.name}</span>
                  <span className="text-sm text-muted-foreground">({item.value})</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
