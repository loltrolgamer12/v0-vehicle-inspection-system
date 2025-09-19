"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Phone, Car, Shield } from "lucide-react"

interface DriverInfo {
  id: string
  name: string
  licenseNumber: string
  licenseType: string
  status: string
  dutyStatus: string
  fatigueStatus: string
  phone: string
  email: string
  address: string
  birthDate: string
  hireDate: string
  experienceYears: number
  currentVehicle?: string
  emergencyContact: string
  emergencyPhone: string
}

interface DriverInfoProps {
  driverId: string
}

export function DriverInfo({ driverId }: DriverInfoProps) {
  const [driver, setDriver] = useState<DriverInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDriverInfo() {
      try {
        const response = await fetch(`/api/drivers/${driverId}`)
        const data = await response.json()
        setDriver(data)
      } catch (error) {
        console.error("Error fetching driver info:", error)
        // Mock data for development
        setDriver({
          id: driverId,
          name: "Juan Pérez",
          licenseNumber: "A1234567",
          licenseType: "A2",
          status: "active",
          dutyStatus: "on-duty",
          fatigueStatus: "normal",
          phone: "+56 9 1234 5678",
          email: "juan.perez@email.com",
          address: "Av. Principal 123, Santiago",
          birthDate: "1985-03-15T00:00:00Z",
          hireDate: "2016-01-10T00:00:00Z",
          experienceYears: 8,
          currentVehicle: "VH-001",
          emergencyContact: "Ana Pérez",
          emergencyPhone: "+56 9 8765 4321",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDriverInfo()
  }, [driverId])

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
            {Array.from({ length: 8 }).map((_, i) => (
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

  if (!driver) return null

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Activo</Badge>
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Inactivo</Badge>
      case "suspended":
        return <Badge variant="destructive">Suspendido</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getDutyStatusBadge = (status: string) => {
    switch (status) {
      case "on-duty":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">En Servicio</Badge>
      case "off-duty":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Fuera de Servicio</Badge>
      case "rest":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Descanso</Badge>
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
              <User className="h-5 w-5" />
              <span>{driver.name}</span>
            </CardTitle>
            <p className="text-muted-foreground">
              Licencia {driver.licenseType} • {driver.licenseNumber}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusBadge(driver.status)}
            {getDutyStatusBadge(driver.dutyStatus)}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Información Personal</h4>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Teléfono</span>
                <span className="text-sm font-medium">{driver.phone}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Email</span>
                <span className="text-sm font-medium">{driver.email}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Dirección</span>
                <span className="text-sm font-medium text-right max-w-[200px]">{driver.address}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Fecha Nacimiento</span>
                <span className="text-sm font-medium">{new Date(driver.birthDate).toLocaleDateString("es-ES")}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Años Experiencia</span>
                <span className="text-sm font-medium">{driver.experienceYears} años</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Información Laboral</h4>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Fecha Contratación</span>
                <span className="text-sm font-medium">{new Date(driver.hireDate).toLocaleDateString("es-ES")}</span>
              </div>

              {driver.currentVehicle && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center">
                    <Car className="h-4 w-4 mr-2" />
                    Vehículo Actual
                  </span>
                  <span className="text-sm font-medium">{driver.currentVehicle}</span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Estado Fatiga
                </span>
                <Badge
                  className={
                    driver.fatigueStatus === "normal"
                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                      : driver.fatigueStatus === "warning"
                        ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                        : "bg-red-100 text-red-800 hover:bg-red-100"
                  }
                >
                  {driver.fatigueStatus === "normal"
                    ? "Normal"
                    : driver.fatigueStatus === "warning"
                      ? "Advertencia"
                      : "Crítico"}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide mb-3">
            Contacto de Emergencia
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Nombre</span>
              </div>
              <span className="text-sm font-medium">{driver.emergencyContact}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Teléfono</span>
              </div>
              <span className="text-sm font-medium">{driver.emergencyPhone}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
