"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, X, Zap } from "lucide-react"

export function SearchInterface() {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [recentSearches] = useState([
    "VH-001 inspecciones enero",
    "Juan Pérez fatiga",
    "frenos rechazados",
    "Mercedes-Benz mantenimiento",
  ])

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return

    // In a real implementation, this would call the search API
    console.log("Searching for:", searchQuery)

    // Mock suggestions
    if (searchQuery.length > 2) {
      setSuggestions([
        `${searchQuery} en inspecciones`,
        `${searchQuery} por conductor`,
        `${searchQuery} por vehículo`,
        `${searchQuery} por fecha`,
      ])
    } else {
      setSuggestions([])
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    setSuggestions([])
    handleSearch(suggestion)
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Buscar inspecciones, vehículos, conductores..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  handleSearch(e.target.value)
                }}
                className="pl-10 pr-12 h-12 text-lg"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch(query)
                    setSuggestions([])
                  }
                }}
              />
              {query && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                  onClick={() => {
                    setQuery("")
                    setSuggestions([])
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-lg shadow-lg z-10">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className="w-full text-left px-4 py-2 hover:bg-muted transition-colors flex items-center space-x-2"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <span>{suggestion}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-muted-foreground">Búsqueda predictiva activada</span>
            </div>
            <Button onClick={() => handleSearch(query)} disabled={!query.trim()}>
              Buscar
            </Button>
          </div>

          {recentSearches.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Búsquedas recientes:</p>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => {
                      setQuery(search)
                      handleSearch(search)
                    }}
                  >
                    {search}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
