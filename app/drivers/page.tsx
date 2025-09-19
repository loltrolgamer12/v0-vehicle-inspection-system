import { Suspense } from "react"
import { DriverHeader } from "@/components/drivers/driver-header"
import { DriverFilters } from "@/components/drivers/driver-filters"
import { DriverGrid } from "@/components/drivers/driver-grid"
import { DriverStats } from "@/components/drivers/driver-stats"

export default function DriversPage() {
  return (
    <div className="min-h-screen bg-background">
      <DriverHeader />

      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestión de Conductores</h1>
            <p className="text-muted-foreground mt-1">Administra conductores y control de fatiga</p>
          </div>
        </div>

        <Suspense fallback={<div className="animate-pulse bg-muted h-32 rounded-lg" />}>
          <DriverStats />
        </Suspense>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <DriverFilters />
          </div>

          <div className="lg:col-span-3">
            <Suspense fallback={<div className="animate-pulse bg-muted h-96 rounded-lg" />}>
              <DriverGrid />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  )
}
