"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface TimePickerSimpleProps {
  time?: string;
  onTimeChange?: (time: string) => void;
  label?: string;
  id?: string;
  className?: string;
  slots?: string[];
}

const DEFAULT_SLOTS = [
  "08:00 - 09:30 WIB",
  "09:30 - 11:00 WIB",
  "11:00 - 12:30 WIB",
  "13:00 - 14:30 WIB",
  "14:30 - 16:00 WIB",
];

export function TimePickerSimple({
  time: externalTime,
  onTimeChange,
  label = "Pilih Waktu",
  id = "time-picker-simple",
  className,
  slots = DEFAULT_SLOTS,
}: TimePickerSimpleProps) {
  const [internalTime, setInternalTime] = React.useState<string>(
    externalTime || ""
  );
  const [open, setOpen] = React.useState(false);

  const time = externalTime !== undefined ? externalTime : internalTime;

  const handleSelect = (selectedSlot: string) => {
    setInternalTime(selectedSlot);
    if (onTimeChange) {
      onTimeChange(selectedSlot);
    }
    setOpen(false);
  };

  return (
    <Field className={cn("w-full", className)}>
      <FieldLabel
        htmlFor={id}
        className="text-xs text-[#2563EB] dark:text-blue-400 font-medium mb-0.5"
      >
        {label}
      </FieldLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              id={id}
              className="w-full justify-start font-normal h-auto py-2.5 px-3 rounded-xl border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-750 text-xs md:text-[13px] shadow-sm hover:border-blue-400 transition-colors gap-2.5 cursor-pointer"
            >
              <Clock size={17} className="text-gray-800 dark:text-gray-200 flex-shrink-0" />
              {time ? (
                <span className="text-gray-900 dark:text-white font-medium">
                  {time}
                </span>
              ) : (
                <span className="text-gray-500 dark:text-gray-400">Pilih Waktu</span>
              )}
            </Button>
          }
        />
        <PopoverContent className="w-[230px] p-2" align="start">
          <div className="flex flex-col gap-1 select-none">
            <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 px-2 py-1">
              Slot Waktu Tersedia
            </p>
            {slots.map((slot) => {
              const isSelected = time === slot;
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => handleSelect(slot)}
                  className={cn(
                    "w-full text-xs py-2 px-2.5 rounded-lg text-left transition-colors flex items-center justify-between cursor-pointer",
                    isSelected
                      ? "bg-blue-600 text-white font-semibold shadow-sm"
                      : "text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-slate-700"
                  )}
                >
                  <span>{slot}</span>
                  {isSelected && <span className="text-xs font-bold">✓</span>}
                </button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    </Field>
  );
}

