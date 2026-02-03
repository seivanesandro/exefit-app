"use client";

import { useState } from "react";
import { useAuth } from "@/shared/hooks/useAuth";
import { LoginButton } from "@/features/auth/ui/LoginButton";
import { LogoutButton } from "@/features/auth/ui/LogoutButton";
import { Button } from "@/shared/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/shared/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Dumbbell, Heart, Home, Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function Navbar() {
  const { user, isAuthenticated, loading } = useAuth();
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-7xl">
        {/* Logo - Always Left */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl shrink-0"
        >
          <Dumbbell className="h-6 w-6" />
          <span>ExeFit</span>
        </Link>

        {/* Desktop Navigation - Centered */}
        <div className="hidden md:flex flex-1 items-center justify-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
          >
            <Home className="h-4 w-4" />
            Home
          </Link>
          {isAuthenticated && (
            <Link
              href="/favoritos"
              className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
            >
              <Heart className="h-4 w-4" />
              Favorites
            </Link>
          )}
        </div>

        {/* Desktop Auth - Always Right */}
        <div className="hidden md:flex items-center gap-4 shrink-0">
          {loading ? (
            <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
          ) : isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full p-0"
                >
                  <Image
                    src={user.photoURL || ""}
                    alt={user.displayName}
                    width={40}
                    height={40}
                    className="rounded-full object-cover cursor-pointer"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 mt-3 bg-white"
                align="end"
                forceMount
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm text-start font-medium leading-none">
                      {user.displayName}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/favoritos" className="cursor-pointer">
                    <Heart className="mr-2 h-4 w-4" />
                    My Favorites
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <div className="w-full">
                    <LogoutButton />
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <LoginButton />
          )}
        </div>

        {/* Mobile Menu */}
        <div className="flex md:hidden items-center gap-2">
          {loading ? (
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
          ) : (
            isAuthenticated &&
            user && (
              <Image
                src={user.photoURL}
                alt={user.displayName}
                width={32}
                height={32}
                className="rounded-full object-cover"
              />
            )
          )}
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="!bg-white !text-black border-l w-[300px] sm:w-[400px]"
            >
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Dumbbell className="h-5 w-5" />
                  ExeFit
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-2 mt-8">
                <Link
                  href="/"
                  onClick={() => setSheetOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors cursor-pointer"
                >
                  <Home className="h-5 w-5" />
                  <span className="font-medium">Home</span>
                </Link>
                {isAuthenticated && (
                  <Link
                    href="/favoritos"
                    onClick={() => setSheetOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-l pointer-event hover:bg-accent transition-colors cursor-pointer"
                  >
                    <Heart className="h-5 w-5" />
                    <span className="font-medium">Favorites</span>
                  </Link>
                )}
                <div className="border-t pt-4 mt-4">
                  {loading ? (
                    <div className="h-12 bg-muted animate-pulse rounded-md" />
                  ) : isAuthenticated && user ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 px-4">
                        <Image
                          src={user.photoURL || ""}
                          alt={user.displayName}
                          width={48}
                          height={48}
                          className="rounded-full object-cover "
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">
                            {user.displayName}
                          </p>
                        </div>
                      </div>
                      <LogoutButton />
                    </div>
                  ) : (
                    <LoginButton />
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
