"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Play, Eye } from "lucide-react"

export function ReportGenerator() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [reportConfig, setReportConfig] = useState({
    title: "",
    type: "",
    format: "pdf",
    dateRange: null,
    includeCharts: true,
    includeDetails: true,
    groupBy: "date",
  })

  const handleGenerateReport = async () => {
    setIsGenerating(true)
    setProgress(0)

    // Simulate report generation progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          setIsGenerating(false)
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generador de Reportes Personalizado</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="report-title">Título del Reporte</Label>
            <Input
              id="report-title"
              placeholder="Ej: Reporte Mensual de Inspecciones"
              value={reportConfig.title}
              onChange={(e) => setReportConfig({ ...reportConfig, title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="report-type">Tipo de Reporte</Label>
            <Select
              value={reportConfig.type}
              onValueChange={(value) => setReportConfig({ ...reportConfig, type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inspections">Inspecciones</SelectItem>
                <SelectItem value="vehicles">Vehículos</SelectItem>
                <SelectItem value="drivers">Conductores</SelectItem>
                <SelectItem value="fatigue">Control de Fatiga</SelectItem>
                <SelectItem value="compliance">Cumplimiento</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Rango de Fechas</Label>
            <DatePickerWithRange />
          </div>

          <div className="space-y-2">
            <Label htmlFor="report-format">Formato de Salida</Label>
            <Select
              value={reportConfig.format}
              onValueChange={(value) => setReportConfig({ ...reportConfig, format: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="html">HTML</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <Label>Opciones de Contenido</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-charts"
                checked={reportConfig.includeCharts}
                onCheckedChange={(checked) => setReportConfig({ ...reportConfig, includeCharts: checked as boolean })}
              />
              <Label htmlFor="include-charts" className="text-sm">
                Incluir Gráficos
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-details"
                checked={reportConfig.includeDetails}
                onCheckedChange={(checked) => setReportConfig({ ...reportConfig, includeDetails: checked as boolean })}
              />
              <Label htmlFor="include-details" className="text-sm">
                Incluir Detalles
              </Label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="group-by">Agrupar Por</Label>
          <Select
            value={reportConfig.groupBy}
            onValueChange={(value) => setReportConfig({ ...reportConfig, groupBy: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Fecha</SelectItem>
              <SelectItem value="vehicle">Vehículo</SelectItem>
              <SelectItem value="driver">Conductor</SelectItem>
              <SelectItem value="status">Estado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descripción (Opcional)</Label>
          <Textarea id="description" placeholder="Descripción adicional del reporte..." rows={3} />
        </div>

        {isGenerating && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Generando reporte...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            El reporte se generará según la configuración seleccionada
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" disabled={isGenerating}>
              <Eye className="h-4 w-4 mr-2" />
              Vista Previa
            </Button>
            <Button onClick={handleGenerateReport} disabled={isGenerating || !reportConfig.title || !reportConfig.type}>
              {isGenerating ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              Generar Reporte
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
