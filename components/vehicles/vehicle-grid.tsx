"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Car, Calendar, User, AlertTriangle, CheckCircle, Clock, Eye, Edit, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Vehicle {
  id: string
  vehicleId: string
  brand: string
  model: string
  year: number
  type: string
  status: "active" | "maintenance" | "critical"
  lastInspection: string
  nextMaintenance: string
  driverName?: string
  mileage: number
  inspectionCount: number
}

export function VehicleGrid() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchVehicles() {
      try {
        const response = await fetch("/api/vehicles")
        const data = await response.json()
        setVehicles(data)
      } catch (error) {
        console.error("Error fetching vehicles:", error)
        // Mock data for development
        setVehicles([
          {
            id: "1",
            vehicleId: "VH-001",
            brand: "Mercedes-Benz",
            model: "Actros",
            year: 2022,
            type: "Camión",
            status: "active",
            lastInspection: "2024-01-21T08:30:00Z",
            nextMaintenance: "2024-02-15T00:00:00Z",
            driverName: "Juan Pérez",
            mileage: 45000,
            inspectionCount: 156,
          },
          {
            id: "2",
            vehicleId: "VH-002",
            brand: "Volvo",
            model: "FH16",
            year: 2021,
            type: "Camión",
            status: "critical",
            lastInspection: "2024-01-20T14:15:00Z",
            nextMaintenance: "2024-01-25T00:00:00Z",
            driverName: "María González",
            mileage: 67000,
            inspectionCount: 203,
          },
          {
            id: "3",
            vehicleId: "VH-003",
            brand: "Ford",
            model: "Transit",
            year: 2023,
            type: "Camioneta",
            status: "maintenance",
            lastInspection: "2024-01-19T10:00:00Z",
            nextMaintenance: "2024-01-22T00:00:00Z",
            mileage: 23000,
            inspectionCount: 89,
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchVehicles()
  }, [])

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "maintenance":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Car className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded w-full" />
                <div className="h-3 bg-muted rounded w-2/3" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Mostrando {vehicles.length} vehículo{vehicles.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles.map((vehicle) => (
          <Card key={vehicle.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(vehicle.status)}
                  <CardTitle className="text-lg">{vehicle.vehicleId}</CardTitle>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(vehicle.status)}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/vehicles/${vehicle.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalles
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {vehicle.brand} {vehicle.model} ({vehicle.year})
              </p>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Tipo</p>
                  <p className="font-medium">{vehicle.type}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Kilometraje</p>
                  <p className="font-medium">{vehicle.mileage.toLocaleString()} km</p>
                </div>
              </div>

              {vehicle.driverName && (
                <div className="flex items-center space-x-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Conductor:</span>
                  <span className="font-medium">{vehicle.driverName}</span>
                </div>
              )}

              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Última inspección:</span>
                <span className="font-medium">{new Date(vehicle.lastInspection).toLocaleDateString("es-ES")}</span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-xs text-muted-foreground">{vehicle.inspectionCount} inspecciones</span>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/vehicles/${vehicle.id}`}>Ver Detalles</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
