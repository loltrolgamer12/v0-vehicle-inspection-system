"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  Calendar, 
  Wrench, 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  Settings,
  TrendingUp,
  Plus,
  MoreHorizontal
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface MaintenanceTask {
  id: string
  type: "preventive" | "corrective" | "inspection"
  title: string
  description: string
  scheduledDate: string
  dueDate: string
  status: "scheduled" | "overdue" | "completed" | "in_progress"
  priority: "low" | "medium" | "high" | "critical"
  mileageInterval?: number
  currentMileage?: number
  nextMileage?: number
  estimatedCost?: number
  assignedTechnician?: string
  location?: string
}

interface MaintenanceHistory {
  id: string
  title: string
  completedDate: string
  cost: number
  technician: string
  notes?: string
  parts?: string[]
}

interface VehicleMaintenanceScheduleProps {
  vehicleId: string
}

export function VehicleMaintenanceSchedule({ vehicleId }: VehicleMaintenanceScheduleProps) {
  const [tasks, setTasks] = useState<MaintenanceTask[]>([])
  const [history, setHistory] = useState<MaintenanceHistory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMaintenanceData() {
      try {
        const [tasksResponse, historyResponse] = await Promise.all([
          fetch(`/api/vehicles/${vehicleId}/maintenance/tasks`),
          fetch(`/api/vehicles/${vehicleId}/maintenance/history`)
        ])
        
        const [tasksData, historyData] = await Promise.all([
          tasksResponse.json(),
          historyResponse.json()
        ])
        
        setTasks(tasksData)
        setHistory(historyData)
      } catch (error) {
        console.error("Error fetching maintenance data:", error)
        // Mock data for development
        setTasks([
          {
            id: "1",
            type: "preventive",
            title: "Cambio de Aceite y Filtros",
            description: "Cambio de aceite de motor y filtros de aire, combustible y aceite",
            scheduledDate: "2024-01-25T09:00:00Z",
            dueDate: "2024-01-25T18:00:00Z",
            status: "scheduled",
            priority: "medium",
            mileageInterval: 5000,
            currentMileage: 156420,
            nextMileage: 160000,
            estimatedCost: 180000,
            assignedTechnician: "Carlos Méndez",
            location: "Taller Principal"
          },
          {
            id: "2",
            type: "corrective",
            title: "Reparación Sistema de Frenos",
            description: "Revisión y reparación de pastillas de freno desgastadas",
            scheduledDate: "2024-01-22T08:00:00Z",
            dueDate: "2024-01-22T17:00:00Z",
            status: "overdue",
            priority: "critical",
            estimatedCost: 320000,
            assignedTechnician: "Miguel Torres",
            location: "Taller Principal"
          },
          {
            id: "3",
            type: "inspection",
            title: "Inspección Técnico-Mecánica",
            description: "Inspección anual obligatoria para renovación",
            scheduledDate: "2024-02-15T10:00:00Z",
            dueDate: "2024-02-28T23:59:59Z",
            status: "scheduled",
            priority: "high",
            estimatedCost: 85000,
            location: "CDA Autorizado"
          },
          {
            id: "4",
            type: "preventive",
            title: "Revisión de Llantas",
            description: "Rotación, balanceo y alineación de llantas",
            scheduledDate: "2024-02-01T14:00:00Z",
            dueDate: "2024-02-01T17:00:00Z",
            status: "in_progress",
            priority: "low",
            mileageInterval: 10000,
            currentMileage: 156420,
            nextMileage: 165000,
            estimatedCost: 150000,
            assignedTechnician: "Ana Ruiz",
            location: "Taller Principal"
          }
        ])

        setHistory([
          {
            id: "h1",
            title: "Cambio de Batería",
            completedDate: "2024-01-15T11:30:00Z",
            cost: 240000,
            technician: "Luis Pérez",
            notes: "Batería anterior con 3 años de uso, reemplazada por modelo de mayor capacidad",
            parts: ["Batería 12V 75Ah", "Bornes", "Terminal"]
          },
          {
            id: "h2",
            title: "Mantenimiento Preventivo",
            completedDate: "2024-01-10T09:00:00Z",
            cost: 420000,
            technician: "Carlos Méndez",
            notes: "Mantenimiento de 15,000km completado satisfactoriamente",
            parts: ["Aceite 15W40", "Filtro de aceite", "Filtro de aire", "Filtro de combustible"]
          },
          {
            id: "h3",
            title: "Reparación Sistema Eléctrico",
            completedDate: "2024-01-05T16:20:00Z",
            cost: 180000,
            technician: "Miguel Torres",
            notes: "Falla en alternador, se realizó rebobinado completo",
            parts: ["Kit rebobinado alternador", "Carbones", "Regulador"]
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchMaintenanceData()
  }, [vehicleId])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "overdue":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "in_progress":
        return <Settings className="h-4 w-4 text-blue-600 animate-spin" />
      case "scheduled":
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <Calendar className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completado</Badge>
      case "overdue":
        return <Badge variant="destructive">Vencido</Badge>
      case "in_progress":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">En Progreso</Badge>
      case "scheduled":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Programado</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "critical":
        return <Badge variant="destructive">Crítica</Badge>
      case "high":
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Alta</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Media</Badge>
      case "low":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Baja</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "preventive":
        return <Calendar className="h-4 w-4 text-blue-600" />
      case "corrective":
        return <Wrench className="h-4 w-4 text-red-600" />
      case "inspection":
        return <Settings className="h-4 w-4 text-green-600" />
      default:
        return <Settings className="h-4 w-4 text-gray-600" />
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate)
    const now = new Date()
    const diffTime = due.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Programación de Mantenimiento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const overdueTasks = tasks.filter(task => task.status === "overdue")
  const upcomingTasks = tasks.filter(task => task.status === "scheduled")
  const inProgressTasks = tasks.filter(task => task.status === "in_progress")

  return (
    <div className="space-y-6">
      {/* Alert for overdue tasks */}
      {overdueTasks.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="font-medium text-red-800">
                {overdueTasks.length} tarea{overdueTasks.length > 1 ? "s" : ""} vencida{overdueTasks.length > 1 ? "s" : ""}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Maintenance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Wrench className="h-5 w-5 mr-2" />
              Próximo Mantenimiento
            </div>
            <Button size="sm" className="text-xs">
              <Plus className="h-4 w-4 mr-1" />
              Programar
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tasks.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No hay tareas programadas</p>
              </div>
            ) : (
              tasks.map((task) => {
                const daysUntil = getDaysUntilDue(task.dueDate)
                const mileageProgress = task.mileageInterval && task.currentMileage && task.nextMileage 
                  ? Math.min(100, ((task.currentMileage - (task.nextMileage - task.mileageInterval)) / task.mileageInterval) * 100)
                  : 0

                return (
                  <div
                    key={task.id}
                    className={`p-4 border rounded-lg ${
                      task.status === "overdue" 
                        ? "border-red-200 bg-red-50" 
                        : task.status === "in_progress"
                          ? "border-blue-200 bg-blue-50"
                          : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start space-x-3">
                        {getStatusIcon(task.status)}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            {getTypeIcon(task.type)}
                            <h4 className="font-medium">{task.title}</h4>
                            {getPriorityBadge(task.priority)}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>Programado: {new Date(task.scheduledDate).toLocaleDateString("es-ES")}</span>
                            </div>
                            {task.assignedTechnician && (
                              <div className="flex items-center space-x-1">
                                <Settings className="h-3 w-3" />
                                <span>Técnico: {task.assignedTechnician}</span>
                              </div>
                            )}
                            {task.estimatedCost && (
                              <div className="flex items-center space-x-1">
                                <TrendingUp className="h-3 w-3" />
                                <span>Costo est.: {formatCurrency(task.estimatedCost)}</span>
                              </div>
                            )}
                            {task.location && (
                              <div className="flex items-center space-x-1">
                                <Wrench className="h-3 w-3" />
                                <span>Ubicación: {task.location}</span>
                              </div>
                            )}
                          </div>

                          {/* Progress bar for mileage-based maintenance */}
                          {task.mileageInterval && (
                            <div className="mt-3">
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span>Progreso por kilometraje</span>
                                <span>{task.currentMileage?.toLocaleString()} / {task.nextMileage?.toLocaleString()} km</span>
                              </div>
                              <Progress
                                value={mileageProgress}
                                className="h-2"
                                indicatorClassName={
                                  mileageProgress >= 90 ? "bg-red-500" :
                                  mileageProgress >= 75 ? "bg-yellow-500" : "bg-green-500"
                                }
                              />
                            </div>
                          )}

                          {/* Days until due */}
                          <div className="mt-2">
                            <span className={`text-xs font-medium ${
                              daysUntil < 0 ? "text-red-600" :
                              daysUntil <= 3 ? "text-orange-600" : "text-green-600"
                            }`}>
                              {daysUntil < 0 ? `Vencido hace ${Math.abs(daysUntil)} días` :
                               daysUntil === 0 ? "Vence hoy" :
                               daysUntil === 1 ? "Vence mañana" :
                               `${daysUntil} días restantes`}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {getStatusBadge(task.status)}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Editar tarea</DropdownMenuItem>
                            <DropdownMenuItem>Marcar completado</DropdownMenuItem>
                            <DropdownMenuItem>Reagendar</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              Cancelar tarea
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Maintenance History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            Historial de Mantenimiento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {history.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <Wrench className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No hay historial de mantenimiento</p>
              </div>
            ) : (
              history.map((record) => (
                <div key={record.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium">{record.title}</h4>
                      <div className="text-sm text-muted-foreground mt-1">
                        <span>Completado: {new Date(record.completedDate).toLocaleDateString("es-ES")}</span>
                        <span className="mx-2">•</span>
                        <span>Técnico: {record.technician}</span>
                        <span className="mx-2">•</span>
                        <span className="font-medium">{formatCurrency(record.cost)}</span>
                      </div>
                      {record.notes && (
                        <p className="text-sm text-muted-foreground mt-2 bg-muted/50 p-2 rounded">
                          {record.notes}
                        </p>
                      )}
                      {record.parts && record.parts.length > 0 && (
                        <div className="mt-2">
                          <span className="text-xs font-medium text-muted-foreground">Repuestos utilizados:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {record.parts.map((part, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {part}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}