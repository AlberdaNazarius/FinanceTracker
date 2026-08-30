"use client"

import {useCallback, useMemo, useState} from "react"
import {Plus} from "lucide-react"
import {MoneyLocation, MoneyLocationRequest} from "@/types/money-location"
import {LocationBalance} from "@/types/location-balance"
import {MoneyLocationService} from "@/service/client/money-location.service"
import {useMoneyLocations} from "@/hooks/use-money-locations"
import {useBalance} from "@/hooks/use-balance"
import LocationList from "@/components/page/accounts/location-list/location-list"
import AddLocationDialog from "@/components/page/accounts/dialogs/add-location-dialog/add-location-dialog"
import PageHeader from "@/components/common/page-header/page-header"
import {Button} from "@/components/ui/button"
import {Skeleton} from "@/components/ui/skeleton"
import {toast} from "@/store/toast-store"
import {confirm} from "@/store/confirm-store"
import {formatMoney} from "@/helpers/utils"

export default function AccountsPage() {
  const {locations, loading, error, refetch} = useMoneyLocations();
  const {balance, refetch: refetchBalance} = useBalance();

  const [editingLocation, setEditingLocation] = useState<MoneyLocation | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const balancesById = useMemo(
    () =>
      balance.locations.reduce<Record<string, LocationBalance>>((acc, item) => {
        acc[item.location_id] = item;
        return acc;
      }, {}),
    [balance.locations]
  );

  const activeLocations = useMemo(
    () => locations.filter((location) => !location.archived),
    [locations]
  );

  const archivedLocations = useMemo(
    () => locations.filter((location) => location.archived),
    [locations]
  );

  const handleAddNew = () => {
    setEditingLocation(null);
    setIsDialogOpen(true);
  }

  const handleEdit = (location: MoneyLocation) => {
    setEditingLocation(location);
    setIsDialogOpen(true);
  }

  const handleSave = async (values: MoneyLocationRequest, id?: string) => {
    try {
      if (id) {
        await MoneyLocationService.updateLocation(id, values);
        toast.success("Location updated");
      } else {
        await MoneyLocationService.addLocation(values);
        toast.success("Location created");
      }
      setIsDialogOpen(false);
      await Promise.all([refetch(), refetchBalance()]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save location");
    }
  }

  const handleToggleArchive = useCallback(async (location: MoneyLocation) => {
    try {
      await MoneyLocationService.updateLocation(location.id, {
        archived: !location.archived,
      });
      toast.success(location.archived ? "Location restored" : "Location archived");
      await Promise.all([refetch(), refetchBalance()]);
    } catch (err) {
      const message =
        (err as {response?: {data?: {error?: string}}})?.response?.data?.error ??
        "Failed to update location";
      console.error(err);
      toast.error(message);
    }
  }, [refetch, refetchBalance]);

  const handleDelete = useCallback(async (id: string) => {
    const confirmed = await confirm({
      title: "Delete location?",
      description: "This can only be done while no operations reference it.",
      confirmText: "Delete",
      destructive: true,
    });
    if (!confirmed) return;

    try {
      await MoneyLocationService.deleteLocation(id);
      toast.success("Location deleted");
      await Promise.all([refetch(), refetchBalance()]);
    } catch (err) {
      const message =
        (err as {response?: {data?: {error?: string}}})?.response?.data?.error ??
        "Failed to delete location";
      console.error(err);
      toast.error(message);
    }
  }, [refetch, refetchBalance]);

  const editingHasOperations =
    !!editingLocation && (balancesById[editingLocation.id]?.balance ?? 0) !== 0;

  if (error) {
    return <p className="text-danger">Failed to load money locations</p>
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <PageHeader
          title="Accounts"
          subtitle="Where your money actually sits"
          action={
            <Button onClick={handleAddNew} className="cursor-pointer">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Location</span>
              <span className="sm:hidden">Add</span>
            </Button>
          }
        />
      </div>

      {loading ? (
        <div className="space-y-2">
          {[0, 1, 2].map((row) => (
            <Skeleton key={row} className="h-[72px] w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          <div className="space-y-3">
            <LocationList
              locations={activeLocations}
              balances={balancesById}
              onEdit={handleEdit}
              onToggleArchive={handleToggleArchive}
              onDelete={handleDelete}
            />

            {activeLocations.length > 0 && (
              <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
                <span className="text-sm font-semibold text-muted-foreground">
                  Total
                </span>
                <span className="text-lg font-bold tabular-nums">
                  {balance.ratesAvailable && balance.total !== null
                    ? formatMoney(balance.total, balance.currency)
                    : "Rates unavailable"}
                </span>
              </div>
            )}
          </div>

          {archivedLocations.length > 0 && (
            <div>
              <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Archived
              </h2>
              <LocationList
                locations={archivedLocations}
                balances={balancesById}
                onEdit={handleEdit}
                onToggleArchive={handleToggleArchive}
                onDelete={handleDelete}
              />
            </div>
          )}
        </div>
      )}

      {isDialogOpen && (
        <AddLocationDialog
          location={editingLocation}
          currencyLocked={editingHasOperations}
          onClose={() => setIsDialogOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}
