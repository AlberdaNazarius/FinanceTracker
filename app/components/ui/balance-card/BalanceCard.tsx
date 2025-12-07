'use client';

import React, {useState} from 'react';

const BalanceCard: React.FC = ({}) => {
  const [balance, setBalance] = useState(24582.00);

  const [period, setPeriod] = useState<"day" | "week" | "month" | "year">("month")

  return (
    <div className="rounded-[var(--radius-lg)] bg-card p-4 sm:p-6 shadow-sm border border-border">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4 sm:mb-6">
        <div>
          <p className="text-sm text-muted mb-1">Total Balance</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">${balance}</h2>
          {/*<p className="text-sm text-success mt-1 flex items-center gap-1">*/}
          {/*  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">*/}
          {/*    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />*/}
          {/*  </svg>*/}
          {/*  +12.5% from last month*/}
          {/*</p>*/}
        </div>

        {/* Period Selector */}
        <div className="flex gap-1 bg-background rounded-lg p-1 w-full sm:w-auto">
          {(["day", "week", "month", "year"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`flex-1 sm:flex-initial px-2 sm:px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                period === p ? "bg-card text-foreground shadow-sm" : "text-muted hover:text-foreground"
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Mini Chart Visualization */}
      {/*<div className="flex items-end gap-1 h-16 sm:h-20">*/}
      {/*  {[45, 52, 48, 65, 58, 72, 68, 75, 70, 82, 78, 85].map((height, i) => (*/}
      {/*    <div key={i} className="flex-1 bg-primary/20 rounded-t-sm relative overflow-hidden">*/}
      {/*      <div*/}
      {/*        className="absolute bottom-0 w-full bg-primary rounded-t-sm transition-all duration-300"*/}
      {/*        style={{ height: `${height}%` }}*/}
      {/*      />*/}
      {/*    </div>*/}
      {/*  ))}*/}
      {/*</div>*/}
    </div>
  );
}

export default BalanceCard;