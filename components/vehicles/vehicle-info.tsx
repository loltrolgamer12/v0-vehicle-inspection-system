"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Car, Calendar, User, Gauge, MapPin, Wrench } from "lucide-react"

interface VehicleInfo {
  id: string
  vehicleId: string
  brand: string
  model: string
  year: number
  type: string
  status: string
  vin: string
  licensePlate: string
  mileage: number
  fuelType: string
  capacity: string
  currentDriver?: string
  location?: string
  lastMaintenance: string
  nextMaintenance: string
  registrationDate: string
}

interface VehicleInfoProps {
  vehicleId: string
}

export function VehicleInfo({ vehicleId }: VehicleInfoProps) {
  const [vehicle, setVehicle] = useState<VehicleInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchVehicleInfo() {
      try {
        const response = await fetch(`/api/vehicles/${vehicleId}`)
        const data = await response.json()
        setVehicle(data)
      } catch (error) {
        console.error("Error fetching vehicle info:", error)
        // Mock data for development
        setVehicle({
          id: vehicleId,
          vehicleId: "VH-001",
          brand: "Mercedes-Benz",
          model: "Actros 2545",
          year: 2022,
          type: "Camión",
          status: "active",
          vin: "WDB9340261L123456",
          licensePlate: "ABC-123",
          mileage: 45000,
          fuelType: "Diésel",
          capacity: "25 toneladas",
          currentDriver: "Juan Pérez",
          location: "Depósito Central",
          lastMaintenance: "2024-01-15T00:00:00Z",
          nextMaintenance: "2024-02-15T00:00:00Z",
          registrationDate: "2022-03-15T00:00:00Z",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchVehicleInfo()
  }, [vehicleId])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="animate-pulse">
            <div className="h-6 bg-muted rounded w-1/3 mb-2" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex justify-between">
                <div className="h-4 bg-muted rounded w-1/3" />
                <div className="h-4 bg-muted rounded w-1/4" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!vehicle) return null

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Activo</Badge>
      case "maintenance":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Mantenimiento</Badge>
      case "critical":
        return <Badge variant="destructive">Crítico</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Car className="h-5 w-5" />
              <span>{vehicle.vehicleId}</span>
            </CardTitle>
            <p className="text-muted-foreground">
              {vehicle.brand} {vehicle.model} ({vehicle.year})
            </p>
          </div>
          {getStatusBadge(vehicle.status)}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Información Básica</h4>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Tipo de Vehículo</span>
                <span className="text-sm font-medium">{vehicle.type}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Placa</span>
                <span className="text-sm font-medium">{vehicle.licensePlate}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">VIN</span>
                <span className="text-sm font-medium font-mono">{vehicle.vin}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Combustible</span>
                <span className="text-sm font-medium">{vehicle.fuelType}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Capacidad</span>
                <span className="text-sm font-medium">{vehicle.capacity}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Estado Actual</h4>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground flex items-center">
                  <Gauge className="h-4 w-4 mr-2" />
                  Kilometraje
                </span>
                <span className="text-sm font-medium">{vehicle.mileage.toLocaleString()} km</span>
              </div>

              {vehicle.currentDriver && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Conductor Actual
                  </span>
                  <span className="text-sm font-medium">{vehicle.currentDriver}</span>
                </div>
              )}

              {vehicle.location && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    Ubicación
                  </span>
                  <span className="text-sm font-medium">{vehicle.location}</span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Registro
                </span>
                <span className="text-sm font-medium">
                  {new Date(vehicle.registrationDate).toLocaleDateString("es-ES")}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide mb-3">Mantenimiento</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Wrench className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Último Mantenimiento</span>
              </div>
              <span className="text-sm font-medium">
                {new Date(vehicle.lastMaintenance).toLocaleDateString("es-ES")}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Próximo Mantenimiento</span>
              </div>
              <span className="text-sm font-medium">
                {new Date(vehicle.nextMaintenance).toLocaleDateString("es-ES")}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
