import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface ProjectSummaryProps {
  quotedPrice: number
  totalPayments: number
  totalExpenses: number
  expensesByCategory: Record<string, number>
  categories: string[]
}

export function ProjectSummary({
  quotedPrice,
  totalPayments,
  totalExpenses,
  expensesByCategory,
  categories,
}: ProjectSummaryProps) {
  const paymentPercentage = Math.round((totalPayments / quotedPrice) * 100)
  const profitAmount = quotedPrice - totalExpenses
  const profitPercentage = Math.round((profitAmount / quotedPrice) * 100)

  // Sort categories by expense amount (descending)
  const sortedCategories = categories
    .filter((category) => expensesByCategory[category] > 0)
    .sort((a, b) => (expensesByCategory[b] || 0) - (expensesByCategory[a] || 0))

  // Calculate the highest expense amount for scaling the bars
  const highestExpense = Math.max(...Object.values(expensesByCategory), 1)

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Project Overview</CardTitle>
          <CardDescription>Summary of the project finances</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Payments Received</span>
              <span className="font-medium">{paymentPercentage}%</span>
            </div>
            <Progress value={paymentPercentage} className="h-2" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>₹{totalPayments.toLocaleString("en-IN")}</span>
              <span>₹{quotedPrice.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Financial Summary</h3>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Project Price:</span>
                  <span className="font-medium">₹{quotedPrice.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Expenses:</span>
                  <span className="font-medium">₹{totalExpenses.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Profit Amount:</span>
                  <span className={`font-medium ${profitAmount < 0 ? "text-destructive" : ""}`}>
                    ₹{profitAmount.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Profit Margin:</span>
                  <span
                    className={`font-medium ${profitPercentage < 20 ? "text-destructive" : profitPercentage > 30 ? "text-green-600 dark:text-green-500" : ""}`}
                  >
                    {profitPercentage}%
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Payment Status</h3>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Total Received:</span>
                  <span className="font-medium">₹{totalPayments.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Remaining Amount:</span>
                  <span className="font-medium">₹{(quotedPrice - totalPayments).toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Progress:</span>
                  <span className="font-medium">{paymentPercentage}%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Expense Breakdown</CardTitle>
          <CardDescription>Expenses by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedCategories.map((category) => (
              <div key={category} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{category}</span>
                  <span className="font-medium">₹{expensesByCategory[category].toLocaleString("en-IN")}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${(expensesByCategory[category] / highestExpense) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  {Math.round((expensesByCategory[category] / totalExpenses) * 100)}% of total expenses
                </div>
              </div>
            ))}

            {sortedCategories.length === 0 && (
              <p className="text-muted-foreground text-center py-4">No expenses recorded yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
