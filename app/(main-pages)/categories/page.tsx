"use client"

import {useCallback, useEffect, useMemo, useState} from "react"
import {Category} from "@/types/category";
import {CategoryService} from "@/service/client/category.service";
import CategoryList from "@/components/page/categories/category-list/category-list";
import AddCategoryDialog from "@/components/page/categories/dialogs/add-category-dialog/add-category-dialog";
import PageHeader from "@/components/common/page-header/page-header";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import {toast} from "@/store/toast-store";
import {confirm} from "@/store/confirm-store";
import {Skeleton} from "@/components/ui/skeleton";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [parentForNew, setParentForNew] = useState<Category | null>(null);
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
    () => categories.filter(c => c.type === "income" && !c.parent_id),
    [categories]
  )

  const expenseCategories = useMemo(
    () => categories.filter(c => c.type === "expense" && !c.parent_id),
    [categories]
  )

  const childrenByParent = useMemo(
    () => categories.reduce<Record<string, Category[]>>((acc, category) => {
      if (!category.parent_id) return acc;
      (acc[category.parent_id] ??= []).push(category);
      return acc;
    }, {}),
    [categories]
  )

  /** ---------------- Handlers ---------------- */
  const handleAddNew = () => {
    setEditingCategory(null)
    setParentForNew(null)
    setIsDialogOpen(true)
  }

  const handleAddChild = (parent: Category) => {
    setEditingCategory(null)
    setParentForNew(parent)
    setIsDialogOpen(true)
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setParentForNew(null)
    setIsDialogOpen(true)
  }

  const handleDelete = useCallback(async (id: string) => {
    const confirmed = await confirm({
      title: "Delete category?",
      description:
        "This category and any subcategories under it will be permanently removed.",
      confirmText: "Delete",
      destructive: true,
    });
    if (!confirmed) return;

    const prev = categories;
    setCategories(prev.filter(c => c.id !== id));

    try {
      await CategoryService.deleteCategory(id)
      toast.success("Category deleted");
    } catch (err) {
      console.error(err);
      setCategories(prev);
      toast.error("Failed to delete category");
    }
  }, [categories])

  const handleSave = async (category: Category) => {
    const { id, ...categoryBody } = category;
    const prev = categories;

    try {
      if (editingCategory) {
        setCategories(p => p.map(c => (c.id === id ? category : c)));
        await CategoryService.updateCategory(id, categoryBody);
        toast.success("Category updated");
      } else {
        const tempId = crypto.randomUUID();
        const optimisticCategory = { ...categoryBody, id: tempId };

        setCategories(p => [...p, optimisticCategory]);
        const { data } = await CategoryService.addCategory(categoryBody);

        setCategories(p => p.map(c => (c.id === tempId ? data : c)));
        toast.success("Category created");
      }
      setIsDialogOpen(false);
    } catch (err) {
      console.error(err);
      setCategories(prev);
      toast.error("Failed to save category");
    }
  }

  /** ---------------- Render ---------------- */
  if (error) {
    return <p className="text-danger">{error}</p>
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <PageHeader
          title="Categories"
          subtitle="Manage your income and expense categories"
          action={
            <Button onClick={handleAddNew} className="cursor-pointer">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Category</span>
              <span className="sm:hidden">Add</span>
            </Button>
          }
        />
      </div>

      {isLoading ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {[0, 1].map((col) => (
            <div key={col} className="space-y-2">
              <Skeleton className="mb-4 h-6 w-40" />
              {[0, 1, 2].map((row) => (
                <Skeleton key={row} className="h-[72px] w-full rounded-lg" />
              ))}
            </div>
          ))}
        </div>
      ) : (
      <div className="grid gap-6 lg:grid-cols-2">
        <CategoryList
          title="Income Categories"
          type="income"
          categories={incomeCategories}
          childrenByParent={childrenByParent}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAddChild={handleAddChild}
        />

        <CategoryList
          title="Expense Categories"
          type="expense"
          categories={expenseCategories}
          childrenByParent={childrenByParent}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAddChild={handleAddChild}
        />
      </div>
      )}

      {isDialogOpen && (
        <AddCategoryDialog
          category={editingCategory}
          parent={parentForNew}
          onClose={() => setIsDialogOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}