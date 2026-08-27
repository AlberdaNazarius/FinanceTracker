import React from "react";
import {Archive, ArchiveRestore, SquarePen, Star, Trash2} from "lucide-react";
import {MoneyLocation} from "@/types/money-location";
import {LocationBalance} from "@/types/location-balance";
import {formatMoney} from "@/helpers/utils";

type Props = {
  locations: MoneyLocation[]
  balances: Record<string, LocationBalance>
  onEdit: (location: MoneyLocation) => void
  onToggleArchive: (location: MoneyLocation) => void
  onDelete: (id: string) => void
}

const LocationList: React.FC<Props> = ({locations, balances, onEdit, onToggleArchive, onDelete}) => {
  if (locations.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        No money locations yet. Add your card, your cash, your broker account.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {locations.map((location) => {
        const balance = balances[location.id];

        return (
          <div
            key={location.id}
            className={`flex items-center justify-between gap-3 rounded-lg border bg-card p-4 ${
              location.archived ? "opacity-60" : ""
            }`}
          >
            <div className="flex min-w-0 items-center gap-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xl pb-1"
                style={{backgroundColor: `${location.color}20`}}
              >
                {location.icon}
              </div>
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 truncate font-semibold">
                  {location.name}
                  {location.is_default && (
                    <Star className="h-3.5 w-3.5 shrink-0 fill-primary text-primary" />
                  )}
                </p>
                <p className="text-xs font-semibold text-muted">
                  {location.currency?.code}
                  {location.archived && " · archived"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <span className="mr-1 font-semibold tabular-nums sm:mr-3">
                {balance
                  ? formatMoney(balance.balance, location.currency?.code)
                  : "—"}
              </span>

              <div className="flex gap-1 text-muted">
                <button
                  type="button"
                  title="Edit"
                  className="cursor-pointer rounded-md p-2 transition-colors hover:bg-background hover:text-foreground"
                  onClick={() => onEdit(location)}
                >
                  <SquarePen className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  title={location.archived ? "Restore" : "Archive"}
                  className="cursor-pointer rounded-md p-2 transition-colors hover:bg-background hover:text-foreground"
                  onClick={() => onToggleArchive(location)}
                >
                  {location.archived
                    ? <ArchiveRestore className="h-4 w-4" />
                    : <Archive className="h-4 w-4" />}
                </button>
                <button
                  type="button"
                  title="Delete"
                  className="cursor-pointer rounded-md p-2 transition-colors hover:bg-red-50 hover:text-red-500"
                  onClick={() => onDelete(location.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default LocationList;
