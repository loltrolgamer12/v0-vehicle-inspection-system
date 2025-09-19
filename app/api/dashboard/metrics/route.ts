// API para obtener métricas del dashboard ejecutivo
import type { NextRequest } from "next/server"
import { apiResponse, apiError, getDashboardMetrics } from "@/lib/api-helpers"

export async function GET(request: NextRequest) {
  try {
    const metrics = await getDashboardMetrics()
    return apiResponse(metrics, 200, "Métricas obtenidas exitosamente")
  } catch (error: any) {
    return apiError("Error al obtener métricas del dashboard", 500, error.message)
  }
}
