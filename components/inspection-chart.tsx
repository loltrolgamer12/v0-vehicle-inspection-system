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
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchChartData() {
      try {
        setLoading(true)
        setError(false)
        const response = await fetch("/api/dashboard/charts")
        if (!response.ok) throw new Error('Failed to fetch')
        const chartData = await response.json()
        setData(chartData)
      } catch (error) {
        console.error("Error fetching chart data:", error)
        setError(true)
        // Set empty data structure
        setData({
          daily: [],
          status: []
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
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-muted rounded w-1/3" />
            <div className="h-64 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !data) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No se pudieron cargar los gráficos</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Daily Inspections Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Inspecciones Diarias</CardTitle>
          <p className="text-sm text-muted-foreground">Últimos 7 días</p>
        </CardHeader>
        <CardContent>
          {data.daily.length === 0 ? (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No hay datos disponibles
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.daily}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => new Date(date).toLocaleDateString('es', { month: 'short', day: 'numeric' })}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="approved" fill="#10b981" name="Aprobadas" />
                <Bar dataKey="rejected" fill="#ef4444" name="Rechazadas" />
                <Bar dataKey="pending" fill="#f59e0b" name="Pendientes" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Status Distribution Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Distribución de Estados</CardTitle>
          <p className="text-sm text-muted-foreground">Estado actual de inspecciones</p>
        </CardHeader>
        <CardContent>
          {data.status.length === 0 ? (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No hay datos disponibles
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.status}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(props: any) => {
                      const { name, percent } = props;
                      return `${name} ${(percent * 100).toFixed(0)}%`;
                    }}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {data.status.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center space-x-4 mt-4">
                {data.status.map((item, index) => (
                  <Badge key={index} variant="outline" style={{ borderColor: item.color }}>
                    <div 
                      className="w-2 h-2 rounded-full mr-2" 
                      style={{ backgroundColor: item.color }}
                    />
                    {item.name}: {item.value}
                  </Badge>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}