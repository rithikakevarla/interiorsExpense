"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, BarChart, PieChart, TrendingUp } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard-header"

interface Project {
  _id: string
  customerName: string
  quotedPrice: number
  payments: Array<{
    amount: number
  }>
  expenses: Array<{
    amount: number
    category: string
  }>
}

interface ProjectSummary {
  name: string
  profit: number
  margin: number
}

interface CategoryExpense {
  category: string
  amount: number
}

export default function Summary() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [totalProjects, setTotalProjects] = useState(0)
  const [totalQuoted, setTotalQuoted] = useState(0)
  const [totalExpenses, setTotalExpenses] = useState(0)
  const [totalProfit, setTotalProfit] = useState(0)
  const [averageProfitMargin, setAverageProfitMargin] = useState(0)
  const [expensesByCategory, setExpensesByCategory] = useState<Record<string, number>>({})
  const [projectProfits, setProjectProfits] = useState<ProjectSummary[]>([])

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("/api/projects")

        if (!response.ok) {
          throw new Error("Failed to fetch projects")
        }

        const data = await response.json()
        setProjects(data)

        // Calculate summary data
        calculateSummaryData(data)
      } catch (err) {
        console.error("Error fetching projects:", err)
        setError("Failed to load projects. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const calculateSummaryData = (projects: Project[]) => {
    if (!projects.length) return

    // Total projects
    setTotalProjects(projects.length)

    // Calculate totals
    let quotedTotal = 0
    let expensesTotal = 0
    let profitTotal = 0
    let marginSum = 0

    // Expenses by category
    const categoryExpenses: Record<string, number> = {}

    // Project profits
    const profits: ProjectSummary[] = []

    projects.forEach((project) => {
      // Calculate project totals
      const projectQuoted = project.quotedPrice
      const projectExpenses = project.expenses.reduce((sum, expense) => sum + expense.amount, 0)
      const projectProfit = projectQuoted - projectExpenses
      const projectMargin = projectQuoted > 0 ? Math.round((projectProfit / projectQuoted) * 100) : 0

      // Add to totals
      quotedTotal += projectQuoted
      expensesTotal += projectExpenses
      profitTotal += projectProfit
      marginSum += projectMargin

      // Add to project profits
      profits.push({
        name: project.customerName,
        profit: projectProfit,
        margin: projectMargin,
      })

      // Add to category expenses
      project.expenses.forEach((expense) => {
        if (!categoryExpenses[expense.category]) {
          categoryExpenses[expense.category] = 0
        }
        categoryExpenses[expense.category] += expense.amount
      })
    })

    // Set state
    setTotalQuoted(quotedTotal)
    setTotalExpenses(expensesTotal)
    setTotalProfit(profitTotal)
    setAverageProfitMargin(Math.round((marginSum / projects.length) * 10) / 10)
    setExpensesByCategory(categoryExpenses)
    setProjectProfits(profits)
  }

  // Sort categories by expense amount (descending)
  const sortedCategories = Object.entries(expensesByCategory)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5) // Top 5 categories

  // Calculate the highest expense amount for scaling the bars
  const highestExpense = Math.max(...Object.values(expensesByCategory), 1)

  // Sort projects by profit margin (descending)
  const sortedProjects = [...projectProfits].sort((a, b) => b.margin - a.margin)

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <main className="flex-1 container mx-auto p-4 md:p-6 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <main className="flex-1 container mx-auto p-4 md:p-6">
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-primary">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Link>
          </div>
          <div className="text-center text-destructive p-4 border border-destructive/20 rounded-lg">{error}</div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 container mx-auto p-4 md:p-6">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-primary">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Link>
        </div>

        <h1 className="text-2xl font-bold mb-6">Business Summary</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalProjects}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">₹{(totalQuoted / 100000).toFixed(1)}L</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Profit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">₹{(totalProfit / 100000).toFixed(1)}L</div>
              <p className="text-muted-foreground text-sm">Avg. Margin: {averageProfitMargin}%</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Expense Categories</CardTitle>
              <CardDescription>Where most of your expenses are going</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sortedCategories.map(([category, amount]) => (
                  <div key={category} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{category}</span>
                      <span className="font-medium">₹{amount.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${(amount / highestExpense) * 100}%` }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {Math.round((amount / totalExpenses) * 100)}% of total expenses
                    </div>
                  </div>
                ))}

                {sortedCategories.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">No expense data available</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Profit Margins</CardTitle>
              <CardDescription>Performance of your projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sortedProjects.map((project) => (
                  <div key={project.name} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="truncate">{project.name}</span>
                      <span
                        className={`font-medium ${project.margin < 20 ? "text-destructive" : project.margin > 30 ? "text-green-600 dark:text-green-500" : ""}`}
                      >
                        {project.margin}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          project.margin < 20
                            ? "bg-destructive"
                            : project.margin > 30
                              ? "bg-green-600 dark:bg-green-500"
                              : "bg-primary"
                        }`}
                        style={{ width: `${project.margin * 2}%` }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Profit: ₹{project.profit.toLocaleString("en-IN")}
                    </div>
                  </div>
                ))}

                {sortedProjects.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">No project data available</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {(sortedCategories.length > 0 || sortedProjects.length > 0) && (
          <Card>
            <CardHeader>
              <CardTitle>Business Insights</CardTitle>
              <CardDescription>Key metrics and recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center text-lg font-medium">
                    <TrendingUp className="h-5 w-5 mr-2 text-green-600 dark:text-green-500" />
                    Most Profitable Projects
                  </div>
                  <ul className="space-y-1 text-sm">
                    {sortedProjects.slice(0, 3).map((project) => (
                      <li key={project.name} className="flex justify-between">
                        <span>{project.name}</span>
                        <span className="font-medium">{project.margin}%</span>
                      </li>
                    ))}
                    {sortedProjects.length === 0 && <li className="text-muted-foreground">No data available</li>}
                  </ul>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-lg font-medium">
                    <BarChart className="h-5 w-5 mr-2 text-primary" />
                    Highest Expenses
                  </div>
                  <ul className="space-y-1 text-sm">
                    {sortedCategories.slice(0, 3).map(([category, amount]) => (
                      <li key={category} className="flex justify-between">
                        <span>{category}</span>
                        <span className="font-medium">₹{(amount / 1000).toFixed(0)}K</span>
                      </li>
                    ))}
                    {sortedCategories.length === 0 && <li className="text-muted-foreground">No data available</li>}
                  </ul>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-lg font-medium">
                    <PieChart className="h-5 w-5 mr-2 text-primary" />
                    Recommendations
                  </div>
                  <ul className="space-y-1 text-sm">
                    {sortedCategories.length > 0 && <li>Optimize {sortedCategories[0][0]} expenses</li>}
                    {sortedProjects.length > 0 && sortedProjects.some((p) => p.margin < 20) && (
                      <li>Increase margins on smaller projects</li>
                    )}
                    {sortedProjects.length > 0 && sortedProjects.some((p) => p.margin > 30) && (
                      <li>Focus on high-margin project types</li>
                    )}
                    {sortedCategories.length === 0 && sortedProjects.length === 0 && (
                      <li className="text-muted-foreground">Add more projects to see recommendations</li>
                    )}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
