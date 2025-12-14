"use client"

import React, {useCallback, useEffect, useMemo} from "react"
import {Formik} from "formik"
import {Category, CategoryCreate} from "@/types/category"
import {COLOR_OPTIONS, ICON_OPTIONS} from "@/helpers/data"
import {Button} from "@/components/ui/button"
import {schema} from "./schema"

type Props = {
  category: Category | null
  onClose: () => void
  onSave: (values: Category) => Promise<void> | void
}

const AddCategoryModal: React.FC<Props> = (
  {
    category,
    onClose,
    onSave,
  }) => {
  /** ---------------- Initial values ---------------- */
  const initialValues = useMemo<CategoryCreate>(
    () => ({
      name: category?.name ?? "",
      type: category?.type ?? "expense",
      color: category?.color ?? "#3b82f6",
      icon: category?.icon ?? "📁",
    }),
    [category]
  );

  /** ---------------- Escape key ---------------- */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose])

  /** ---------------- Submit ---------------- */
  const handleSubmit = useCallback(
    (values: CategoryCreate) => {
      const categoryToSave: Category = {
        ...values,
        id: category?.id ?? "",
      };
      return onSave(categoryToSave);
    },
    [onSave, category?.id]
  )

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-bold">
          {category ? "Edit Category" : "Add New Category"}
        </h2>

        <Formik
          initialValues={initialValues}
          validationSchema={schema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({
              values,
              handleChange,
              handleSubmit,
              setFieldValue,
              touched,
              errors,
              isSubmitting,
            }) => (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Category Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={values.name}
                  onChange={handleChange}
                  className="w-full rounded-md border px-3 py-2 text-sm focus:ring-1 focus:ring-primary"
                  placeholder="e.g., Groceries"
                />
                {touched.name && errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <div className="flex gap-2">
                  {(["income", "expense"] as const).map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFieldValue("type", type)}
                      className={`flex-1 rounded-md border px-4 py-2 text-sm font-semibold cursor-pointer ${
                        values.type === type
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border hover:bg-accent"
                      }`}
                    >
                      {type === "income" ? "Income" : "Expense"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div className="space-y-2">
                <label className="text-sm font-semibold">Color</label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_OPTIONS.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFieldValue("color", color)}
                      className={`h-8 w-8 rounded-full cursor-pointer ${
                        values.color === color
                          ? "ring-2 ring-primary ring-offset-2"
                          : ""
                      }`}
                      style={{backgroundColor: color}}
                      aria-label={`Select color ${color}`}
                    />
                  ))}
                </div>
              </div>

              {/* Icon */}
              <div className="space-y-2">
                <label className="text-sm font-semibold">Icon</label>
                <div className="flex flex-wrap gap-2">
                  {ICON_OPTIONS.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFieldValue("icon", icon)}
                      className={`flex h-10 w-10 items-center justify-center rounded-md border text-xl cursor-pointer ${
                        values.icon === icon
                          ? "border-primary bg-primary/10"
                          : "border-border hover:bg-accent"
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="flex-1 cursor-pointer"
                >
                  Cancel
                </Button>

                <Button
                  className='cursor-pointer flex-2'
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Saving..."
                    : category
                      ? "Save Changes"
                      : "Add Category"}
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default AddCategoryModal