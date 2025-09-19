"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, 
  Filter, 
  FileText, 
  Car, 
  Users, 
  Shield, 
  BarChart3, 
  X,
  RotateCcw
} from "lucide-react"

interface FilterState {
  dateRange: any
  reportType: string[]
  status: string[]
  category: string[]
  format: string
  frequency: string
}

export function ReportFilters() {
  const [filters, setFilters] = useState<FilterState>({
    dateRange: null,
    reportType: [],
    status: [],
    category: [],
    format: "all",
    frequency: "all"
  })

  const reportTypes = [
    { id: "inspections", label: "Inspecciones", icon: FileText },
    { id: "vehicles", label: "Vehículos", icon: Car },
    { id: "drivers", label: "Conductores", icon: Users },
    { id: "fatigue", label: "Control de Fatiga", icon: Shield },
    { id: "compliance", label: "Cumplimiento", icon: BarChart3 }
  ]

  const statusOptions = [
    { id: "completed", label: "Completados", color: "bg-green-100 text-green-800" },
    { id: "processing", label: "En Proceso", color: "bg-yellow-100 text-yellow-800" },
    { id: "failed", label: "Fallidos", color: "bg-red-100 text-red-800" },
    { id: "scheduled", label: "Programados", color: "bg-blue-100 text-blue-800" }
  ]

  const categories = [
    { id: "general", label: "General" },
    { id: "safety", label: "Seguridad" },
    { id: "maintenance", label: "Mantenimiento" },
    { id: "regulatory", label: "Regulatorio" },
    { id: "performance", label: "Rendimiento" }
  ]

  const handleReportTypeChange = (typeId: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      reportType: checked 
        ? [...prev.reportType, typeId]
        : prev.reportType.filter(id => id !== typeId)
    }))
  }

  const handleStatusChange = (statusId: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      status: checked 
        ? [...prev.status, statusId]
        : prev.status.filter(id => id !== statusId)
    }))
  }

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      category: checked 
        ? [...prev.category, categoryId]
        : prev.category.filter(id => id !== categoryId)
    }))
  }

  const clearFilters = () => {
    setFilters({
      dateRange: null,
      reportType: [],
      status: [],
      category: [],
      format: "all",
      frequency: "all"
    })
  }

  const getActiveFiltersCount = () => {
    return filters.reportType.length + 
           filters.status.length + 
           filters.category.length +
           (filters.format !== "all" ? 1 : 0) +
           (filters.frequency !== "all" ? 1 : 0) +
           (filters.dateRange ? 1 : 0)
  }

  const activeFiltersCount = getActiveFiltersCount()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filtros
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </div>
          {activeFiltersCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="h-8 px-2"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Date Range */}
        <div className="space-y-2">
          <Label className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Rango de Fechas
          </Label>
          <DatePickerWithRange 
            date={filters.dateRange}
            setDate={(dateRange) => setFilters(prev => ({ ...prev, dateRange }))}
          />
        </div>

        {/* Report Type */}
        <div className="space-y-3">
          <Label>Tipo de Reporte</Label>
          <div className="space-y-2">
            {reportTypes.map((type) => (
              <div key={type.id} className="flex items-center space-x-2">
                <Checkbox
                  id={type.id}
                  checked={filters.reportType.includes(type.id)}
                  onCheckedChange={(checked) => handleReportTypeChange(type.id, checked as boolean)}
                />
                <label 
                  htmlFor={type.id} 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center cursor-pointer"
                >
                  <type.icon className="h-4 w-4 mr-2 text-muted-foreground" />
                  {type.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="space-y-3">
          <Label>Estado</Label>
          <div className="space-y-2">
            {statusOptions.map((status) => (
              <div key={status.id} className="flex items-center space-x-2">
                <Checkbox
                  id={status.id}
                  checked={filters.status.includes(status.id)}
                  onCheckedChange={(checked) => handleStatusChange(status.id, checked as boolean)}
                />
                <label 
                  htmlFor={status.id} 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center cursor-pointer"
                >
                  <div className={`w-2 h-2 rounded-full mr-2 ${status.color.split(' ')[0]}`} />
                  {status.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Category */}
        <div className="space-y-3">
          <Label>Categoría</Label>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={category.id}
                  checked={filters.category.includes(category.id)}
                  onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
                />
                <label 
                  htmlFor={category.id} 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {category.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Format */}
        <div className="space-y-2">
          <Label>Formato</Label>
          <Select 
            value={filters.format} 
            onValueChange={(value) => setFilters(prev => ({ ...prev, format: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los formatos</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="excel">Excel</SelectItem>
              <SelectItem value="csv">CSV</SelectItem>
              <SelectItem value="word">Word</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Frequency */}
        <div className="space-y-2">
          <Label>Frecuencia</Label>
          <Select 
            value={filters.frequency} 
            onValueChange={(value) => setFilters(prev => ({ ...prev, frequency: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las frecuencias</SelectItem>
              <SelectItem value="daily">Diario</SelectItem>
              <SelectItem value="weekly">Semanal</SelectItem>
              <SelectItem value="monthly">Mensual</SelectItem>
              <SelectItem value="quarterly">Trimestral</SelectItem>
              <SelectItem value="yearly">Anual</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters Summary */}
        {activeFiltersCount > 0 && (
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs text-muted-foreground">FILTROS ACTIVOS</Label>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters}
                className="h-6 px-2 text-xs"
              >
                Limpiar todo
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {filters.reportType.map(typeId => {
                const type = reportTypes.find(t => t.id === typeId)
                return (
                  <Badge key={typeId} variant="secondary" className="text-xs">
                    {type?.label}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-3 w-3 p-0 ml-1"
                      onClick={() => handleReportTypeChange(typeId, false)}
                    >
                      <X className="h-2 w-2" />
                    </Button>
                  </Badge>
                )
              })}
              {filters.status.map(statusId => {
                const status = statusOptions.find(s => s.id === statusId)
                return (
                  <Badge key={statusId} variant="secondary" className="text-xs">
                    {status?.label}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-3 w-3 p-0 ml-1"
                      onClick={() => handleStatusChange(statusId, false)}
                    >
                      <X className="h-2 w-2" />
                    </Button>
                  </Badge>
                )
              })}
            </div>
          </div>
        )}

        {/* Apply Filters Button */}
        <Button className="w-full" disabled={activeFiltersCount === 0}>
          Aplicar Filtros
        </Button>
      </CardContent>
    </Card>
  )
}