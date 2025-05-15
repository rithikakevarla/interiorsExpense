"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, PlusCircle, IndianRupee } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DashboardHeader } from "@/components/dashboard-header"
import { ExpenseCategory } from "@/components/expense-category"
import { PaymentItem } from "@/components/payment-item"
import { ExpenseItem } from "@/components/expense-item"
import { ProjectSummary } from "@/components/project-summary"
import { useToast } from "@/hooks/use-toast"

interface Payment {
  _id?: string
  amount: number
  date: string
  note?: string
}

interface Expense {
  _id?: string
  category: string
  amount: number
  date: string
  note?: string
}

interface Project {
  _id: string
  customerName: string
  location: string
  squareFeet: number
  quotedPrice: number
  payments: Payment[]
  expenses: Expense[]
  categories: string[]
}

export default function ProjectDetail() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const projectId = params.id as string

  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [newPayment, setNewPayment] = useState({ amount: "", date: "", note: "" })
  const [newExpense, setNewExpense] = useState({ category: "", amount: "", date: "", note: "" })
  const [newCategory, setNewCategory] = useState("")

  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false)
  const [isSubmittingExpense, setIsSubmittingExpense] = useState(false)
  const [isSubmittingCategory, setIsSubmittingCategory] = useState(false)

  useEffect(() => {
    async function fetchProject() {
      try {
        const response = await fetch(`/api/projects/${projectId}`)

        if (!response.ok) {
          throw new Error("Failed to fetch project")
        }

        const data = await response.json()
        setProject(data)
      } catch (err) {
        console.error("Error fetching project:", err)
        setError("Failed to load project. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    if (projectId) {
      fetchProject()
    }
  }, [projectId])

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingPayment(true)

    try {
      const response = await fetch(`/api/projects/${projectId}/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number(newPayment.amount),
          date: newPayment.date,
          note: newPayment.note,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add payment")
      }

      const updatedProject = await response.json()
      setProject(updatedProject)

      toast({
        title: "Payment added",
        description: "The payment has been added successfully.",
      })

      setNewPayment({ amount: "", date: "", note: "" })
    } catch (error) {
      console.error("Error adding payment:", error)
      toast({
        title: "Error",
        description: "Failed to add payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmittingPayment(false)
    }
  }

  const handleExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingExpense(true)

    try {
      const response = await fetch(`/api/projects/${projectId}/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: newExpense.category,
          amount: Number(newExpense.amount),
          date: newExpense.date,
          note: newExpense.note,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add expense")
      }

      const updatedProject = await response.json()
      setProject(updatedProject)

      toast({
        title: "Expense added",
        description: "The expense has been added successfully.",
      })

      setNewExpense({ category: "", amount: "", date: "", note: "" })
    } catch (error) {
      console.error("Error adding expense:", error)
      toast({
        title: "Error",
        description: "Failed to add expense. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmittingExpense(false)
    }
  }

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingCategory(true)

    try {
      const response = await fetch(`/api/projects/${projectId}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: newCategory,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add category")
      }

      const updatedProject = await response.json()
      setProject(updatedProject)

      toast({
        title: "Category added",
        description: "The category has been added successfully.",
      })

      setNewCategory("")
    } catch (error) {
      console.error("Error adding category:", error)
      toast({
        title: "Error",
        description: "Failed to add category. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmittingCategory(false)
    }
  }

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

  if (error || !project) {
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
          <div className="text-center text-destructive p-4 border border-destructive/20 rounded-lg">
            {error || "Project not found"}
          </div>
        </main>
      </div>
    )
  }

  // Calculate totals
  const totalPayments = project.payments.reduce((sum, payment) => sum + payment.amount, 0)
  const totalExpenses = project.expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const remainingAmount = project.quotedPrice - totalPayments
  const profitAmount = project.quotedPrice - totalExpenses
  const profitPercentage = Math.round((profitAmount / project.quotedPrice) * 100)

  // Group expenses by category
  const expensesByCategory = project.expenses.reduce(
    (acc, expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = 0
      }
      acc[expense.category] += expense.amount
      return acc
    },
    {} as Record<string, number>,
  )

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

        <div className="mb-6">
          <h1 className="text-2xl font-bold">{project.customerName}</h1>
          <p className="text-muted-foreground">
            {project.location} • {project.squareFeet} sq.ft
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Quoted Price</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center">
                <IndianRupee className="h-5 w-5 mr-1" />
                {project.quotedPrice.toLocaleString("en-IN")}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Payments Received</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center">
                <IndianRupee className="h-5 w-5 mr-1" />
                {totalPayments.toLocaleString("en-IN")}
              </div>
              <p className="text-muted-foreground text-sm">Remaining: ₹{remainingAmount.toLocaleString("en-IN")}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center">
                <IndianRupee className="h-5 w-5 mr-1" />
                {totalExpenses.toLocaleString("en-IN")}
              </div>
              <p
                className={`text-sm ${profitPercentage < 20 ? "text-destructive" : profitPercentage > 30 ? "text-green-600 dark:text-green-500" : "text-muted-foreground"}`}
              >
                Profit Margin: {profitPercentage}%
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="payments" className="mb-6">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
          </TabsList>

          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>Track all payments received from the client</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.payments.map((payment, index) => (
                    <PaymentItem
                      key={payment._id || index}
                      amount={payment.amount}
                      date={payment.date}
                      note={payment.note}
                    />
                  ))}

                  {project.payments.length === 0 && (
                    <p className="text-muted-foreground text-center py-4">No payments recorded yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Add New Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="paymentAmount">Amount (₹)</Label>
                      <Input
                        id="paymentAmount"
                        type="number"
                        placeholder="Enter payment amount"
                        value={newPayment.amount}
                        onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="paymentDate">Date</Label>
                      <Input
                        id="paymentDate"
                        type="date"
                        value={newPayment.date}
                        onChange={(e) => setNewPayment({ ...newPayment, date: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="paymentNote">Note (Optional)</Label>
                    <Input
                      id="paymentNote"
                      placeholder="Enter any additional details"
                      value={newPayment.note}
                      onChange={(e) => setNewPayment({ ...newPayment, note: e.target.value })}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmittingPayment}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      {isSubmittingPayment ? "Adding..." : "Add Payment"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expenses" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Expense Categories</CardTitle>
                <CardDescription>Manage expense categories for the project</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-4">
                  {project.categories.map((category, index) => (
                    <ExpenseCategory key={index} name={category} amount={expensesByCategory[category] || 0} />
                  ))}
                </div>

                <form onSubmit={handleCategorySubmit} className="flex gap-2 mt-4">
                  <Input
                    placeholder="Add new category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    required
                  />
                  <Button type="submit" disabled={isSubmittingCategory}>
                    {isSubmittingCategory ? "Adding..." : "Add"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Expense History</CardTitle>
                <CardDescription>Track all expenses for the project</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.expenses.map((expense, index) => (
                    <ExpenseItem
                      key={expense._id || index}
                      category={expense.category}
                      amount={expense.amount}
                      date={expense.date}
                      note={expense.note}
                    />
                  ))}

                  {project.expenses.length === 0 && (
                    <p className="text-muted-foreground text-center py-4">No expenses recorded yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Add New Expense</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleExpenseSubmit} className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="expenseCategory">Category</Label>
                    <select
                      id="expenseCategory"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={newExpense.category}
                      onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                      required
                    >
                      <option value="">Select a category</option>
                      {project.categories.map((category, index) => (
                        <option key={index} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="expenseAmount">Amount (₹)</Label>
                      <Input
                        id="expenseAmount"
                        type="number"
                        placeholder="Enter expense amount"
                        value={newExpense.amount}
                        onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="expenseDate">Date</Label>
                      <Input
                        id="expenseDate"
                        type="date"
                        value={newExpense.date}
                        onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="expenseNote">Note (Optional)</Label>
                    <Input
                      id="expenseNote"
                      placeholder="Enter any additional details"
                      value={newExpense.note}
                      onChange={(e) => setNewExpense({ ...newExpense, note: e.target.value })}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmittingExpense}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      {isSubmittingExpense ? "Adding..." : "Add Expense"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="summary">
            <ProjectSummary
              quotedPrice={project.quotedPrice}
              totalPayments={totalPayments}
              totalExpenses={totalExpenses}
              expensesByCategory={expensesByCategory}
              categories={project.categories}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
