"use client";

import React, { useEffect, useMemo, useState } from "react";
import { DatePickerSimple } from "@/components/ui/date-picker-simple";
import { TimePickerSimple } from "@/components/ui/time-picker-simple";
import { format } from "date-fns";
import { CalendarClock, CheckCircle2, MapPin } from "lucide-react";

interface BiometricScheduleSlot {
  id: string;
  lokasi: string;
  tanggal: string;
  jam_mulai: string;
  jam_selesai: string;
  kuota_maksimal: number;
  kuota_terisi: number;
}

interface JadwalBiometrikSectionProps {
  selectedTanggal: string;
  selectedWaktu: string;
  selectedScheduleId?: string;
  onTanggalChange: (val: string) => void;
  onWaktuChange: (val: string) => void;
  onScheduleIdChange?: (id: string | undefined) => void;
}

export function JadwalBiometrikSection({
  selectedTanggal,
  selectedWaktu,
  selectedScheduleId,
  onTanggalChange,
  onWaktuChange,
  onScheduleIdChange,
}: JadwalBiometrikSectionProps) {
  const [schedules, setSchedules] = useState<BiometricScheduleSlot[]>([]);

  const todayMin = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  useEffect(() => {
    let mounted = true;
    fetch("/api/ktp/schedules")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!mounted || !json?.success || !Array.isArray(json.data)) return;
        const todayIso = new Date().toISOString().split("T")[0];
        const available = json.data.filter(
          (slot: BiometricScheduleSlot) =>
            slot.tanggal >= todayIso && slot.kuota_terisi < slot.kuota_maksimal
        );
        setSchedules(available);
      })
      .catch(() => {
        // Fallback ke input manual tanggal & waktu jika jadwal slot belum tersedia
      });
    return () => {
      mounted = false;
    };
  }, []);

  const parsedDate = useMemo(() => {
    if (!selectedTanggal) return undefined;
    const normalized = /^\d{4}-\d{2}-\d{2}$/.test(selectedTanggal)
      ? `${selectedTanggal}T00:00:00`
      : selectedTanggal;
    const d = new Date(normalized);
    return isNaN(d.getTime()) ? undefined : d;
  }, [selectedTanggal]);

  const handleDateSelect = (date: Date | undefined) => {
    onScheduleIdChange?.(undefined);
    if (date) {
      onTanggalChange(format(date, "yyyy-MM-dd"));
    } else {
      onTanggalChange("");
    }
  };

  const handleWaktuChange = (val: string) => {
    onScheduleIdChange?.(undefined);
    onWaktuChange(val);
  };

  const handleSelectSlot = (slot: BiometricScheduleSlot) => {
    onScheduleIdChange?.(slot.id);
    onTanggalChange(slot.tanggal);
    onWaktuChange(`${String(slot.jam_mulai).slice(0, 5)} WIB`);
  };

  return (
    <div className="mb-5">
      {/* Section Title */}
      <h2 className="text-sm md:text-[15px] font-bold text-gray-900 dark:text-white mb-2">
        3. Jadwal Perekaman Biometrik
      </h2>

      {schedules.length > 0 && (
        <div className="mb-3.5">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-2 flex items-center gap-1.5">
            <CalendarClock size={14} className="text-blue-600 dark:text-blue-400" />
            <span>Pilih Slot Layanan Dukcapil Tersedia (Opsional):</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {schedules.slice(0, 6).map((slot) => {
              const isSelected = selectedScheduleId === slot.id;
              const remaining = Math.max(0, slot.kuota_maksimal - slot.kuota_terisi);
              return (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => handleSelectSlot(slot)}
                  className={`text-left rounded-xl p-3 border transition-all cursor-pointer ${
                    isSelected
                      ? "border-2 border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 dark:border-blue-400 shadow-sm"
                      : "border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1">
                      <MapPin size={12} className="text-blue-600 flex-shrink-0" />
                      <span className="truncate">{slot.lokasi}</span>
                    </span>
                    {isSelected && <CheckCircle2 size={15} className="text-blue-600 flex-shrink-0" />}
                  </div>
                  <p className="text-[11px] text-gray-600 dark:text-gray-300 mt-1">
                    {slot.tanggal} • {String(slot.jam_mulai).slice(0, 5)} - {String(slot.jam_selesai).slice(0, 5)} WIB
                  </p>
                  <span className="inline-block mt-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                    Sisa kuota: {remaining}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Two Pickers Grid with identical Popover style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DatePickerSimple
          date={parsedDate}
          onDateChange={handleDateSelect}
          minDate={todayMin}
          label="Pilih Tanggal"
          id="date-picker-biometrik"
        />

        <TimePickerSimple
          time={selectedWaktu}
          onTimeChange={handleWaktuChange}
          label="Pilih Waktu"
          id="time-picker-biometrik"
        />
      </div>

      {/* Reminder Banner */}
      <div className="bg-[#D7E7F8] dark:bg-blue-950/40 rounded-xl border border-[#BCD4F3] dark:border-blue-900/50 px-3.5 py-2.5 flex items-center gap-2.5 mt-3 shadow-sm">
        <div className="w-5 h-5 rounded-full bg-[#107C41] flex items-center justify-center flex-shrink-0 text-white text-[11px] font-bold select-none leading-none shadow-sm">
          !
        </div>
        <p className="text-[11px] md:text-xs text-gray-800 dark:text-gray-200 leading-normal">
          Bawa diri Anda untuk foto dan sidik jari. Tidak perlu membawa fotokopi dokumen.
        </p>
      </div>
    </div>
  );
}
