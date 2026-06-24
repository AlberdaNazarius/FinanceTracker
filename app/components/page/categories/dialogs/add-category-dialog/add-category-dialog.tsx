"use client"

import React, {useCallback, useMemo} from "react"
import {Formik} from "formik"
import {Category, CategoryCreate} from "@/types/category"
import {COLOR_OPTIONS, ICON_OPTIONS} from "@/helpers/constants"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import {schema} from "./schema"
import {TransactionType} from "@/enum/transaction-type";

type Props = {
  category: Category | null
  onClose: () => void
  onSave: (values: Category) => Promise<void> | void
}

const AddCategoryDialog: React.FC<Props> = ({category, onClose, onSave}) => {
  const initialValues = useMemo<CategoryCreate>(
    () => ({
      name: category?.name ?? "",
      type: category?.type ?? TransactionType.EXPENSE,
      color: category?.color ?? "#3b82f6",
      icon: category?.icon ?? "📁",
    }),
    [category]
  );

  const handleSubmit = useCallback(
    (values: CategoryCreate) => {
      const categoryToSave: Category = {
        ...values,
        id: category?.id ?? "",
      };
      return onSave(categoryToSave);
    },
    [onSave, category?.id]
  );

  return (
    <Dialog open onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {category ? "Edit Category" : "Add New Category"}
          </DialogTitle>
        </DialogHeader>

        <Formik
          initialValues={initialValues}
          validationSchema={schema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({values, handleChange, handleSubmit, setFieldValue, touched, errors, isSubmitting}) => (
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  placeholder="e.g., Groceries"
                />
                {touched.name && errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Type */}
              {!category && (
                <div className="space-y-2">
                  <Label>Type</Label>
                  <div className="flex gap-2">
                    {([TransactionType.INCOME, TransactionType.EXPENSE] as const).map((type) => (
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
                        {type === TransactionType.INCOME ? "Income" : "Expense"}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color */}
              <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_OPTIONS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFieldValue("color", color)}
                      className={`h-8 w-8 rounded-full cursor-pointer ${
                        values.color === color ? "ring-2 ring-primary ring-offset-2" : ""
                      }`}
                      style={{backgroundColor: color}}
                      aria-label={`Select color ${color}`}
                    />
                  ))}
                </div>
              </div>

              {/* Icon */}
              <div className="space-y-2">
                <Label>Icon</Label>
                <div className="flex flex-wrap gap-2">
                  {ICON_OPTIONS.map((icon) => (
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
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isSubmitting}
                    className="flex-1 cursor-pointer"
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-2 cursor-pointer"
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
      </DialogContent>
    </Dialog>
  );
};

export default AddCategoryDialog;
