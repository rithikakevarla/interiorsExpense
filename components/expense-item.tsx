import { format } from "date-fns"
import { IndianRupee, Calendar, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface ExpenseItemProps {
  category: string
  amount: number
  date: string
  note?: string
}

export function ExpenseItem({ category, amount, date, note }: ExpenseItemProps) {
  // Format date - handle both ISO strings and date objects
  const formattedDate = typeof date === "string" ? format(new Date(date), "dd MMM yyyy") : format(date, "dd MMM yyyy")

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="outline">{category}</Badge>
          <div className="font-medium flex items-center">
            <IndianRupee className="h-4 w-4 mr-1" />
            {amount.toLocaleString("en-IN")}
          </div>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="h-3 w-3 mr-1" />
          {formattedDate}
        </div>
        {note && <div className="text-sm mt-1">{note}</div>}
      </div>
      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">Delete expense</span>
      </Button>
    </div>
  )
}
