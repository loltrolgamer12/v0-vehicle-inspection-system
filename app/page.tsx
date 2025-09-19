import { Suspense } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { MetricsGrid } from "@/components/metrics-grid"
import { InspectionChart } from "@/components/inspection-chart"
import { RecentInspections } from "@/components/recent-inspections"
import { AlertsPanel } from "@/components/alerts-panel"
import { QuickActions } from "@/components/quick-actions"
import { ErrorBoundary } from "@/lib/error-boundary"

// Componente de loading reutilizable
function LoadingCard({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-muted rounded-lg ${className}`}>
      <div className="p-6 space-y-4">
        <div className="h-4 bg-muted-foreground/20 rounded w-1/3" />
        <div className="h-8 bg-muted-foreground/20 rounded w-1/2" />
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <ErrorBoundary>
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

          <ErrorBoundary>
            <Suspense fallback={<LoadingCard className="h-32" />}>
              <MetricsGrid />
            </Suspense>
          </ErrorBoundary>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ErrorBoundary>
                <Suspense fallback={<LoadingCard className="h-96" />}>
                  <InspectionChart />
                </Suspense>
              </ErrorBoundary>
            </div>

            <div className="space-y-6">
              <ErrorBoundary>
                <Suspense fallback={<LoadingCard className="h-48" />}>
                  <AlertsPanel />
                </Suspense>
              </ErrorBoundary>
            </div>
          </div>

          <ErrorBoundary>
            <Suspense fallback={<LoadingCard className="h-64" />}>
              <RecentInspections />
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>
    </ErrorBoundary>
  )
}
