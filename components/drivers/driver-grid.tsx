"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User, Calendar, Car, Shield, AlertTriangle, CheckCircle, Eye, Edit, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Driver {
  id: string
  name: string
  licenseNumber: string
  licenseType: string
  status: "active" | "inactive" | "suspended"
  dutyStatus: "on-duty" | "off-duty" | "rest"
  fatigueStatus: "normal" | "warning" | "critical"
  currentVehicle?: string
  hoursToday: number
  hoursWeek: number
  lastInspection: string
  experienceYears: number
  phone: string
}

export function DriverGrid() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDrivers() {
      try {
        const response = await fetch("/api/drivers")
        const data = await response.json()
        setDrivers(data)
      } catch (error) {
        console.error("Error fetching drivers:", error)
        // Mock data for development
        setDrivers([
          {
            id: "1",
            name: "Juan Pérez",
            licenseNumber: "A1234567",
            licenseType: "A2",
            status: "active",
            dutyStatus: "on-duty",
            fatigueStatus: "normal",
            currentVehicle: "VH-001",
            hoursToday: 6.5,
            hoursWeek: 42,
            lastInspection: "2024-01-21T08:30:00Z",
            experienceYears: 8,
            phone: "+56 9 1234 5678",
          },
          {
            id: "2",
            name: "María González",
            licenseNumber: "A2345678",
            licenseType: "A2",
            status: "active",
            dutyStatus: "off-duty",
            fatigueStatus: "warning",
            currentVehicle: "VH-002",
            hoursToday: 9.5,
            hoursWeek: 48,
            lastInspection: "2024-01-20T14:15:00Z",
            experienceYears: 5,
            phone: "+56 9 2345 6789",
          },
          {
            id: "3",
            name: "Carlos Rodríguez",
            licenseNumber: "A3456789",
            licenseType: "A3",
            status: "active",
            dutyStatus: "rest",
            fatigueStatus: "critical",
            hoursToday: 11,
            hoursWeek: 52,
            lastInspection: "2024-01-19T10:00:00Z",
            experienceYears: 12,
            phone: "+56 9 3456 7890",
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchDrivers()
  }, [])

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

  const getFatigueStatusIcon = (status: string) => {
    switch (status) {
      case "normal":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Shield className="h-4 w-4" />
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
          Mostrando {drivers.length} conductor{drivers.length !== 1 ? "es" : ""}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {drivers.map((driver) => (
          <Card key={driver.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg">{driver.name}</CardTitle>
                </div>
                <div className="flex items-center space-x-2">
                  {getFatigueStatusIcon(driver.fatigueStatus)}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/drivers/${driver.id}`}>
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
                Licencia {driver.licenseType} • {driver.licenseNumber}
              </p>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                {getStatusBadge(driver.status)}
                {getDutyStatusBadge(driver.dutyStatus)}
              </div>

              {driver.currentVehicle && (
                <div className="flex items-center space-x-2 text-sm">
                  <Car className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Vehículo:</span>
                  <span className="font-medium">{driver.currentVehicle}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Horas Hoy</p>
                  <p className={`font-medium ${driver.hoursToday > 10 ? "text-red-600" : "text-foreground"}`}>
                    {driver.hoursToday}h
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Horas Semana</p>
                  <p className={`font-medium ${driver.hoursWeek > 48 ? "text-red-600" : "text-foreground"}`}>
                    {driver.hoursWeek}h
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Última inspección:</span>
                <span className="font-medium">{new Date(driver.lastInspection).toLocaleDateString("es-ES")}</span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-xs text-muted-foreground">{driver.experienceYears} años experiencia</span>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/drivers/${driver.id}`}>Ver Detalles</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
