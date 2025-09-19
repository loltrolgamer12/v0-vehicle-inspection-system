"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Clock, Shield, AlertTriangle, CheckCircle, XCircle, TrendingUp } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface FatigueRecord {
  id: string
  date: string
  hoursWorked: number
  restHours: number
  status: "normal" | "warning" | "critical"
  violations: string[]
  maxDailyHours: number
  maxWeeklyHours: number
  weeklyTotal: number
}

interface DriverFatigueHistoryProps {
  driverId: string
}

export function DriverFatigueHistory({ driverId }: DriverFatigueHistoryProps) {
  const [records, setRecords] = useState<FatigueRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<"week" | "month" | "quarter">("month")

  useEffect(() => {
    async function fetchFatigueHistory() {
      try {
        const response = await fetch(`/api/fatigue/drivers/${driverId}/history?range=${timeRange}`)
        const data = await response.json()
        setRecords(data)
      } catch (error) {
        console.error("Error fetching fatigue history:", error)
        // Mock data for development
        setRecords([
          {
            id: "1",
            date: "2024-01-21",
            hoursWorked: 8.5,
            restHours: 10,
            status: "normal",
            violations: [],
            maxDailyHours: 11,
            maxWeeklyHours: 56,
            weeklyTotal: 45
          },
          {
            id: "2",
            date: "2024-01-20",
            hoursWorked: 10.5,
            restHours: 8,
            status: "warning",
            violations: ["Cerca del límite diario"],
            maxDailyHours: 11,
            maxWeeklyHours: 56,
            weeklyTotal: 36.5
          },
          {
            id: "3",
            date: "2024-01-19",
            hoursWorked: 12,
            restHours: 6,
            status: "critical",
            violations: ["Exceso límite diario", "Descanso insuficiente"],
            maxDailyHours: 11,
            maxWeeklyHours: 56,
            weeklyTotal: 26
          },
          {
            id: "4",
            date: "2024-01-18",
            hoursWorked: 7,
            restHours: 12,
            status: "normal",
            violations: [],
            maxDailyHours: 11,
            maxWeeklyHours: 56,
            weeklyTotal: 14
          },
          {
            id: "5",
            date: "2024-01-17",
            hoursWorked: 7,
            restHours: 10,
            status: "normal",
            violations: [],
            maxDailyHours: 11,
            maxWeeklyHours: 56,
            weeklyTotal: 7
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchFatigueHistory()
  }, [driverId, timeRange])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "normal":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Normal</Badge>
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Advertencia</Badge>
      case "critical":
        return <Badge variant="destructive">Crítico</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "normal":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "critical":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  const chartData = records.slice().reverse().map(record => ({
    date: new Date(record.date).toLocaleDateString("es-ES", { month: "short", day: "numeric" }),
    hoursWorked: record.hoursWorked,
    restHours: record.restHours,
    weeklyTotal: record.weeklyTotal
  }))

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Historial de Fatiga
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="h-4 bg-muted rounded w-20" />
                  <div className="h-6 bg-muted rounded w-16" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded w-full" />
                  <div className="h-3 bg-muted rounded w-3/4" />
                </div>
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
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Historial de Fatiga
          </div>
          <div className="flex gap-1">
            <Button
              variant={timeRange === "week" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange("week")}
            >
              Semana
            </Button>
            <Button
              variant={timeRange === "month" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange("month")}
            >
              Mes
            </Button>
            <Button
              variant={timeRange === "quarter" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange("quarter")}
            >
              3 Meses
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  value,
                  name === "hoursWorked" ? "Horas Trabajadas" : 
                  name === "restHours" ? "Horas Descanso" : "Total Semanal"
                ]}
              />
              <Line 
                type="monotone" 
                dataKey="hoursWorked" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="hoursWorked"
              />
              <Line 
                type="monotone" 
                dataKey="restHours" 
                stroke="#10b981" 
                strokeWidth={2}
                name="restHours"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Records List */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Registros Recientes
          </h4>
          {records.map((record) => (
            <div
              key={record.id}
              className={`p-3 border rounded-lg ${
                record.status === "critical"
                  ? "border-red-200 bg-red-50"
                  : record.status === "warning"
                    ? "border-yellow-200 bg-yellow-50"
                    : "border-green-200 bg-green-50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(record.status)}
                  <span className="font-medium text-sm">
                    {new Date(record.date).toLocaleDateString("es-ES", {
                      weekday: "long",
                      month: "short",
                      day: "numeric"
                    })}
                  </span>
                </div>
                {getStatusBadge(record.status)}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Horas Trabajadas
                    </span>
                    <span className="font-medium">
                      {record.hoursWorked}h / {record.maxDailyHours}h
                    </span>
                  </div>
                  <Progress
                    value={(record.hoursWorked / record.maxDailyHours) * 100}
                    className="h-1.5"
                    indicatorClassName={
                      record.hoursWorked > record.maxDailyHours
                        ? "bg-red-500"
                        : record.hoursWorked > record.maxDailyHours * 0.9
                          ? "bg-yellow-500"
                          : "bg-green-500"
                    }
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      Descanso
                    </span>
                    <span className="font-medium">{record.restHours}h</span>
                  </div>
                  <Progress
                    value={(record.restHours / 11) * 100}
                    className="h-1.5"
                    indicatorClassName={
                      record.restHours >= 9 ? "bg-green-500" : "bg-red-500"
                    }
                  />
                </div>
              </div>

              {record.violations.length > 0 && (
                <div className="space-y-1">
                  <span className="text-xs font-medium text-muted-foreground">Violaciones:</span>
                  {record.violations.map((violation, index) => (
                    <div key={index} className="text-xs text-red-600 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      {violation}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <Button variant="outline" className="w-full">
          Ver Historial Completo
        </Button>
      </CardContent>
    </Card>
  )
}