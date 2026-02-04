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
import { FilterMenu } from "@/features/filter/ui/FilterMenu";
import { useFilters } from "@/shared/hooks/useFilters";

export function Sidebar() {
  const [open, setOpen] = useState(false);
  const { setFilters } = useFilters();

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
          <SheetTitle>Filters</SheetTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Filter exercises by category or muscle group
          </p>
        </SheetHeader>

        <div className="mt-6 space-y-6 pb-20">
          {/* Filter Menu */}
          <FilterMenu onFilterChange={handleFilterChange} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
