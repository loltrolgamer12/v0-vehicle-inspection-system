import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, Download, Plus, Shield } from "lucide-react"

interface DriverDetailHeaderProps {
  driverId: string
}

export function DriverDetailHeader({ driverId }: DriverDetailHeaderProps) {
  return (
    <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button asChild variant="ghost" size="icon">
              <Link href="/drivers">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Conductor {driverId}</h1>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Link href="/" className="hover:text-foreground">
                  Dashboard
                </Link>
                <span>/</span>
                <Link href="/drivers" className="hover:text-foreground">
                  Conductores
                </Link>
                <span>/</span>
                <span>{driverId}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Shield className="h-4 w-4 mr-2" />
              Control Fatiga
            </Button>

            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar Historial
            </Button>

            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Inspección
            </Button>

            <Button size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Editar Conductor
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
