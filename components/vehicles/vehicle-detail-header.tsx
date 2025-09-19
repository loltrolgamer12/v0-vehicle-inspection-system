import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, Download, Plus } from "lucide-react"

interface VehicleDetailHeaderProps {
  vehicleId: string
}

export function VehicleDetailHeader({ vehicleId }: VehicleDetailHeaderProps) {
  return (
    <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button asChild variant="ghost" size="icon">
              <Link href="/vehicles">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Vehículo {vehicleId}</h1>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Link href="/" className="hover:text-foreground">
                  Dashboard
                </Link>
                <span>/</span>
                <Link href="/vehicles" className="hover:text-foreground">
                  Vehículos
                </Link>
                <span>/</span>
                <span>{vehicleId}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
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
              Editar Vehículo
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
