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
  Filter, 
  Calendar, 
  FileText, 
  Car, 
  Users, 
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  X,
  RotateCcw
} from "lucide-react"

interface SearchFilters {
  dateRange: any
  contentType: string[]
  status: string[]
  inspectionType: string[]
  vehicleType: string[]
  quickFilters: string[]
}

export function SearchFilters() {
  const [filters, setFilters] = useState<SearchFilters>({
    dateRange: null,
    contentType: [],
    status: [],
    inspectionType: [],
    vehicleType: [],
    quickFilters: []
  })

  const contentTypes = [
    { id: "inspection", label: "Inspecciones", icon: FileText },
    { id: "vehicle", label: "Vehículos", icon: Car },
    { id: "driver", label: "Conductores", icon: Users },
    { id: "fatigue", label: "Control de Fatiga", icon: Shield }
  ]

  const statusOptions = [
    { id: "approved", label: "Aprobados", color: "text-green-600", icon: CheckCircle },
    { id: "rejected", label: "Rechazados", color: "text-red-600", icon: XCircle },
    { id: "pending", label: "Pendientes", color: "text-yellow-600", icon: Clock },
    { id: "critical", label: "Críticos", color: "text-red-600", icon: XCircle }
  ]

  const inspectionTypes = [
    { id: "daily", label: "Diaria" },
    { id: "weekly", label: "Semanal" },
    { id: "monthly", label: "Mensual" },
    { id: "maintenance", label: "Mantenimiento" },
    { id: "emergency", label: "Emergencia" }
  ]

  const vehicleTypes = [
    { id: "truck", label: "Camión" },
    { id: "bus", label: "Bus" },
    { id: "van", label: "Camioneta" },
    { id: "car", label: "Automóvil" },
    { id: "motorcycle", label: "Motocicleta" }
  ]

  const quickFilters = [
    { id: "today", label: "Hoy" },
    { id: "thisWeek", label: "Esta Semana" },
    { id: "thisMonth", label: "Este Mes" },
    { id: "criticalOnly", label: "Solo Críticos" },
    { id: "failedInspections", label: "Inspecciones Fallidas" },
    { id: "activeDrivers", label: "Conductores Activos" }
  ]

  const handleContentTypeChange = (typeId: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      contentType: checked 
        ? [...prev.contentType, typeId]
        : prev.contentType.filter(id => id !== typeId)
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

  const handleInspectionTypeChange = (typeId: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      inspectionType: checked 
        ? [...prev.inspectionType, typeId]
        : prev.inspectionType.filter(id => id !== typeId)
    }))
  }

  const handleVehicleTypeChange = (typeId: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      vehicleType: checked 
        ? [...prev.vehicleType, typeId]
        : prev.vehicleType.filter(id => id !== typeId)
    }))
  }

  const handleQuickFilterChange = (filterId: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      quickFilters: checked 
        ? [...prev.quickFilters, filterId]
        : prev.quickFilters.filter(id => id !== filterId)
    }))
  }

  const clearFilters = () => {
    setFilters({
      dateRange: null,
      contentType: [],
      status: [],
      inspectionType: [],
      vehicleType: [],
      quickFilters: []
    })
  }

  const getActiveFiltersCount = () => {
    return filters.contentType.length + 
           filters.status.length + 
           filters.inspectionType.length +
           filters.vehicleType.length +
           filters.quickFilters.length +
           (filters.dateRange ? 1 : 0)
  }

  const activeFiltersCount = getActiveFiltersCount()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filtros de Búsqueda
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
        {/* Quick Filters */}
        <div className="space-y-3">
          <Label>Filtros Rápidos</Label>
          <div className="grid grid-cols-1 gap-2">
            {quickFilters.map((filter) => (
              <div key={filter.id} className="flex items-center space-x-2">
                <Checkbox
                  id={filter.id}
                  checked={filters.quickFilters.includes(filter.id)}
                  onCheckedChange={(checked) => handleQuickFilterChange(filter.id, checked as boolean)}
                />
                <label 
                  htmlFor={filter.id} 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {filter.label}
                </label>
              </div>
            ))}
          </div>
        </div>

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

        {/* Content Type */}
        <div className="space-y-3">
          <Label>Tipo de Contenido</Label>
          <div className="space-y-2">
            {contentTypes.map((type) => (
              <div key={type.id} className="flex items-center space-x-2">
                <Checkbox
                  id={type.id}
                  checked={filters.contentType.includes(type.id)}
                  onCheckedChange={(checked) => handleContentTypeChange(type.id, checked as boolean)}
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
                  <status.icon className={`h-4 w-4 mr-2 ${status.color}`} />
                  {status.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Inspection Type */}
        <div className="space-y-3">
          <Label>Tipo de Inspección</Label>
          <div className="space-y-2">
            {inspectionTypes.map((type) => (
              <div key={type.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`inspection-${type.id}`}
                  checked={filters.inspectionType.includes(type.id)}
                  onCheckedChange={(checked) => handleInspectionTypeChange(type.id, checked as boolean)}
                />
                <label 
                  htmlFor={`inspection-${type.id}`} 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {type.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Vehicle Type */}
        <div className="space-y-3">
          <Label>Tipo de Vehículo</Label>
          <div className="space-y-2">
            {vehicleTypes.map((type) => (
              <div key={type.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`vehicle-${type.id}`}
                  checked={filters.vehicleType.includes(type.id)}
                  onCheckedChange={(checked) => handleVehicleTypeChange(type.id, checked as boolean)}
                />
                <label 
                  htmlFor={`vehicle-${type.id}`} 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {type.label}
                </label>
              </div>
            ))}
          </div>
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
            
            <div className="space-y-2">
              {/* Show active filter badges */}
              <div className="flex flex-wrap gap-1">
                {filters.contentType.map(typeId => {
                  const type = contentTypes.find(t => t.id === typeId)
                  return (
                    <Badge key={typeId} variant="secondary" className="text-xs">
                      {type?.label}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-3 w-3 p-0 ml-1"
                        onClick={() => handleContentTypeChange(typeId, false)}
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
          </div>
        )}

        {/* Apply Filters Button */}
        <Button className="w-full" disabled={activeFiltersCount === 0}>
          <Filter className="h-4 w-4 mr-2" />
          Aplicar Filtros ({activeFiltersCount})
        </Button>
      </CardContent>
    </Card>
  )
}