"use client";

import React from "react";
import { DatePickerSimple } from "@/components/ui/date-picker-simple";
import { TimePickerSimple } from "@/components/ui/time-picker-simple";
import { format } from "date-fns";

interface JadwalBiometrikSectionProps {
  selectedTanggal: string;
  selectedWaktu: string;
  onTanggalChange: (val: string) => void;
  onWaktuChange: (val: string) => void;
}

export function JadwalBiometrikSection({
  selectedTanggal,
  selectedWaktu,
  onTanggalChange,
  onWaktuChange,
}: JadwalBiometrikSectionProps) {
  // Convert string to Date if valid
  const parsedDate = React.useMemo(() => {
    if (!selectedTanggal) return undefined;
    const d = new Date(selectedTanggal);
    return isNaN(d.getTime()) ? undefined : d;
  }, [selectedTanggal]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      onTanggalChange(format(date, "PPP"));
    } else {
      onTanggalChange("");
    }
  };

  return (
    <div className="mb-5">
      {/* Section Title */}
      <h2 className="text-sm md:text-[15px] font-bold text-gray-900 dark:text-white mb-2">
        3. Jadwal Perekaman Biometrik
      </h2>

      {/* Two Pickers Grid with identical Popover style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Column 1: DatePickerSimple with Popover & Calendar */}
        <DatePickerSimple
          date={parsedDate}
          onDateChange={handleDateSelect}
          label="Pilih Tanggal"
          id="date-picker-biometrik"
        />

        {/* Column 2: TimePickerSimple with Popover */}
        <TimePickerSimple
          time={selectedWaktu}
          onTimeChange={onWaktuChange}
          label="Pilih Waktu"
          id="time-picker-biometrik"
        />
      </div>

      {/* Reminder Banner */}
      <div className="bg-[#D7E7F8] dark:bg-blue-950/40 rounded-xl border border-[#BCD4F3] dark:border-blue-900/50 px-3.5 py-2.5 flex items-center gap-2.5 mt-3 shadow-sm">
        {/* Green small circular exclamation icon */}
        <div className="w-5 h-5 rounded-full bg-[#107C41] flex items-center justify-center flex-shrink-0 text-white text-[11px] font-bold select-none leading-none shadow-sm">
          !
        </div>
        <p className="text-[11px] md:text-xs text-gray-800 dark:text-gray-200 leading-normal">
          bawa diri anda untuk foto dan sidik jari . Tidak perlu membawa fotokopi dokumen.
        </p>
      </div>
    </div>
  );
}
