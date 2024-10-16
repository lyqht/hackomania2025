"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ComboboxProps {
  items: { value: any; label: string }[];
  buttonLabel: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  value: string;
  onValueChange: (value: string) => void;
}

export function Combobox({ items, buttonLabel, open, onOpenChange, value, onValueChange }: ComboboxProps) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label={buttonLabel}
          className="w-fit justify-between focus-visible:ring-1 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
        >
          {value
            ? items.find((item) => item.value === value)?.label
            : "Select item..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-0">
        <Command className="bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
          <CommandInput className="h-9" placeholder="Search item..." />
          <CommandList>
            <CommandEmpty>No item found.</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  className="bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? "" : currentValue)
                    onOpenChange?.(false)
                  }}
                >
                  {item.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === item.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
