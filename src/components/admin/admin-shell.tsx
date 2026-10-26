"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, ChevronDown, Inbox, LayoutDashboard, Layers, LogOut, Menu, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/app/admin/actions";

const links = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { href: "/admin/enquiries", label: "Enquiries", icon: Inbox, exact: false },
    { href: "/admin/categories", label: "Categories", icon: Layers, exact: false },
    { href: "/admin/journal", label: "Journal", icon: BookOpen, exact: false },
    { href: "/admin/settings", label: "Settings", icon: Settings, exact: false },
];

type AdminShellProps = {
    username: string;
    newCount: number;
    children: React.ReactNode;
};

function NavLinks({ newCount, onNavigate }: { newCount: number; onNavigate?: () => void }) {
    const pathname = usePathname();

    return (
        <nav aria-label="Admin" className="flex flex-col gap-1 p-3">
            {links.map(({ href, label, icon: Icon, exact }) => {
                const active = exact ? pathname === href : pathname.startsWith(href);

                return (
                    <Link
                        key={href}
                        href={href}
                        onClick={onNavigate}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                            "flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors",
                            active
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-accent hover:text-foreground",
                        )}
                    >
                        <Icon className="h-4 w-4" />
                        {label}
                        {href === "/admin/enquiries" && newCount > 0 && (
                            <Badge className="ml-auto bg-amber-500 text-white hover:bg-amber-500">{newCount}</Badge>
                        )}
                    </Link>
                );
            })}
        </nav>
    );
}

function Brand() {
    return (
        <Link href="/admin" className="flex flex-col leading-tight">
            <span className="text-sm font-semibold">House of Arshiya</span>
            <span className="text-xs text-muted-foreground">Admin</span>
        </Link>
    );
}

function UserMenu({ username }: { username: string }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-10 gap-2 px-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-semibold uppercase text-primary-foreground">
                        {username.slice(0, 1)}
                    </span>
                    <span className="hidden max-w-32 truncate text-sm sm:inline">{username}</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="truncate font-normal text-muted-foreground">
                    Signed in as {username}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/admin/settings">
                        <Settings className="h-4 w-4" />
                        Settings
                    </Link>
                </DropdownMenuItem>
                <form action={logoutAction}>
                    <DropdownMenuItem asChild>
                        <button type="submit" className="w-full">
                            <LogOut className="h-4 w-4" />
                            Sign out
                        </button>
                    </DropdownMenuItem>
                </form>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export function AdminShell({ username, newCount, children }: AdminShellProps) {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="min-h-svh lg:pl-64">
            <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r bg-card lg:flex">
                <div className="flex h-14 items-center border-b px-5">
                    <Brand />
                </div>
                <NavLinks newCount={newCount} />
            </aside>

            <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b bg-background/90 px-3 backdrop-blur sm:px-4 lg:px-8">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 lg:hidden"
                    aria-label="Open menu"
                    onClick={() => setMenuOpen(true)}
                >
                    <Menu className="h-5 w-5" />
                </Button>
                <div className="lg:hidden">
                    <Brand />
                </div>
                <div className="ml-auto">
                    <UserMenu username={username} />
                </div>
            </header>

            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
                <SheetContent side="left" className="w-72 gap-0 p-0">
                    <SheetHeader className="border-b px-5 py-4 text-left">
                        <SheetTitle>House of Arshiya</SheetTitle>
                        <SheetDescription>Admin</SheetDescription>
                    </SheetHeader>
                    <NavLinks newCount={newCount} onNavigate={() => setMenuOpen(false)} />
                </SheetContent>
            </Sheet>

            <main className="mx-auto w-full min-w-0 max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
        </div>
    );
}
