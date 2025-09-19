"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, BarChart3, TrendingUp, Shield, Car, Users, Calendar } from "lucide-react"

const reportTemplates = [
  {
    id: "inspection-summary",
    title: "Resumen de Inspecciones",
    description: "Reporte general de inspecciones por período",
    icon: FileText,
    category: "General",
    frequency: "Diario/Semanal/Mensual",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    id: "vehicle-status",
    title: "Estado de Vehículos",
    description: "Análisis del estado actual de la flota",
    icon: Car,
    category: "Vehículos",
    frequency: "Tiempo Real",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    id: "driver-performance",
    title: "Rendimiento de Conductores",
    description: "Métricas de desempeño y cumplimiento",
    icon: Users,
    category: "Conductores",
    frequency: "Semanal/Mensual",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    id: "fatigue-compliance",
    title: "Cumplimiento de Fatiga",
    description: "Reporte de control de horas y descanso",
    icon: Shield,
    category: "Fatiga",
    frequency: "Diario",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    id: "trend-analysis",
    title: "Análisis de Tendencias",
    description: "Tendencias históricas y proyecciones",
    icon: TrendingUp,
    category: "Análisis",
    frequency: "Mensual",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
  },
  {
    id: "compliance-dashboard",
    title: "Dashboard de Cumplimiento",
    description: "Métricas de cumplimiento regulatorio",
    icon: BarChart3,
    category: "Cumplimiento",
    frequency: "Tiempo Real",
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
]

export function ReportTemplates() {
  const handleGenerateReport = (templateId: string) => {
    console.log(`Generating report: ${templateId}`)
    // In a real implementation, this would trigger report generation
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Plantillas de Reportes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTemplates.map((template) => (
            <div key={template.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${template.bgColor}`}>
                  <template.icon className={`h-5 w-5 ${template.color}`} />
                </div>
                <Badge variant="outline" className="text-xs">
                  {template.category}
                </Badge>
              </div>

              <h3 className="font-medium text-sm mb-2">{template.title}</h3>
              <p className="text-xs text-muted-foreground mb-3">{template.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  {template.frequency}
                </div>
                <Button size="sm" onClick={() => handleGenerateReport(template.id)} className="h-7 text-xs">
                  Generar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
