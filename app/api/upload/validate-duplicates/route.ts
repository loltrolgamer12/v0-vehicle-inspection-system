// API para validar duplicados antes de subir Excel
import type { NextRequest } from "next/server"
import { apiResponse, apiError, validateDuplicates } from "@/lib/api-helpers"

export async function POST(request: NextRequest) {
  try {
    const { inspecciones } = await request.json()

    if (!inspecciones || !Array.isArray(inspecciones)) {
      return apiError("Datos de inspecciones inválidos", 400)
    }

    const validation = await validateDuplicates(inspecciones)
    return apiResponse(validation, 200, "Validación completada")
  } catch (error: any) {
    return apiError("Error al validar duplicados", 500, error.message)
  }
}
