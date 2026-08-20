"use client"

import {CircleDollarSign, LogOut, Settings, User} from "lucide-react"
import Link from "next/link"
import {useState} from "react";
import useUserStore from "@/store/user-store";
import {AuthService} from "@/service/client/auth.service";
import {Routes} from "@/enum/routes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Button} from "@/components/ui/button";
import {useRouter, usePathname} from "next/navigation";
import {cn} from "@/helpers/utils";
import SettingsDialog from "@/components/common/settings-dialog/settings-dialog";

export default function Header() {
  const {user} = useUserStore();
  const router = useRouter();
  const pathname = usePathname()

  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleLogout = async () => {
    await AuthService.logout();
    router.replace(Routes.LOGIN);
  }

  const openSettings = () => {
    setMenuOpen(false);
    requestAnimationFrame(() => setSettingsOpen(true));
  }

  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={Routes.HOME} className="flex items-center gap-2">
            <CircleDollarSign className='h-6 w-6'/>
            <span className="text-xl font-bold text-foreground">FinTrack</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              className={cn(
                'text-sm font-semibold text-muted hover:text-primary transition-colors',
                pathname === Routes.HOME && 'text-foreground')}
              href={Routes.HOME}
            >
              Dashboard
            </Link>
            <Link
              className={cn(
                'text-sm font-semibold text-muted hover:text-primary transition-colors',
                pathname === Routes.TRANSACTIONS && 'text-foreground')}
              href={Routes.TRANSACTIONS}
            >
              Transactions
            </Link>
            <Link
              className={cn(
                'text-sm font-semibold text-muted hover:text-primary transition-colors',
                pathname === Routes.CATEGORIES && 'text-foreground')}
              href={Routes.CATEGORIES}
            >
              Categories
            </Link>
            <Link
              className={cn(
                'text-sm font-semibold text-muted hover:text-primary transition-colors',
                pathname === Routes.BUDGET && 'text-foreground')}
              href={Routes.BUDGET}
            >
              Budget
            </Link>
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex gap-1 items-center font-semibold justify-center cursor-pointer text-foreground hover:text-primary transition-colors">
                    <User className='h-5 w-5'/>
                    <span className="text-sm">{user?.username}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40 flex flex-col">
                  <Button size='sm'
                          className='text-sm text-foreground cursor-pointer w-full justify-start' variant='ghost'
                          onClick={openSettings}>
                    <Settings className='h-4 w-4'/>
                    Settings
                  </Button>
                  <Button size='sm'
                          className='text-sm text-foreground cursor-pointer w-full justify-start' variant='ghost'
                          onClick={handleLogout}>
                    <LogOut className='h-4 w-4'/>
                    Logout
                  </Button>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div>
                <Link
                  href={Routes.LOGIN}
                  className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {user && (
        <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
      )}
    </header>
  )
}