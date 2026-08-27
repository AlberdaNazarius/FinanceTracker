"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Landmark, Receipt, Tag, Wallet } from "lucide-react";
import { Routes } from "@/enum/routes";
import { cn } from "@/helpers/utils";

const navItems = [
  {
    label: "Home",
    href: Routes.HOME,
    icon: Home,
  },
  {
    label: "Transactions",
    href: Routes.TRANSACTIONS,
    icon: Receipt,
  },
  {
    label: "Accounts",
    href: Routes.ACCOUNTS,
    icon: Landmark,
  },
  {
    label: "Categories",
    href: Routes.CATEGORIES,
    icon: Tag,
  },
  {
    label: "Budget",
    href: Routes.BUDGET,
    icon: Wallet,
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-border bg-card">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full transition-colors",
                  isActive && "bg-primary/10"
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

