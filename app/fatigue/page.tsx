import { Suspense } from "react"
import { FatigueHeader } from "@/components/fatigue/fatigue-header"
import { FatigueOverview } from "@/components/fatigue/fatigue-overview"
import { FatigueAlerts } from "@/components/fatigue/fatigue-alerts"
import { FatigueDriverList } from "@/components/fatigue/fatigue-driver-list"
import { FatigueComplianceChart } from "@/components/fatigue/fatigue-compliance-chart"

export default function FatiguePage() {
  return (
    <div className="min-h-screen bg-background">
      <FatigueHeader />

      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Control de Fatiga</h1>
            <p className="text-muted-foreground mt-1">Monitoreo y cumplimiento de horas de conducción</p>
          </div>
        </div>

        <Suspense fallback={<div className="animate-pulse bg-muted h-32 rounded-lg" />}>
          <FatigueOverview />
        </Suspense>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Suspense fallback={<div className="animate-pulse bg-muted h-96 rounded-lg" />}>
              <FatigueComplianceChart />
            </Suspense>

            <Suspense fallback={<div className="animate-pulse bg-muted h-96 rounded-lg" />}>
              <FatigueDriverList />
            </Suspense>
          </div>

          <div className="space-y-6">
            <Suspense fallback={<div className="animate-pulse bg-muted h-96 rounded-lg" />}>
              <FatigueAlerts />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  )
}
