import { Suspense } from "react"
import { VehicleDetailHeader } from "@/components/vehicles/vehicle-detail-header"
import { VehicleInfo } from "@/components/vehicles/vehicle-info"
import { VehicleInspectionHistory } from "@/components/vehicles/vehicle-inspection-history"
import { VehicleMaintenanceSchedule } from "@/components/vehicles/vehicle-maintenance-schedule"

interface VehicleDetailPageProps {
  params: {
    id: string
  }
}

export default function VehicleDetailPage({ params }: VehicleDetailPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <VehicleDetailHeader vehicleId={params.id} />

      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Suspense fallback={<div className="animate-pulse bg-muted h-64 rounded-lg" />}>
              <VehicleInfo vehicleId={params.id} />
            </Suspense>

            <Suspense fallback={<div className="animate-pulse bg-muted h-96 rounded-lg" />}>
              <VehicleInspectionHistory vehicleId={params.id} />
            </Suspense>
          </div>

          <div className="space-y-6">
            <Suspense fallback={<div className="animate-pulse bg-muted h-64 rounded-lg" />}>
              <VehicleMaintenanceSchedule vehicleId={params.id} />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  )
}
