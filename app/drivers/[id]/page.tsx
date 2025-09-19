import { Suspense } from "react"
import { DriverDetailHeader } from "@/components/drivers/driver-detail-header"
import { DriverInfo } from "@/components/drivers/driver-info"
import { DriverFatigueHistory } from "@/components/drivers/driver-fatigue-history"
import { DriverInspectionHistory } from "@/components/drivers/driver-inspection-history"
import { DriverPerformanceMetrics } from "@/components/drivers/driver-performance-metrics"

interface DriverDetailPageProps {
  params: {
    id: string
  }
}

export default function DriverDetailPage({ params }: DriverDetailPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <DriverDetailHeader driverId={params.id} />

      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Suspense fallback={<div className="animate-pulse bg-muted h-64 rounded-lg" />}>
              <DriverInfo driverId={params.id} />
            </Suspense>

            <Suspense fallback={<div className="animate-pulse bg-muted h-96 rounded-lg" />}>
              <DriverInspectionHistory driverId={params.id} />
            </Suspense>
          </div>

          <div className="space-y-6">
            <Suspense fallback={<div className="animate-pulse bg-muted h-64 rounded-lg" />}>
              <DriverPerformanceMetrics driverId={params.id} />
            </Suspense>

            <Suspense fallback={<div className="animate-pulse bg-muted h-96 rounded-lg" />}>
              <DriverFatigueHistory driverId={params.id} />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  )
}
