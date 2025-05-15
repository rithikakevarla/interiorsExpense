import Link from "next/link"
import { MapPin, IndianRupee } from "lucide-react"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface ProjectCardProps {
  id: string
  customerName: string
  location: string
  squareFeet: number
  quotedPrice: number
  paymentsReceived: number
  expensesTotal: number
}

export function ProjectCard({
  id,
  customerName,
  location,
  squareFeet,
  quotedPrice,
  paymentsReceived,
  expensesTotal,
}: ProjectCardProps) {
  const paymentPercentage = Math.round((paymentsReceived / quotedPrice) * 100)
  const profitMargin = Math.round(((quotedPrice - expensesTotal) / quotedPrice) * 100)

  return (
    <Link href={`/projects/${id}`}>
      <Card className="h-full hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-2 line-clamp-1">{customerName}</h2>
          <div className="flex items-center text-muted-foreground mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm line-clamp-1">{location}</span>
          </div>
          <div className="text-sm text-muted-foreground mb-4">{squareFeet} sq.ft</div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Payments</span>
                <span className="font-medium">{paymentPercentage}%</span>
              </div>
              <Progress value={paymentPercentage} className="h-2" />
            </div>

            <div className="flex justify-between text-sm">
              <span className="flex items-center">
                <IndianRupee className="h-3 w-3 mr-1" />
                <span>Quoted:</span>
              </span>
              <span className="font-medium">₹{(quotedPrice / 1000).toFixed(0)}K</span>
            </div>

            <div className="flex justify-between text-sm">
              <span>Profit Margin:</span>
              <span
                className={`font-medium ${profitMargin < 20 ? "text-destructive" : profitMargin > 30 ? "text-green-600 dark:text-green-500" : ""}`}
              >
                {profitMargin}%
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <div className="w-full text-center text-sm text-muted-foreground hover:text-primary">View Details</div>
        </CardFooter>
      </Card>
    </Link>
  )
}
