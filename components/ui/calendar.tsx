"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CalendarProps {
  mode?: "single";
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  defaultMonth?: Date;
  minDate?: Date;
  className?: string;
}

const DAYS_HEADER = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

function startOfLocalDay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

export function Calendar({
  selected,
  onSelect,
  defaultMonth,
  minDate,
  className,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState<Date>(() => {
    return selected || defaultMonth || new Date();
  });

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  // Days in current month
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Days in previous month for padding
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year
    );
  };

  const isSelected = (day: number) => {
    if (!selected) return false;
    return (
      selected.getDate() === day &&
      selected.getMonth() === month &&
      selected.getFullYear() === year
    );
  };

  const isDayDisabled = (day: number) => {
    if (!minDate) return false;
    return startOfLocalDay(new Date(year, month, day)) < startOfLocalDay(minDate);
  };

  const handleSelectDay = (day: number) => {
    if (isDayDisabled(day)) return;
    const newDate = new Date(year, month, day);
    if (onSelect) {
      if (isSelected(day)) {
        onSelect(undefined);
      } else {
        onSelect(newDate);
      }
    }
  };

  return (
    <div className={cn("p-2 select-none w-[270px]", className)}>
      {/* Calendar Header with Navigation */}
      <div className="flex items-center justify-between px-1 pb-3">
        <h4 className="text-xs font-bold text-gray-900 dark:text-white">
          {MONTHS[month]} {year}
        </h4>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 transition-colors"
            aria-label="Bulan sebelumnya"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 transition-colors"
            aria-label="Bulan berikutnya"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Days of week header */}
      <div className="grid grid-cols-7 gap-1 text-center mb-1">
        {DAYS_HEADER.map((day) => (
          <span
            key={day}
            className="text-[10px] font-semibold text-gray-400 dark:text-gray-500"
          >
            {day}
          </span>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {/* Previous month padding days */}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => {
          const prevDay = daysInPrevMonth - firstDayOfWeek + i + 1;
          return (
            <span
              key={`prev-${i}`}
              className="text-xs text-gray-300 dark:text-gray-600 p-1.5 flex items-center justify-center"
            >
              {prevDay}
            </span>
          );
        })}

        {/* Current month days */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const selectedState = isSelected(day);
          const todayState = isToday(day);
          const disabledState = isDayDisabled(day);

          return (
            <button
              key={`day-${day}`}
              type="button"
              disabled={disabledState}
              onClick={() => handleSelectDay(day)}
              className={cn(
                "text-xs p-1.5 rounded-lg flex items-center justify-center transition-colors",
                disabledState
                  ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                  : selectedState
                  ? "bg-blue-600 text-white font-bold shadow-sm cursor-pointer"
                  : todayState
                  ? "border border-blue-500 font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 cursor-pointer"
                  : "text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer"
              )}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

