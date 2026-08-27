"use client"

import React from "react"
import {FormikProps} from "formik"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {MoneyLocation} from "@/types/money-location"
import {GroupedCategories} from "@/hooks/use-grouped-categories"
import {getCurrencySymbol} from "@/helpers/utils"
import {TransactionFormValues} from "./types"

type Props = {
  form: FormikProps<TransactionFormValues>
  locations: MoneyLocation[]
  groupedCategories: GroupedCategories
}

const TransactionFields: React.FC<Props> = ({form, locations, groupedCategories}) => {
  const {values, handleChange, setFieldValue, touched, errors} = form;

  const selectedLocation = locations.find((location) => location.id === values.location_id);
  const categories = groupedCategories[values.type];

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="space-y-2 flex-1">
          <Label htmlFor="amount">Amount</Label>
          <div className="relative">
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              className="pr-12"
              value={values.amount}
              onChange={handleChange}
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
              {selectedLocation?.currency?.code ?? ""}
            </span>
          </div>
          {touched.amount && errors.amount && (
            <p className="text-sm text-red-500 mt-1">{errors.amount}</p>
          )}
        </div>

        <div className="space-y-2 flex-1">
          <Label>Location</Label>
          <Select
            name="location_id"
            value={values.location_id ?? ""}
            onValueChange={(val) => setFieldValue("location_id", val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((location) => (
                <SelectItem
                  key={location.id}
                  value={location.id}
                  className="cursor-pointer"
                >
                  <span>{location.icon}</span>
                  {location.name}
                  <span className="text-muted-foreground">
                    {getCurrencySymbol(location.currency?.code)}
                  </span>
                </SelectItem>
              ))}
              {locations.length === 0 && (
                <div className="p-2 text-xs text-center text-muted-foreground">
                  No locations yet
                </div>
              )}
            </SelectContent>
          </Select>
          {touched.location_id && errors.location_id && (
            <p className="text-sm text-red-500 mt-1">{errors.location_id}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Category</Label>
        <Select
          name="category_id"
          value={values.category_id ?? ""}
          onValueChange={(val) => setFieldValue("category_id", val)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories?.map((category) => (
              <SelectItem
                key={category.id}
                value={category.id}
                className="cursor-pointer"
              >
                {category.name}
              </SelectItem>
            ))}
            {!categories?.length && (
              <div className="p-2 text-xs text-center text-muted-foreground">
                No {values.type} categories found
              </div>
            )}
          </SelectContent>
        </Select>
        {touched.category_id && errors.category_id && (
          <p className="text-sm text-red-500 mt-1">{errors.category_id}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          placeholder="Add a note (optional)"
          value={values.description}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="transaction_date">Date</Label>
        <Input
          id="transaction_date"
          type="date"
          value={values.transaction_date}
          onChange={handleChange}
        />
      </div>
    </>
  );
}

export default TransactionFields;
