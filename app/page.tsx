"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ProjectCard } from "@/components/project-card"
import { DashboardHeader } from "@/components/dashboard-header"

interface Project {
  _id: string
  customerName: string
  location: string
  squareFeet: number
  quotedPrice: number
  payments: Array<{
    amount: number
    date: string
  }>
  expenses: Array<{
    amount: number
    category: string
    date: string
  }>
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("/api/projects")

        if (!response.ok) {
          throw new Error("Failed to fetch projects")
        }

        const data = await response.json()
        setProjects(data)
      } catch (err) {
        console.error("Error fetching projects:", err)
        setError("Failed to load projects. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  // Calculate totals for each project
  const getProjectTotals = (project: Project) => {
    const paymentsReceived = project.payments.reduce((sum, payment) => sum + payment.amount, 0)
    const expensesTotal = project.expenses.reduce((sum, expense) => sum + expense.amount, 0)

    return { paymentsReceived, expensesTotal }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 container mx-auto p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Projects</h1>
          <Link href="/projects/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center text-destructive p-4 border border-destructive/20 rounded-lg">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => {
              const { paymentsReceived, expensesTotal } = getProjectTotals(project)

              return (
                <ProjectCard
                  key={project._id}
                  id={project._id}
                  customerName={project.customerName}
                  location={project.location}
                  squareFeet={project.squareFeet}
                  quotedPrice={project.quotedPrice}
                  paymentsReceived={paymentsReceived}
                  expensesTotal={expensesTotal}
                />
              )
            })}

            <Link
              href="/projects/new"
              className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors h-[220px]"
            >
              <PlusCircle className="h-8 w-8 mb-2" />
              <p className="font-medium">Add New Project</p>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
