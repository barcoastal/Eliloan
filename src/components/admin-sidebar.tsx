"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboardIcon,
  SettingsIcon,
  LogOutIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboardIcon },
  { href: "/admin/settings", label: "Settings", icon: SettingsIcon },
];

export function AdminSidebar({ userName }: { userName: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 flex-col bg-slate-900 text-slate-100">
      <div className="flex items-center gap-2 border-b border-slate-700 px-5 py-4">
        <span className="text-base font-semibold">1099 Loan Portal</span>
        <Badge className="bg-slate-700 text-slate-200 text-[10px]">
          Admin
        </Badge>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-700 px-3 py-4">
        <p className="mb-3 truncate px-3 text-xs text-slate-400">{userName}</p>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-3 text-slate-400 hover:bg-slate-800 hover:text-white"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
        >
          <LogOutIcon className="size-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
