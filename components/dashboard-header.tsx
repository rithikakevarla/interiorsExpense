"use client"

import Link from "next/link"
import { Home, BarChart3, Menu, X } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"

export function DashboardHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="border-b bg-background sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl flex items-center">
          <span className="hidden md:inline">Interior Design Tracker</span>
          <span className="md:hidden">ID Tracker</span>
        </Link>

        <div className="hidden md:flex items-center space-x-1">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <Home className="h-4 w-4 mr-2" />
              Projects
            </Button>
          </Link>
          <Link href="/summary">
            <Button variant="ghost" size="sm">
              <BarChart3 className="h-4 w-4 mr-2" />
              Summary
            </Button>
          </Link>
          <ModeToggle />
        </div>

        <div className="md:hidden flex items-center">
          <ModeToggle />
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t p-4 flex flex-col space-y-2 bg-background">
          <Link href="/" onClick={() => setIsMenuOpen(false)}>
            <Button variant="ghost" className="w-full justify-start">
              <Home className="h-4 w-4 mr-2" />
              Projects
            </Button>
          </Link>
          <Link href="/summary" onClick={() => setIsMenuOpen(false)}>
            <Button variant="ghost" className="w-full justify-start">
              <BarChart3 className="h-4 w-4 mr-2" />
              Summary
            </Button>
          </Link>
        </div>
      )}
    </header>
  )
}
