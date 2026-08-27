"use client"

import React, {useCallback, useMemo} from "react"
import {Formik} from "formik"
import {MoneyLocation, MoneyLocationRequest} from "@/types/money-location"
import {COLOR_OPTIONS, CURRENCIES, DEFAULT_CURRENCY, LOCATION_ICON_OPTIONS} from "@/helpers/constants"
import {getCurrencySymbol} from "@/helpers/utils"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Switch} from "@/components/ui/switch"
import {schema} from "./schema"

type Props = {
  location: MoneyLocation | null
  /** Currency is locked once money has moved through the location. */
  currencyLocked?: boolean
  onClose: () => void
  onSave: (values: MoneyLocationRequest, id?: string) => Promise<void> | void
}

const AddLocationDialog: React.FC<Props> = ({location, currencyLocked, onClose, onSave}) => {
  const initialValues = useMemo<MoneyLocationRequest>(
    () => ({
      name: location?.name ?? "",
      currency_id: location?.currency?.id ?? DEFAULT_CURRENCY.id,
      color: location?.color ?? "#3b82f6",
      icon: location?.icon ?? "💳",
      is_default: location?.is_default ?? false,
    }),
    [location]
  );

  const handleSubmit = useCallback(
    (values: MoneyLocationRequest) => onSave(values, location?.id),
    [onSave, location?.id]
  );

  return (
    <Dialog open onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {location ? "Edit Location" : "Add Money Location"}
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
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  placeholder="e.g., Mono Card"
                />
                {touched.name && errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Currency */}
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select
                  name="currency_id"
                  value={String(values.currency_id)}
                  disabled={currencyLocked}
                  onValueChange={(val) => setFieldValue("currency_id", Number(val))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((currency) => (
                      <SelectItem
                        key={currency.id}
                        value={String(currency.id)}
                        className="cursor-pointer"
                      >
                        <span className="font-semibold">
                          {getCurrencySymbol(currency.code)}
                        </span>
                        {currency.code} - {currency.unit_text}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {currencyLocked && (
                  <p className="text-xs text-muted-foreground">
                    This location already holds operations, so its currency is fixed.
                  </p>
                )}
                {touched.currency_id && errors.currency_id && (
                  <p className="text-sm text-red-500">{errors.currency_id}</p>
                )}
              </div>

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
                  {LOCATION_ICON_OPTIONS.map((icon) => (
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

              {/* Default */}
              <div className="flex items-center justify-between gap-4 rounded-md border border-border px-3.5 py-2.5">
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    Default location
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    Pre-selected when you add a transaction.
                  </div>
                </div>
                <Switch
                  checked={!!values.is_default}
                  disabled={location?.is_default}
                  onCheckedChange={(checked) => setFieldValue("is_default", checked)}
                />
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
                    : location
                      ? "Save Changes"
                      : "Add Location"}
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default AddLocationDialog;
