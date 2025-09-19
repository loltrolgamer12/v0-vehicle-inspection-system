import { Button } from "@/components/ui/button"
import { Plus, Upload, FileText, Download } from "lucide-react"

export function QuickActions() {
  return (
    <div className="flex items-center space-x-2">
      <Button size="sm" className="bg-primary hover:bg-primary/90">
        <Plus className="h-4 w-4 mr-2" />
        Nueva Inspección
      </Button>

      <Button variant="outline" size="sm">
        <Upload className="h-4 w-4 mr-2" />
        Cargar Excel
      </Button>

      <Button variant="outline" size="sm">
        <FileText className="h-4 w-4 mr-2" />
        Reportes
      </Button>

      <Button variant="outline" size="sm">
        <Download className="h-4 w-4 mr-2" />
        Exportar
      </Button>
    </div>
  )
}
