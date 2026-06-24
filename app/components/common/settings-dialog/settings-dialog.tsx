"use client"

import React, { useEffect, useMemo, useState } from "react"
import { User as UserIcon, SlidersHorizontal } from "lucide-react"
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
import { CURRENCIES } from "@/helpers/constants"
import { cn, getCurrencySymbol } from "@/helpers/utils"
import useUserStore from "@/store/user-store"
import { UserService } from "@/service/client/user.service"
import { toast } from "@/store/toast-store"
import { useTheme, ThemeMode } from "@/hooks/use-theme"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Currency } from "@/types/currency"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type SectionId = "profile" | "preferences"

const THEME_OPTIONS: ThemeMode[] = ["light", "dark", "system"]

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
  const [saving, setSaving] = useState(false)

  // Re-sync the pending currency selection whenever the dialog (re)opens.
  useEffect(() => {
    if (open) {
      setCurrencyId(user?.preferredCurrency?.id ?? null)
    }
  }, [open, user])

  const profileContent = (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-foreground">Username</span>
      <div className="rounded-md border border-border bg-card px-3.5 py-2.5 text-sm text-foreground">
        {user?.username ?? "—"}
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
              <SelectItem key={currency.id} value={String(currency.id)}>
                <span className="font-semibold">
                  {getCurrencySymbol(currency.code)}
                </span>
                {currency.code} — {currency.unit_text}
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

  const sections = useMemo(
    () => [
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
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, currencyId, mode]
  )

  const active = sections.find((section) => section.id === activeSection) ?? sections[0]

  const handleCancel = () => {
    setCurrencyId(user?.preferredCurrency?.id ?? null)
    onOpenChange(false)
  }

  const handleSave = async () => {
    const changed = currencyId != null && currencyId !== user?.preferredCurrency?.id

    if (changed) {
      try {
        setSaving(true)
        const response = await UserService.updateUser({
          preferred_currency_id: currencyId!,
        })
        const data = response?.data
        const preferredCurrency: Currency = Array.isArray(data?.preferredCurrency)
          ? data.preferredCurrency[0]
          : data?.preferredCurrency

        setUser({
          username: data?.username ?? user!.username,
          preferredCurrency,
        })
        toast.success("Settings saved")
      } catch (error) {
        console.error("Failed to save settings:", error)
        toast.error("Failed to save settings")
        setSaving(false)
        return
      }
      setSaving(false)
    }

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
