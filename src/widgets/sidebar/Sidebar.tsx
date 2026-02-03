"use client";

import { useState } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui/sheet";
import { SearchBar } from "@/features/search/ui/SearchBar";
import { FilterMenu } from "@/features/filter/ui/FilterMenu";
import { useFilters } from "@/shared/hooks/useFilters";

export function Sidebar() {
  const [open, setOpen] = useState(false);
  const { filters, setSearch, setFilters } = useFilters();

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const handleFilterChange = (newFilters: {
    category?: number;
    muscle?: number;
  }) => {
    setFilters(newFilters);
    // Close sheet after selecting filter
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed left-4 top-20 z-40 cursor-pointer hover:outline-none bg-white hover:shadow-lg"
        >
          <Filter className="h-2 w-2" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[300px] sm:w-[400px] overflow-y-auto bg-white"
      >
        <SheetHeader>
          <SheetTitle>Search & Filters</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6 pb-20">
          {/* Search Bar */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Search</h3>
            <SearchBar
              value={filters.search}
              onChange={handleSearchChange}
              placeholder="Search exercises..."
            />
          </div>

          {/* Filter Menu */}
          <FilterMenu onFilterChange={handleFilterChange} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
