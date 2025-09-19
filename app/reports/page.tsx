import { Suspense } from "react"
import { ReportsHeader } from "@/components/reports/reports-header"
import { ReportFilters } from "@/components/reports/report-filters"
import { ReportGenerator } from "@/components/reports/report-generator"
import { ReportTemplates } from "@/components/reports/report-templates"
import { RecentReports } from "@/components/reports/recent-reports"

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-background">
      <ReportsHeader />

      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Sistema de Reportes</h1>
            <p className="text-muted-foreground mt-1">Genera reportes personalizados y análisis de inspecciones</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <ReportFilters />
          </div>

          <div className="lg:col-span-3 space-y-6">
            <Suspense fallback={<div className="animate-pulse bg-muted h-64 rounded-lg" />}>
              <ReportTemplates />
            </Suspense>

            <Suspense fallback={<div className="animate-pulse bg-muted h-96 rounded-lg" />}>
              <ReportGenerator />
            </Suspense>

            <Suspense fallback={<div className="animate-pulse bg-muted h-64 rounded-lg" />}>
              <RecentReports />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  )
}
