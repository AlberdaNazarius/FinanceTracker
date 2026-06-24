"use client"

import { useState, useMemo } from "react"
import useUserStore from "@/store/user-store"
import { TransactionType } from "@/enum/transaction-type"
import { formatMoney } from "@/helpers/utils"
import { ResponseTransaction } from "@/types/response/response-transaction"
import { Skeleton } from "@/components/ui/skeleton"

type CategorySpending = {
  id: string
  name: string
  amount: number
  color: string
  percentage: number
}

type SpendingChartProps = {
  transactions: ResponseTransaction[]
  loading?: boolean
}

const SpendingChart = ({ transactions, loading = false }: SpendingChartProps) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const user = useUserStore(state => state.user)
  const currencyCode = user?.preferredCurrency?.code

  const categorySpending = useMemo(() => {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

    const expenseTransactions = transactions.filter((transaction) => {
      if (transaction.type !== TransactionType.EXPENSE) return false
      if (!transaction.category) return false
      
      const transactionDate = new Date(transaction.transaction_date)
      return transactionDate >= startOfMonth && transactionDate <= endOfMonth
    })

    const categoryMap = new Map<string, CategorySpending>()

    expenseTransactions.forEach((transaction) => {
      if (!transaction.category) return

      const categoryId = transaction.category.id
      const categoryName = transaction.category.name
      const categoryColor = transaction.category.color || "#6366f1"
      const amount = transaction.amount || 0

      if (categoryMap.has(categoryId)) {
        const existing = categoryMap.get(categoryId)!
        existing.amount += amount
      } else {
        categoryMap.set(categoryId, {
          id: categoryId,
          name: categoryName,
          amount,
          color: categoryColor,
          percentage: 0
        })
      }
    })

    const categories = Array.from(categoryMap.values())
    const total = categories.reduce((sum, cat) => sum + cat.amount, 0)

    categories.forEach((category) => {
      category.percentage = total > 0 ? (category.amount / total) * 100 : 0
    })

    return categories.sort((a, b) => b.amount - a.amount)
  }, [transactions])

  const totalSpending = categorySpending.reduce((sum, cat) => sum + cat.amount, 0)

  return (
    <div className="rounded-[var(--radius-lg)] bg-card p-4 sm:p-6 shadow-sm border border-border">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-foreground">Spending by Category</h3>
          <p className="text-xs sm:text-sm text-muted">
            Total: {formatMoney(totalSpending, currencyCode)} this month
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3 sm:space-y-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-2.5 sm:h-3 w-full rounded-full" />
            </div>
          ))}
        </div>
      ) : categorySpending.length === 0 ? (
        <div className="py-8 text-center text-muted-foreground">
          No expenses this month
        </div>
      ) : (
        <>
          <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
            {categorySpending.map((category) => (
              <div
                key={category.id}
                className="group cursor-pointer"
                onMouseEnter={() => setActiveCategory(category.id)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                  <span className="text-xs sm:text-sm font-medium text-foreground">{category.name}</span>
                  <span className="text-xs sm:text-sm font-semibold text-foreground">
                    {formatMoney(category.amount, currencyCode)}
                  </span>
                </div>
                <div className="h-2.5 sm:h-3 bg-background rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-300 rounded-full"
                    style={{
                      width: `${category.percentage}%`,
                      backgroundColor: category.color,
                      opacity: activeCategory === category.id ? 1 : 0.8
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-border overflow-x-auto">
            {categorySpending.map((category) => (
              <div key={category.id} className="flex items-center gap-2 flex-shrink-0">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-xs text-muted">{category.name}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default SpendingChart;