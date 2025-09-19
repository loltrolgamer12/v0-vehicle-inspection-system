import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Download, AlertTriangle, Settings } from "lucide-react"

export function FatigueHeader() {
  return (
    <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              Dashboard
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-sm font-medium">Control de Fatiga</span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder="Buscar conductor..." className="pl-10 w-64" />
            </div>

            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configurar Límites
            </Button>

            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Reporte Cumplimiento
            </Button>

            <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Alertas Activas
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
