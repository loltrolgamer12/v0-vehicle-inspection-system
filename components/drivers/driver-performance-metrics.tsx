"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  Shield, 
  AlertTriangle,
  Star,
  Calendar
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

interface PerformanceMetrics {
  overallScore: number
  inspectionSuccessRate: number
  fatigueCompliance: number
  totalInspections: number
  approvedInspections: number
  rejectedInspections: number
  pendingInspections: number
  averageInspectionTime: number
  fatigueViolations: number
  consecutiveDaysCompliant: number
  monthlyTrend: Array<{
    month: string
    score: number
    inspections: number
  }>
  recentActivity: Array<{
    date: string
    activity: string
    status: "success" | "warning" | "error"
  }>
}

interface DriverPerformanceMetricsProps {
  driverId: string
}

export function DriverPerformanceMetrics({ driverId }: DriverPerformanceMetricsProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPerformanceMetrics() {
      try {
        const response = await fetch(`/api/drivers/${driverId}/performance`)
        const data = await response.json()
        setMetrics(data)
      } catch (error) {
        console.error("Error fetching performance metrics:", error)
        // Mock data for development
        setMetrics({
          overallScore: 87,
          inspectionSuccessRate: 92,
          fatigueCompliance: 88,
          totalInspections: 45,
          approvedInspections: 41,
          rejectedInspections: 3,
          pendingInspections: 1,
          averageInspectionTime: 28,
          fatigueViolations: 2,
          consecutiveDaysCompliant: 12,
          monthlyTrend: [
            { month: "Oct", score: 82, inspections: 15 },
            { month: "Nov", score: 85, inspections: 18 },
            { month: "Dic", score: 87, inspections: 12 }
          ],
          recentActivity: [
            { date: "2024-01-21", activity: "Inspección aprobada - SAS-001", status: "success" },
            { date: "2024-01-20", activity: "Violación menor de fatiga", status: "warning" },
            { date: "2024-01-19", activity: "Inspección aprobada - SAS-002", status: "success" },
            { date: "2024-01-18", activity: "Mantenimiento completado", status: "success" }
          ]
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPerformanceMetrics()
  }, [driverId])

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 75) return "text-yellow-600"
    return "text-red-600"
  }

  const getPerformanceBadge = (score: number) => {
    if (score >= 90) return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Excelente</Badge>
    if (score >= 75) return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Bueno</Badge>
    return <Badge variant="destructive">Necesita Mejora</Badge>
  }

  const getActivityIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Métricas de Rendimiento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-2 bg-muted rounded w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!metrics) return null

  const pieData = [
    { name: "Aprobadas", value: metrics.approvedInspections, color: "#10b981" },
    { name: "Rechazadas", value: metrics.rejectedInspections, color: "#ef4444" },
    { name: "Pendientes", value: metrics.pendingInspections, color: "#f59e0b" }
  ]

  return (
    <div className="space-y-6">
      {/* Overall Performance Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Puntuación General
            {getPerformanceBadge(metrics.overallScore)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                <div className={`text-2xl font-bold ${getPerformanceColor(metrics.overallScore)}`}>
                  {metrics.overallScore}
                </div>
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-gray-200">
                <div 
                  className={`absolute inset-0 rounded-full border-4 border-transparent ${
                    metrics.overallScore >= 90 ? "border-t-green-500 border-r-green-500" :
                    metrics.overallScore >= 75 ? "border-t-yellow-500 border-r-yellow-500" :
                    "border-t-red-500 border-r-red-500"
                  }`}
                  style={{
                    transform: `rotate(${(metrics.overallScore / 100) * 360}deg)`
                  }}
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-green-600">{metrics.consecutiveDaysCompliant}</div>
              <div className="text-xs text-muted-foreground">Días consecutivos sin infracciones</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-blue-600">{metrics.totalInspections}</div>
              <div className="text-xs text-muted-foreground">Total inspecciones</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Métricas Clave</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                Tasa de Éxito en Inspecciones
              </span>
              <span className="font-medium">{metrics.inspectionSuccessRate}%</span>
            </div>
            <Progress
              value={metrics.inspectionSuccessRate}
              className="h-2"
              indicatorClassName="bg-green-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="flex items-center">
                <Shield className="h-4 w-4 mr-2 text-blue-600" />
                Cumplimiento de Fatiga
              </span>
              <span className="font-medium">{metrics.fatigueCompliance}%</span>
            </div>
            <Progress
              value={metrics.fatigueCompliance}
              className="h-2"
              indicatorClassName={metrics.fatigueCompliance >= 90 ? "bg-green-500" : metrics.fatigueCompliance >= 75 ? "bg-yellow-500" : "bg-red-500"}
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-purple-600" />
                Tiempo Promedio de Inspección
              </span>
              <span className="font-medium">{metrics.averageInspectionTime} min</span>
            </div>
            <Progress
              value={Math.max(0, 100 - (metrics.averageInspectionTime / 60) * 100)}
              className="h-2"
              indicatorClassName="bg-purple-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Inspection Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Distribución de Inspecciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-4">
            {pieData.map((item, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
                <div className="text-xs text-muted-foreground">{item.name}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {metrics.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50">
                {getActivityIcon(activity.status)}
                <div className="flex-1">
                  <div className="text-sm font-medium">{activity.activity}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(activity.date).toLocaleDateString("es-ES")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Tendencia de Rendimiento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}