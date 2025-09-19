"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Car, Users, Clock, Upload, FileText, Search, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"
import Image from "next/image"

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Vehículos",
    href: "/vehicles",
    icon: Car,
  },
  {
    name: "Conductores",
    href: "/drivers",
    icon: Users,
  },
  {
    name: "Control de Fatiga",
    href: "/fatigue",
    icon: Clock,
  },
  {
    name: "Carga de Archivos",
    href: "/upload",
    icon: Upload,
  },
  {
    name: "Reportes",
    href: "/reports",
    icon: FileText,
  },
  {
    name: "Búsqueda",
    href: "/search",
    icon: Search,
  },
]

export function MainNavigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <Image
            src="/images/sas-logo.png"
            alt="SAS Servicios Asociados"
            width={120}
            height={40}
            className="h-8 w-auto"
          />
          <div className="hidden md:block">
            <h1 className="text-lg font-semibold text-foreground">Sistema de Inspección Vehicular</h1>
            <p className="text-sm text-muted-foreground">HQ-FO-40</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex ml-8 space-x-1">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent",
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden ml-auto">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <div className="flex items-center justify-between mb-6">
                <Image
                  src="/images/sas-logo.png"
                  alt="SAS Servicios Asociados"
                  width={120}
                  height={40}
                  className="h-8 w-auto"
                />
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <nav className="space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center space-x-3 px-3 py-3 rounded-md text-sm font-medium transition-colors w-full",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent",
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
