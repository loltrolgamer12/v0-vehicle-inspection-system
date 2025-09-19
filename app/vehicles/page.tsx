import { Suspense } from "react"
import { VehicleHeader } from "@/components/vehicles/vehicle-header"
import { VehicleFilters } from "@/components/vehicles/vehicle-filters"
import { VehicleGrid } from "@/components/vehicles/vehicle-grid"
import { VehicleStats } from "@/components/vehicles/vehicle-stats"

export default function VehiclesPage() {
  return (
    <div className="min-h-screen bg-background">
      <VehicleHeader />

      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestión de Vehículos</h1>
            <p className="text-muted-foreground mt-1">Administra la flota vehicular y sus inspecciones</p>
          </div>
        </div>

        <Suspense fallback={<div className="animate-pulse bg-muted h-32 rounded-lg" />}>
          <VehicleStats />
        </Suspense>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <VehicleFilters />
          </div>

          <div className="lg:col-span-3">
            <Suspense fallback={<div className="animate-pulse bg-muted h-96 rounded-lg" />}>
              <VehicleGrid />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  )
}
