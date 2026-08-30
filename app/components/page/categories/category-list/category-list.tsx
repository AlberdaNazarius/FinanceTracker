import {Category} from "@/types/category"
import React from "react";
import {Plus, SquarePen, Trash2} from "lucide-react";

type Props = {
  title: string
  type: "income" | "expense"
  categories: Category[]
  childrenByParent: Record<string, Category[]>
  onEdit: (category: Category) => void
  onDelete: (id: string) => void
  onAddChild: (parent: Category) => void
}

const CategoryRow: React.FC<{
  category: Category
  nested?: boolean
  onEdit: (category: Category) => void
  onDelete: (id: string) => void
  onAddChild?: (parent: Category) => void
}> = ({category, nested, onEdit, onDelete, onAddChild}) => (
  <div
    className={`flex items-center justify-between rounded-lg border bg-card p-4 ${
      nested ? "ml-6 border-dashed" : ""
    }`}
  >
    <div className="flex items-center gap-3">
      <div
        className={`flex items-center justify-center rounded-full pb-1 ${
          nested ? "h-8 w-8 text-base" : "h-10 w-10 text-xl"
        }`}
        style={{backgroundColor: `${category.color}20`}}
      >
        {category.icon}
      </div>
      <p className={nested ? "text-sm font-medium" : "font-semibold"}>{category.name}</p>
    </div>

    <div className="flex gap-1 text-muted">
      {onAddChild && (
        <button
          type="button"
          title="Add subcategory"
          className="rounded-md p-2 transition-colors hover:bg-background hover:text-foreground cursor-pointer"
          onClick={() => onAddChild(category)}
        >
          <Plus className="h-4 w-4"/>
        </button>
      )}
      <button
        type="button"
        title="Edit"
        className="rounded-md p-2 transition-colors hover:bg-background hover:text-foreground cursor-pointer"
        onClick={() => onEdit(category)}
      >
        <SquarePen className="h-4 w-4"/>
      </button>
      <button
        type="button"
        title="Delete"
        className="rounded-md p-2 transition-colors hover:bg-red-50 hover:text-red-500 cursor-pointer"
        onClick={() => onDelete(category.id)}
      >
        <Trash2 className="h-4 w-4"/>
      </button>
    </div>
  </div>
)

const CategoryList: React.FC<Props> = (
  {
    title,
    type,
    categories,
    childrenByParent,
    onEdit,
    onDelete,
    onAddChild,
  }) => {
  const icon = type === "income" ? "↑" : "↓"
  const color = type === "income" ? "text-green-500" : "text-red-500"

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
        <span className={color}>{icon}</span>
        <span>{title}</span>
        <span className="text-xs text-muted font-semibold">({categories.length})</span>
      </h2>

      <div className="space-y-2">
        {categories.map(category => (
          <div key={category.id} className="space-y-2">
            <CategoryRow
              category={category}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddChild={onAddChild}
            />
            {childrenByParent[category.id]?.map((child) => (
              <CategoryRow
                key={child.id}
                category={child}
                nested
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CategoryList;
