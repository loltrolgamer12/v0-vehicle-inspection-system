"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Clock, 
  Search, 
  TrendingUp, 
  X, 
  MoreHorizontal,
  BookmarkPlus,
  Share2,
  RotateCcw
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface SearchHistory {
  id: string
  query: string
  timestamp: string
  resultCount: number
  searchType: "global" | "inspection" | "vehicle" | "driver"
  filters?: Record<string, any>
}

interface PopularSearch {
  query: string
  count: number
  trend: "up" | "down" | "stable"
}

export function RecentSearches() {
  const [recentSearches, setRecentSearches] = useState<SearchHistory[]>([])
  const [popularSearches, setPopularSearches] = useState<PopularSearch[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSearchHistory() {
      try {
        const response = await fetch("/api/search/history")
        const data = await response.json()
        setRecentSearches(data.recent || [])
        setPopularSearches(data.popular || [])
      } catch (error) {
        console.error("Error fetching search history:", error)
        // Mock data for development
        setRecentSearches([
          {
            id: "1",
            query: "VH-001 inspecciones enero",
            timestamp: "2024-01-21T10:30:00Z",
            resultCount: 12,
            searchType: "inspection",
            filters: { dateRange: "2024-01", vehicleId: "VH-001" }
          },
          {
            id: "2",
            query: "Juan Pérez fatiga",
            timestamp: "2024-01-21T09:15:00Z",
            resultCount: 5,
            searchType: "driver",
            filters: { driverName: "Juan Pérez", type: "fatigue" }
          },
          {
            id: "3",
            query: "frenos rechazados",
            timestamp: "2024-01-20T16:45:00Z",
            resultCount: 23,
            searchType: "global",
            filters: { status: "rejected", component: "brakes" }
          },
          {
            id: "4",
            query: "Mercedes-Benz mantenimiento",
            timestamp: "2024-01-20T14:20:00Z",
            resultCount: 8,
            searchType: "vehicle",
            filters: { brand: "Mercedes-Benz", type: "maintenance" }
          },
          {
            id: "5",
            query: "inspecciones críticas esta semana",
            timestamp: "2024-01-19T11:10:00Z",
            resultCount: 15,
            searchType: "inspection",
            filters: { status: "critical", dateRange: "thisWeek" }
          }
        ])

        setPopularSearches([
          { query: "inspecciones rechazadas", count: 142, trend: "up" },
          { query: "mantenimiento pendiente", count: 98, trend: "stable" },
          { query: "control fatiga", count: 87, trend: "up" },
          { query: "vehículos críticos", count: 76, trend: "down" },
          { query: "conductores activos", count: 65, trend: "stable" }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchSearchHistory()
  }, [])

  const handleSearchClick = (query: string) => {
    // In a real implementation, this would trigger a new search
    console.log("Executing search:", query)
  }

  const handleRemoveSearch = (searchId: string) => {
    setRecentSearches(prev => prev.filter(s => s.id !== searchId))
  }

  const handleClearHistory = () => {
    setRecentSearches([])
  }

  const getSearchTypeLabel = (type: string) => {
    const types = {
      global: "Global",
      inspection: "Inspecciones",
      vehicle: "Vehículos",
      driver: "Conductores"
    }
    return types[type as keyof typeof types] || type
  }

  const getSearchTypeBadge = (type: string) => {
    switch (type) {
      case "inspection":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 text-xs">Inspección</Badge>
      case "vehicle":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">Vehículo</Badge>
      case "driver":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 text-xs">Conductor</Badge>
      default:
        return <Badge variant="outline" className="text-xs">Global</Badge>
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3 w-3 text-green-600" />
      case "down":
        return <TrendingUp className="h-3 w-3 text-red-600 rotate-180" />
      default:
        return <div className="h-3 w-3 rounded-full bg-gray-400" />
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Búsquedas Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-1" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Recent Searches */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Búsquedas Recientes
            </div>
            {recentSearches.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleClearHistory}
                className="text-xs"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Limpiar
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentSearches.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No hay búsquedas recientes</p>
              </div>
            ) : (
              recentSearches.map((search) => (
                <div
                  key={search.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <button
                        onClick={() => handleSearchClick(search.query)}
                        className="font-medium text-sm truncate hover:text-primary cursor-pointer"
                      >
                        {search.query}
                      </button>
                      {getSearchTypeBadge(search.searchType)}
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span>{new Date(search.timestamp).toLocaleString("es-ES")}</span>
                      <span>•</span>
                      <span>{search.resultCount} resultados</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleSearchClick(search.query)}>
                          <Search className="h-4 w-4 mr-2" />
                          Buscar de nuevo
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <BookmarkPlus className="h-4 w-4 mr-2" />
                          Guardar búsqueda
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share2 className="h-4 w-4 mr-2" />
                          Compartir
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleRemoveSearch(search.id)}
                          className="text-red-600"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Popular Searches */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Búsquedas Populares
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {popularSearches.map((popular, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <button
                  onClick={() => handleSearchClick(popular.query)}
                  className="flex-1 text-left"
                >
                  <div className="flex items-center space-x-2">
                    {getTrendIcon(popular.trend)}
                    <span className="font-medium text-sm">{popular.query}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {popular.count} búsquedas
                  </div>
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Sugerencias de Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              "Inspecciones fallidas última semana",
              "Vehículos sin mantenimiento",
              "Conductores con exceso de horas",
              "Alertas críticas pendientes"
            ].map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSearchClick(suggestion)}
                className="w-full text-left p-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}