"use client"

import {useState} from "react"
import {Category} from "@/types/category";
import {CATEGORIES} from "@/helpers/data";
import AddCategoryModal from "@/components/dialogs/add-category-modal/AddCategoryModal";


export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(CATEGORIES)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setCategories(categories.filter((cat) => cat.id !== id))
  }

  const handleAddNew = () => {
    setEditingCategory(null)
    setIsDialogOpen(true)
  }

  const incomeCategories = categories.filter((cat) => cat.type === "income")
  const expenseCategories = categories.filter((cat) => cat.type === "expense")

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Categories</h1>
          <p className="text-sm text-muted mt-1">Manage your income and expense categories</p>
        </div>
        <button
          onClick={handleAddNew}
          className="cursor-pointer flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
          </svg>
          <span className="hidden sm:inline">Add Category</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Income Categories */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-foreground flex items-center gap-2">
            <span className="text-green-500">↑</span>
            <span>Income Categories</span>
            <span className="text-xs font-normal text-muted">({incomeCategories.length})</span>
          </h2>
          <div className="space-y-2">
            {incomeCategories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between rounded-lg border border-border bg-card p-4 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full text-xl"
                    style={{backgroundColor: `${category.color}20`}}
                  >
                    {category.icon}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{category.name}</p>
                    <p className="text-xs text-muted">Income</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="rounded-md p-2 text-muted hover:bg-background hover:text-foreground transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="rounded-md p-2 text-muted hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expense Categories */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-foreground flex items-center gap-2">
            <span className="text-red-500">↓</span>
            <span>Expense Categories</span>
            <span className="text-xs font-normal text-muted">({expenseCategories.length})</span>
          </h2>
          <div className="space-y-2">
            {expenseCategories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between rounded-lg border border-border bg-card p-4 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full text-xl"
                    style={{backgroundColor: `${category.color}20`}}
                  >
                    {category.icon}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{category.name}</p>
                    <p className="text-xs text-muted">Expense</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="rounded-md p-2 text-muted hover:bg-background hover:text-foreground transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="rounded-md p-2 text-muted hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isDialogOpen && (
        <AddCategoryModal
          category={editingCategory}
          onClose={() => setIsDialogOpen(false)}
          onSave={(category) => {
            if (editingCategory) {
              setCategories(categories.map((cat) => (cat.id === category.id ? category : cat)))
            } else {
              setCategories([...categories, { ...category, id: Date.now().toString() }])
            }
            setIsDialogOpen(false)
          }}
        />
      )}
    </div>
  )
}