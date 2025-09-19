// API para búsqueda predictiva global
import type { NextRequest } from "next/server"
import { apiResponse, apiError, searchGlobal } from "@/lib/api-helpers"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")
    const limit = Number.parseInt(searchParams.get("limit") || "20")

    if (!query || query.trim().length < 2) {
      return apiResponse([], 200, "Query muy corto")
    }

    const results = await searchGlobal(query.trim(), limit)
    return apiResponse(results, 200, `${results.length} resultados encontrados`)
  } catch (error: any) {
    return apiError("Error en búsqueda predictiva", 500, error.message)
  }
}
