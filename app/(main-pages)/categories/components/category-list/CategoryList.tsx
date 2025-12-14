import {Category} from "@/types/category"
import React from "react";

type Props = {
  title: string
  type: "income" | "expense"
  categories: Category[]
  onEdit: (category: Category) => void
  onDelete: (id: string) => void
}

const CategoryList: React.FC<Props> = (
  {
    title,
    type,
    categories,
    onEdit,
    onDelete,
  }) => {
  const icon = type === "income" ? "↑" : "↓"
  const color = type === "income" ? "text-green-500" : "text-red-500"

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
        <span className={color}>{icon}</span>
        <span>{title}</span>
        <span className="text-xs text-muted">({categories.length})</span>
      </h2>

      <div className="space-y-2">
        {categories.map(category => (
          <div
            key={category.id}
            className="flex items-center justify-between rounded-lg border bg-card p-4"
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full text-xl"
                style={{backgroundColor: `${category.color}20`}}
              >
                {category.icon}
              </div>
              <div>
                <p className="font-medium">{category.name}</p>
                <p className="text-xs text-muted">{type}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => onEdit(category)}>✏️</button>
              <button onClick={() => onDelete(category.id)}>🗑</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CategoryList;