import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Download, FileText, Settings, HelpCircle } from "lucide-react"

export function UploadHeader() {
  return (
    <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              Dashboard
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-sm font-medium">Carga de Archivos</span>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Plantilla Excel
            </Button>

            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Guía de Formato
            </Button>

            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configuración
            </Button>

            <Button variant="outline" size="sm">
              <HelpCircle className="h-4 w-4 mr-2" />
              Ayuda
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
