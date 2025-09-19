import Image from "next/image"
import { Bell, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function DashboardHeader() {
  return (
    <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Image
              src="/images/sas-logo.png"
              alt="SAS Servicios Asociados"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
            <div className="hidden md:block h-8 w-px bg-border" />
            <div className="hidden md:block">
              <h2 className="text-sm font-semibold text-foreground">Sistema de Inspección</h2>
              <p className="text-xs text-muted-foreground">HQ-FO-40</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder="Buscar vehículos, conductores..." className="pl-10 w-64" />
            </div>

            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full text-xs flex items-center justify-center text-destructive-foreground">
                3
              </span>
            </Button>

            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
