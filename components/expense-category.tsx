import { IndianRupee } from "lucide-react"

interface ExpenseCategoryProps {
  name: string
  amount: number
}

export function ExpenseCategory({ name, amount }: ExpenseCategoryProps) {
  return (
    <div className="border rounded-lg p-3 hover:border-primary transition-colors">
      <div className="text-sm font-medium truncate">{name}</div>
      {amount > 0 ? (
        <div className="text-sm text-muted-foreground flex items-center mt-1">
          <IndianRupee className="h-3 w-3 mr-1" />
          {amount.toLocaleString("en-IN")}
        </div>
      ) : (
        <div className="text-sm text-muted-foreground mt-1">No expenses</div>
      )}
    </div>
  )
}
