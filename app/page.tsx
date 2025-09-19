import { Suspense } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { MetricsGrid } from "@/components/metrics-grid"
import { InspectionChart } from "@/components/inspection-chart"
import { RecentInspections } from "@/components/recent-inspections"
import { AlertsPanel } from "@/components/alerts-panel"
import { QuickActions } from "@/components/quick-actions"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard Ejecutivo</h1>
            <p className="text-muted-foreground mt-1">Sistema de Inspección Vehicular HQ-FO-40</p>
          </div>
          <QuickActions />
        </div>

        <Suspense fallback={<div className="animate-pulse bg-muted h-32 rounded-lg" />}>
          <MetricsGrid />
        </Suspense>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Suspense fallback={<div className="animate-pulse bg-muted h-96 rounded-lg" />}>
              <InspectionChart />
            </Suspense>
          </div>

          <div className="space-y-6">
            <Suspense fallback={<div className="animate-pulse bg-muted h-48 rounded-lg" />}>
              <AlertsPanel />
            </Suspense>
          </div>
        </div>

        <Suspense fallback={<div className="animate-pulse bg-muted h-64 rounded-lg" />}>
          <RecentInspections />
        </Suspense>
      </main>
    </div>
  )
}
