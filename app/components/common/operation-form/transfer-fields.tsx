"use client"

import React, {useEffect} from "react"
import {FormikProps} from "formik"
import {ArrowRight} from "lucide-react"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {MoneyLocation} from "@/types/money-location"
import {getCurrencySymbol} from "@/helpers/utils"
import {TransferFormValues} from "./types"

type Props = {
  form: FormikProps<TransferFormValues>
  locations: MoneyLocation[]
}

const LocationOptions: React.FC<{locations: MoneyLocation[]}> = ({locations}) => (
  <>
    {locations.map((location) => (
      <SelectItem key={location.id} value={location.id} className="cursor-pointer">
        <span>{location.icon}</span>
        {location.name}
        <span className="text-muted-foreground">
          {getCurrencySymbol(location.currency?.code)}
        </span>
      </SelectItem>
    ))}
    {locations.length === 0 && (
      <div className="p-2 text-xs text-center text-muted-foreground">
        No locations available
      </div>
    )}
  </>
);

const TransferFields: React.FC<Props> = ({form, locations}) => {
  const {values, handleChange, setFieldValue, touched, errors} = form;

  const from = locations.find((location) => location.id === values.from_location_id);
  const to = locations.find((location) => location.id === values.to_location_id);

  const fromCode = from?.currency?.code;
  const toCode = to?.currency?.code;
  const showReceived = !!fromCode && !!toCode && fromCode !== toCode;

  // Within one currency the received amount is not a separate input, so keep
  // it mirrored - the schema still requires a positive value.
  useEffect(() => {
    if (!showReceived && values.to_amount !== values.from_amount) {
      setFieldValue("to_amount", values.from_amount);
    }
  }, [showReceived, values.from_amount, values.to_amount, setFieldValue]);

  const fromAmount = Number(values.from_amount);
  const toAmount = Number(values.to_amount);
  const impliedRate =
    showReceived && fromAmount > 0 && toAmount > 0
      ? `1 ${fromCode} = ${(toAmount / fromAmount).toFixed(4)} ${toCode}`
      : null;

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-end gap-3">
        <div className="space-y-2 flex-1">
          <Label>From</Label>
          <Select
            name="from_location_id"
            value={values.from_location_id ?? ""}
            onValueChange={(val) => setFieldValue("from_location_id", val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <LocationOptions
                locations={locations.filter((l) => l.id !== values.to_location_id)}
              />
            </SelectContent>
          </Select>
          {touched.from_location_id && errors.from_location_id && (
            <p className="text-sm text-red-500 mt-1">{errors.from_location_id}</p>
          )}
        </div>

        <ArrowRight className="hidden sm:block h-4 w-4 shrink-0 mb-3 text-muted-foreground" />

        <div className="space-y-2 flex-1">
          <Label>To</Label>
          <Select
            name="to_location_id"
            value={values.to_location_id ?? ""}
            onValueChange={(val) => setFieldValue("to_location_id", val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Destination" />
            </SelectTrigger>
            <SelectContent>
              <LocationOptions
                locations={locations.filter((l) => l.id !== values.from_location_id)}
              />
            </SelectContent>
          </Select>
          {touched.to_location_id && errors.to_location_id && (
            <p className="text-sm text-red-500 mt-1">{errors.to_location_id}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="space-y-2 flex-1">
          <Label htmlFor="from_amount">Amount sent</Label>
          <div className="relative">
            <Input
              id="from_amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              className="pr-12"
              value={values.from_amount}
              onChange={handleChange}
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
              {fromCode ?? ""}
            </span>
          </div>
          {touched.from_amount && errors.from_amount && (
            <p className="text-sm text-red-500 mt-1">{errors.from_amount}</p>
          )}
        </div>

        {showReceived && (
          <div className="space-y-2 flex-1">
            <Label htmlFor="to_amount">Amount received</Label>
            <div className="relative">
              <Input
                id="to_amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                className="pr-12"
                value={values.to_amount}
                onChange={handleChange}
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
                {toCode ?? ""}
              </span>
            </div>
            {touched.to_amount && errors.to_amount ? (
              <p className="text-sm text-red-500 mt-1">{errors.to_amount}</p>
            ) : (
              impliedRate && (
                <p className="text-xs text-muted-foreground mt-1">{impliedRate}</p>
              )
            )}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="fee_amount">Fee (optional)</Label>
        <div className="relative">
          <Input
            id="fee_amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            className="pr-12"
            value={values.fee_amount}
            onChange={handleChange}
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
            {fromCode ?? ""}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          Charged on the source. This is the only part that leaves your total balance.
        </p>
        {touched.fee_amount && errors.fee_amount && (
          <p className="text-sm text-red-500 mt-1">{errors.fee_amount}</p>
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
        <Label htmlFor="transfer_date">Date</Label>
        <Input
          id="transfer_date"
          type="date"
          value={values.transfer_date}
          onChange={handleChange}
        />
      </div>
    </>
  );
}

export default TransferFields;
