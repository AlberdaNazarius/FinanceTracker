'use client'

import {Category} from "@/types/category";
import React, {useState} from "react";
import {COLOR_OPTIONS, ICON_OPTIONS} from "@/helpers/data";
import {Button} from "@/components/ui/button";

type Props = {
  category: Category | null
  onClose: () => void
  onSave: (category: Category) => void
}

const AddCategoryModal: React.FC<Props> = ({category, onClose, onSave}) => {
  const [formData, setFormData] = useState<Omit<Category, "id">>({
    name: category?.name || "",
    type: category?.type || "expense",
    color: category?.color || "#3b82f6",
    icon: category?.icon || "📁",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({...formData, id: category?.id || Date.now().toString()})
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-bold text-foreground">{category ? "Edit Category" : "Add New Category"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Category Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="e.g., Groceries"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Type</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFormData({...formData, type: "income"})}
                className={`flex-1 rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                  formData.type === "income"
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground hover:bg-accent"
                }`}
              >
                Income
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, type: "expense"})}
                className={`flex-1 rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                  formData.type === "expense"
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground hover:bg-accent"
                }`}
              >
                Expense
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Color</label>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({...formData, color})}
                  className={`h-8 w-8 rounded-full transition-all ${
                    formData.color === color ? "ring-2 ring-primary ring-offset-2" : ""
                  }`}
                  style={{backgroundColor: color}}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Icon</label>
            <div className="flex flex-wrap gap-2">
              {ICON_OPTIONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setFormData({...formData, icon})}
                  className={`flex h-10 w-10 items-center justify-center rounded-md border text-xl transition-all ${
                    formData.icon === icon
                      ? "border-primary bg-primary/10"
                      : "border-border bg-background hover:bg-accent"
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant='ghost'
              onClick={onClose}
              className="flex-1 text-sm font-semibold text-foreground"
            >
              Cancel
            </Button>
            <button
              type="submit"
              className="flex-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {category ? "Save Changes" : "Add Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddCategoryModal