"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { useState, useRef, useCallback } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search exercises...",
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);

    // Limpa o timer anterior
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Cria novo timer de debounce (300ms)
    debounceTimer.current = setTimeout(() => {
      onChange(newValue);
    }, 300);
  };

  const handleClear = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Limpa o timer de debounce se existir
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    // Limpa imediatamente
    setLocalValue("");
    onChange("");
  }, [onChange]);

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      <Input
        type="text"
        placeholder={placeholder}
        value={localValue}
        onChange={handleInputChange}
        className="pl-10 pr-10 w-full"
      />
      {localValue && (
        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={handleClear}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 hover:bg-muted cursor-pointer"
          aria-label="Clear search"
        >
          <X className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
        </Button>
      )}
    </div>
  );
}
