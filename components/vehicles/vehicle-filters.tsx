"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { X } from "lucide-react"

export function VehicleFilters() {
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const filterSections = [
    {
      title: "Estado",
      options: [
        { id: "active", label: "Activo", count: 38 },
        { id: "maintenance", label: "Mantenimiento", count: 5 },
        { id: "critical", label: "Crítico", count: 2 },
      ],
    },
    {
      title: "Tipo de Vehículo",
      options: [
        { id: "truck", label: "Camión", count: 25 },
        { id: "van", label: "Camioneta", count: 12 },
        { id: "bus", label: "Autobús", count: 8 },
      ],
    },
    {
      title: "Última Inspección",
      options: [
        { id: "today", label: "Hoy", count: 15 },
        { id: "week", label: "Esta semana", count: 28 },
        { id: "month", label: "Este mes", count: 45 },
        { id: "overdue", label: "Vencida", count: 3 },
      ],
    },
  ]

  const handleFilterChange = (filterId: string, checked: boolean) => {
    if (checked) {
      setActiveFilters([...activeFilters, filterId])
    } else {
      setActiveFilters(activeFilters.filter((id) => id !== filterId))
    }
  }

  const clearAllFilters = () => {
    setActiveFilters([])
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filtros</CardTitle>
          {activeFilters.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-xs">
              <X className="h-3 w-3 mr-1" />
              Limpiar
            </Button>
          )}
        </div>
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {activeFilters.map((filterId) => {
              const option = filterSections.flatMap((section) => section.options).find((opt) => opt.id === filterId)
              return (
                <Badge key={filterId} variant="secondary" className="text-xs">
                  {option?.label}
                  <button
                    onClick={() => handleFilterChange(filterId, false)}
                    className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                  >
                    <X className="h-2 w-2" />
                  </button>
                </Badge>
              )
            })}
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {filterSections.map((section, sectionIndex) => (
          <div key={section.title}>
            <h4 className="font-medium text-sm mb-3">{section.title}</h4>
            <div className="space-y-2">
              {section.options.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.id}
                    checked={activeFilters.includes(option.id)}
                    onCheckedChange={(checked) => handleFilterChange(option.id, checked as boolean)}
                  />
                  <Label htmlFor={option.id} className="text-sm flex-1 cursor-pointer">
                    {option.label}
                  </Label>
                  <span className="text-xs text-muted-foreground">({option.count})</span>
                </div>
              ))}
            </div>
            {sectionIndex < filterSections.length - 1 && <Separator className="mt-4" />}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
