"use client"

import {useCallback, useEffect, useMemo, useState} from "react"
import {Category} from "@/types/category";
import AddCategoryModal from "@/components/dialogs/add-category-modal/AddCategoryModal";
import {CategoryService} from "@/service/category.service";
import CategoryList from "./components/category-list/CategoryList";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /** ---------------- Fetch ---------------- */
  useEffect(() => {
    let mounted = true;

    async function fetchCategories() {
      try {
        const { data } = await CategoryService.getCategories();
        if (mounted) setCategories(data);
      } catch (err) {
        console.error(err)
        setError("Failed to load categories");
      } finally {
        setIsLoading(false);
      }
    }

    fetchCategories();
    return () => {
      mounted = false
    };
  }, [])

  /** ---------------- Derived data ---------------- */
  const incomeCategories = useMemo(
    () => categories.filter(c => c.type === "income"),
    [categories]
  )

  const expenseCategories = useMemo(
    () => categories.filter(c => c.type === "expense"),
    [categories]
  )

  /** ---------------- Handlers ---------------- */
  const handleAddNew = () => {
    setEditingCategory(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setIsDialogOpen(true)
  }

  const handleDelete = useCallback(async (id: string) => {
    const prev = categories;
    setCategories(prev.filter(c => c.id !== id));

    try {
      await CategoryService.deleteCategory(id)
    } catch (err) {
      console.error(err);
      setCategories(prev);
    }
  }, [categories])

  const handleSave = async (category: Category) => {
    const { id, ...categoryBody } = category;

    if (editingCategory) {
      setCategories(prev =>
        prev.map(c => (c.id === id ? category : c))
      )

      await CategoryService.updateCategory(id, categoryBody);
    } else {
      const tempId = crypto.randomUUID();
      const optimisticCategory = { ...categoryBody, id: tempId };

      setCategories(prev => [...prev, optimisticCategory]);
      const { data } = await CategoryService.addCategory(categoryBody);

      // replace temp id
      setCategories(prev =>
        prev.map(c => (c.id === tempId ? data : c))
      );
    }

    setIsDialogOpen(false);
  }

  /** ---------------- Render ---------------- */
  if (isLoading) {
    return <p className="text-muted">Loading categories…</p>
  }

  if (error) {
    return <p className="text-red-500">{error}</p>
  }

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
        <CategoryList
          title="Income Categories"
          type="income"
          categories={incomeCategories}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <CategoryList
          title="Expense Categories"
          type="expense"
          categories={expenseCategories}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {isDialogOpen && (
        <AddCategoryModal
          category={editingCategory}
          onClose={() => setIsDialogOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}