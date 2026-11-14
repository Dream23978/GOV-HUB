"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerSimpleProps {
  date?: Date;
  onDateChange?: (date: Date | undefined) => void;
  minDate?: Date;
  label?: string;
  id?: string;
  className?: string;
}

export function DatePickerSimple({
  date: externalDate,
  onDateChange,
  minDate,
  label = "Pilih Tanggal",
  id = "date-picker-simple",
  className,
}: DatePickerSimpleProps) {
  const [internalDate, setInternalDate] = React.useState<Date | undefined>(
    externalDate
  );

  const date = externalDate !== undefined ? externalDate : internalDate;

  const handleSelect = (newDate: Date | undefined) => {
    setInternalDate(newDate);
    if (onDateChange) {
      onDateChange(newDate);
    }
  };

  return (
    <Field className={cn("w-full", className)}>
      <FieldLabel htmlFor={id} className="text-xs text-gray-700 dark:text-gray-300 font-normal mb-0.5">
        {label}
      </FieldLabel>
      <Popover>
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              id={id}
              className="w-full justify-start font-normal h-auto py-2.5 px-3 rounded-xl border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-xs md:text-[13px] shadow-sm hover:border-blue-400 transition-colors gap-2.5 cursor-pointer"
            >
              <CalendarIcon size={17} className="text-gray-800 dark:text-gray-200 flex-shrink-0" />
              {date ? (
                <span className="text-gray-900 dark:text-white font-medium">
                  {format(date, "PPP")}
                </span>
              ) : (
                <span className="text-gray-500 dark:text-gray-400">Pilih Tanggal</span>
              )}
            </Button>
          }
        />
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            defaultMonth={date || minDate}
            minDate={minDate}
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
}

