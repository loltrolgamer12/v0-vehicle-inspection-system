"use client"

import { Button } from "@/components/ui/button"
import { Plus, Upload, FileText, Search } from "lucide-react"

export function QuickActions() {
  return (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="sm">
        <Search className="h-4 w-4 mr-2" />
        Búsqueda
      </Button>
      <Button variant="outline" size="sm">
        <FileText className="h-4 w-4 mr-2" />
        Reportes
      </Button>
      <Button variant="outline" size="sm">
        <Upload className="h-4 w-4 mr-2" />
        Cargar Datos
      </Button>
      <Button size="sm">
        <Plus className="h-4 w-4 mr-2" />
        Nueva Inspección
      </Button>
    </div>
  )
}