'use client';

import React, {useState} from 'react';
import {cn} from "@/helpers/utils";

type BalanceCardProps = {
  amount: number;
  title: string;
  numberColor?: string;
}

const BalanceCard: React.FC<BalanceCardProps> = ({amount, title, numberColor}) => {
  const [balance, setBalance] = useState(amount);

  return (
    <div className="rounded-[var(--radius-lg)] bg-card p-4 sm:p-6 shadow-sm border border-border">
      <div className="flex flex-col justify-center items-center gap-4">
        <div>
          <p className="text-sm text-muted mb-1">{title}</p>
          <h2
            className={cn(
              "text-3xl sm:text-4xl font-bold text-foreground",
              numberColor ?? `text-[${numberColor}]`
            )}>
            ${balance}
          </h2>
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