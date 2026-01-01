"use client"

import { useState } from "react"

const SpendingChart = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const categories = [
    { name: "Housing", amount: 1800, color: "bg-[oklch(0.5_0.2_260)]", percentage: 36 },
    { name: "Food", amount: 850, color: "bg-[oklch(0.6_0.15_145)]", percentage: 17 },
    { name: "Transport", amount: 450, color: "bg-[oklch(0.45_0.18_165)]", percentage: 9 },
    { name: "Entertainment", amount: 380, color: "bg-[oklch(0.75_0.12_85)]", percentage: 8 },
    { name: "Shopping", amount: 620, color: "bg-[oklch(0.55_0.22_25)]", percentage: 12 },
    { name: "Others", amount: 900, color: "bg-[oklch(0.45_0_0)]", percentage: 18 },
  ]

  return (
    <div className="rounded-[var(--radius-lg)] bg-card p-4 sm:p-6 shadow-sm border border-border">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-foreground">Spending by Category</h3>
          <p className="text-xs sm:text-sm text-muted">Total: $5,000.00 this month</p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
        {categories.map((category) => (
          <div
            key={category.name}
            className="group cursor-pointer"
            onMouseEnter={() => setActiveCategory(category.name)}
            onMouseLeave={() => setActiveCategory(null)}
          >
            <div className="flex items-center justify-between mb-1.5 sm:mb-2">
              <span className="text-xs sm:text-sm font-medium text-foreground">{category.name}</span>
              <span className="text-xs sm:text-sm font-semibold text-foreground">${category.amount}</span>
            </div>
            <div className="h-2.5 sm:h-3 bg-background rounded-full overflow-hidden">
              <div
                className={`h-full ${category.color} transition-all duration-300 rounded-full ${
                  activeCategory === category.name ? "opacity-100" : "opacity-80"
                }`}
                style={{ width: `${category.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-border overflow-x-auto">
        {categories.map((category) => (
          <div key={category.name} className="flex items-center gap-2 flex-shrink-0">
            <div className={`h-3 w-3 rounded-full ${category.color}`} />
            <span className="text-xs text-muted">{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SpendingChart;