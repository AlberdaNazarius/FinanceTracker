"use client"

import React, { useEffect, useState } from "react"
import { Check, LayoutDashboard, User as UserIcon, SlidersHorizontal } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { CURRENCIES } from "@/helpers/constants"
import { cn, getCurrencySymbol } from "@/helpers/utils"
import useUserStore from "@/store/user-store"
import { UserService } from "@/service/client/user.service"
import { MoneyLocationService } from "@/service/client/money-location.service"
import { toast } from "@/store/toast-store"
import { useTheme, ThemeMode } from "@/hooks/use-theme"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Currency } from "@/types/currency"
import { MoneyLocation } from "@/types/money-location"
import {
  DashboardSettings,
  DEFAULT_DASHBOARD_SETTINGS,
} from "@/types/dashboard-settings"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type SectionId = "profile" | "preferences" | "dashboard"

const THEME_OPTIONS: ThemeMode[] = ["light", "dark", "system"]

const WIDGET_TOGGLES: {
  key: keyof Omit<DashboardSettings, "accountIds">
  title: string
  description: string
}[] = [
  {
    key: "showBalance",
    title: "Total balance",
    description: "The hero card at the top of the dashboard.",
  },
  {
    key: "showSpendingChart",
    title: "Spending chart",
    description: "Expenses of the current month, broken down by category.",
  },
  {
    key: "showBudgetOverview",
    title: "Budget overview",
    description: "Progress against your active budgets.",
  },
  {
    key: "showAccounts",
    title: "Accounts",
    description: "How much sits in each money location.",
  },
]

function SettingRow({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <div className="sm:max-w-[18rem]">
        <div className="text-sm font-semibold text-foreground">{title}</div>
        {description && (
          <div className="mt-0.5 text-xs text-muted-foreground">{description}</div>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

function ThemeSegmented({
  mode,
  setMode,
}: {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
}) {
  return (
    <div className="inline-flex gap-0.5 rounded-md bg-foreground/5 p-0.5">
      {THEME_OPTIONS.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setMode(option)}
          className={cn(
            "cursor-pointer rounded-[0.4rem] px-3.5 py-1.5 text-sm font-medium capitalize transition-colors",
            mode === option
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {option}
        </button>
      ))}
    </div>
  )
}

const SettingsDialog: React.FC<Props> = ({ open, onOpenChange }) => {
  const { user, setUser } = useUserStore()
  const { mode, setMode } = useTheme()
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const [activeSection, setActiveSection] = useState<SectionId>("profile")
  const [currencyId, setCurrencyId] = useState<number | null>(
    user?.preferredCurrency?.id ?? null
  )
  const [dashboard, setDashboard] = useState<DashboardSettings>(
    user?.dashboardSettings ?? DEFAULT_DASHBOARD_SETTINGS
  )
  const [locations, setLocations] = useState<MoneyLocation[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return

    setCurrencyId(user?.preferredCurrency?.id ?? null)
    setDashboard(user?.dashboardSettings ?? DEFAULT_DASHBOARD_SETTINGS)
  }, [open, user])

  useEffect(() => {
    if (!open) return

    let mounted = true

    MoneyLocationService.getLocations()
      .then(({ data }) => {
        if (mounted) setLocations((data ?? []).filter((l) => !l.archived))
      })
      .catch((error) => console.error("Failed to load locations:", error))

    return () => {
      mounted = false
    }
  }, [open])

  const toggleAccount = (id: string) => {
    setDashboard((prev) => {
      const current = prev.accountIds ?? locations.map((l) => l.id)
      const next = current.includes(id)
        ? current.filter((accountId) => accountId !== id)
        : [...current, id]

        return {
        ...prev,
        accountIds: next.length === locations.length ? null : next,
      }
    })
  }

  const isAccountVisible = (id: string) =>
    dashboard.accountIds === null || dashboard.accountIds.includes(id)

  const profileContent = (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-foreground">Username</span>
      <div className="rounded-md border border-border bg-card px-3.5 py-2.5 text-sm text-foreground">
        {user?.username ?? "-"}
      </div>
    </div>
  )

  const preferencesContent = (
    <div className="flex flex-col gap-5">
      <SettingRow
        title="Currency"
        description="Applied to every balance and report."
      >
        <Select
          value={currencyId != null ? String(currencyId) : ""}
          onValueChange={(value) => setCurrencyId(Number(value))}
        >
          <SelectTrigger className="w-full min-w-48">
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
      </SettingRow>

      <div className="h-px bg-border" />

      <SettingRow title="Theme" description="Default appearance of the app.">
        <ThemeSegmented mode={mode} setMode={setMode} />
      </SettingRow>
    </div>
  )

  const dashboardContent = (
    <div className="flex flex-col gap-5">
      {WIDGET_TOGGLES.map((widget) => (
        <SettingRow
          key={widget.key}
          title={widget.title}
          description={widget.description}
        >
          <Switch
            checked={dashboard[widget.key]}
            onCheckedChange={(checked) =>
              setDashboard((prev) => ({ ...prev, [widget.key]: checked }))
            }
          />
        </SettingRow>
      ))}

      {dashboard.showAccounts && (
        <>
          <div className="h-px bg-border" />

          <div className="flex flex-col gap-2">
            <div className="text-sm font-semibold text-foreground">
              Locations on the dashboard
            </div>
            <div className="text-xs text-muted-foreground">
              Pick which balances show in the Accounts card.
            </div>

            <div className="mt-2 flex flex-col gap-1">
              {locations.map((location) => {
                const visible = isAccountVisible(location.id)

                return (
                  <button
                    key={location.id}
                    type="button"
                    onClick={() => toggleAccount(location.id)}
                    className={cn(
                      "flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors",
                      visible
                        ? "bg-primary/10 text-foreground"
                        : "text-muted-foreground hover:bg-accent/50"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <span>{location.icon}</span>
                      {location.name}
                      <span className="text-xs text-muted-foreground">
                        {location.currency?.code}
                      </span>
                    </span>
                    {visible && <Check className="h-4 w-4 text-primary" />}
                  </button>
                )
              })}
              {locations.length === 0 && (
                <p className="py-2 text-xs text-muted-foreground">
                  No money locations yet.
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )

  const sections = [
    {
      id: "profile" as const,
      label: "Profile",
      icon: UserIcon,
      content: profileContent,
    },
    {
      id: "preferences" as const,
      label: "Preferences",
      icon: SlidersHorizontal,
      content: preferencesContent,
    },
    {
      id: "dashboard" as const,
      label: "Dashboard",
      icon: LayoutDashboard,
      content: dashboardContent,
    },
  ]

  const active = sections.find((section) => section.id === activeSection) ?? sections[0]

  const handleCancel = () => {
    setCurrencyId(user?.preferredCurrency?.id ?? null)
    setDashboard(user?.dashboardSettings ?? DEFAULT_DASHBOARD_SETTINGS)
    onOpenChange(false)
  }

  const handleSave = async () => {
    const currencyChanged =
      currencyId != null && currencyId !== user?.preferredCurrency?.id
    const dashboardChanged =
      JSON.stringify(dashboard) !== JSON.stringify(user?.dashboardSettings)

    if (!currencyChanged && !dashboardChanged) {
      onOpenChange(false)
      return
    }

    try {
      setSaving(true)
      const response = await UserService.updateUser({
        ...(currencyChanged ? { preferred_currency_id: currencyId! } : {}),
        ...(dashboardChanged ? { dashboard_settings: dashboard } : {}),
      })
      const data = response?.data
      const preferredCurrency: Currency = Array.isArray(data?.preferredCurrency)
        ? data.preferredCurrency[0]
        : data?.preferredCurrency

      setUser({
        username: data?.username ?? user!.username,
        preferredCurrency,
        dashboardSettings: data?.dashboard_settings ?? dashboard,
      })
      toast.success("Settings saved")
    } catch (error) {
      console.error("Failed to save settings:", error)
      toast.error("Failed to save settings")
      setSaving(false)
      return
    }

    setSaving(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-3xl">
        <div className="flex max-h-[85vh] flex-col">
          <DialogHeader className="border-b border-border px-6 py-4 text-left">
            <DialogTitle className="text-lg font-bold">Settings</DialogTitle>
            <DialogDescription>
              Manage your account and preferences
            </DialogDescription>
          </DialogHeader>

          {isDesktop ? (
            <div className="flex min-h-88">
              {/* Sidebar nav */}
              <nav className="flex w-52 shrink-0 flex-col gap-1 border-r border-border bg-card/40 p-3">
                {sections.map((section) => {
                  const isActive = section.id === activeSection
                  return (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => setActiveSection(section.id)}
                      className={cn(
                        "flex cursor-pointer items-center gap-2.5 rounded-md px-3 py-2.5 text-left text-sm transition-colors",
                        isActive
                          ? "bg-primary/10 font-semibold text-primary"
                          : "font-medium text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                      )}
                    >
                      <section.icon className="h-4 w-4" />
                      {section.label}
                    </button>
                  )
                })}
              </nav>

              {/* Active section content */}
              <div className="flex-1 overflow-y-auto p-6">
                <h3 className="mb-5 text-base font-bold text-foreground">
                  {active.label}
                </h3>
                {active.content}
              </div>
            </div>
          ) : (
            // Single scroll: every section stacked
            <div className="flex flex-1 flex-col gap-7 overflow-y-auto p-5">
              {sections.map((section) => (
                <div key={section.id} className="flex flex-col gap-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {section.label}
                  </div>
                  {section.content}
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-3 border-t border-border bg-card/40 px-6 py-4">
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              className="cursor-pointer"
              onClick={handleSave}
              disabled={saving}
            >
              Save changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SettingsDialog
