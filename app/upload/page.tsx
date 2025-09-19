import { Suspense } from "react"
import { UploadHeader } from "@/components/upload/upload-header"
import { UploadZone } from "@/components/upload/upload-zone"
import { UploadHistory } from "@/components/upload/upload-history"
import { UploadStats } from "@/components/upload/upload-stats"
import { DuplicatePreview } from "@/components/upload/duplicate-preview"

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-background">
      <UploadHeader />

      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Carga de Archivos Excel</h1>
            <p className="text-muted-foreground mt-1">Sistema de carga acumulativa con validación anti-duplicados</p>
          </div>
        </div>

        <Suspense fallback={<div className="animate-pulse bg-muted h-32 rounded-lg" />}>
          <UploadStats />
        </Suspense>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <UploadZone />

            <Suspense fallback={<div className="animate-pulse bg-muted h-64 rounded-lg" />}>
              <DuplicatePreview />
            </Suspense>
          </div>

          <div className="space-y-6">
            <Suspense fallback={<div className="animate-pulse bg-muted h-96 rounded-lg" />}>
              <UploadHistory />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  )
}
