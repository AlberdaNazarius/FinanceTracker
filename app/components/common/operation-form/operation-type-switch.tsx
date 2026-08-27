"use client"

import React from "react"
import {TransactionType} from "@/enum/transaction-type"
import {OperationKind} from "@/enum/operation-kind"
import {cn} from "@/helpers/utils"

export type OperationFormType = TransactionType | OperationKind.TRANSFER

const OPTIONS: {value: OperationFormType; label: string}[] = [
  {value: TransactionType.EXPENSE, label: "Expense"},
  {value: TransactionType.INCOME, label: "Income"},
  {value: OperationKind.TRANSFER, label: "Transfer"},
]

type Props = {
  value: OperationFormType
  onChange: (value: OperationFormType) => void
}

const OperationTypeSwitch: React.FC<Props> = ({value, onChange}) => (
  <div className="inline-flex w-full gap-0.5 rounded-md bg-foreground/5 p-0.5">
    {OPTIONS.map((option) => (
      <button
        key={option.value}
        type="button"
        onClick={() => onChange(option.value)}
        className={cn(
          "flex-1 cursor-pointer rounded-[0.4rem] px-3 py-1.5 text-sm font-medium transition-colors",
          value === option.value
            ? "bg-card text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        {option.label}
      </button>
    ))}
  </div>
)

export default OperationTypeSwitch;
