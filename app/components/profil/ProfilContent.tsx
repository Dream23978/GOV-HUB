"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { broadcastSync } from "@/app/components/AutoRefresh";
import { createClient } from "@/lib/supabase/client";
import { ProfilHeader } from "./ProfilHeader";
import { ProfilUserCard } from "./ProfilUserCard";
import { ProfilAccountInfoCard } from "./ProfilAccountInfoCard";
import { ProfilDataGrid, ProfilDataValues } from "./ProfilDataGrid";
import { ProfilStatusBanner } from "./ProfilStatusBanner";
import { ProfilEditModal, ProfilEditSavePayload } from "./ProfilEditModal";
import { Check, AlertCircle } from "lucide-react";

const DEFAULT_PROFIL_DATA: ProfilDataValues = {
  namaLengkap: "Warga Terdaftar",
  nik: "-",
  tempatTanggalLahir: "-",
  jenisKelamin: "-",
  alamat: "-",
  noTelepon: "-",
  email: "-",
};

interface ProfilContentProps {
  initialData?: Partial<ProfilDataValues>;
  initialAvatarUrl?: string;
  initialTempatLahir?: string;
  initialTanggalLahirIso?: string;
  initialTerdaftarSejak?: string;
  initialTerakhirLogin?: string;
}

export function ProfilContent({
  initialData,
  initialAvatarUrl = "",
  initialTempatLahir = "",
  initialTanggalLahirIso = "",
  initialTerdaftarSejak = "-",
  initialTerakhirLogin = "-",
}: ProfilContentProps) {
  const router = useRouter();
  const [data, setData] = useState<ProfilDataValues>(() => ({
    ...DEFAULT_PROFIL_DATA,
    ...initialData,
  }));

  const [avatarUrl, setAvatarUrl] = useState<string>(initialAvatarUrl);
  const [tempatLahir, setTempatLahir] = useState<string>(initialTempatLahir);
  const [tanggalLahirIso, setTanggalLahirIso] = useState<string>(initialTanggalLahirIso);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [toastState, setToastState] = useState<{ message: string; isError: boolean } | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      localStorage.removeItem("govhub_user_profile");
      localStorage.removeItem("govhub_user_avatar");
    } catch {
      // ignore storage errors
    }
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isEditModalOpen && initialData) {
      setData((prev) => ({ ...prev, ...initialData }));
    }
  }, [initialData, isEditModalOpen]);

  useEffect(() => {
    if (initialAvatarUrl) setAvatarUrl(initialAvatarUrl);
  }, [initialAvatarUrl]);

  const triggerToast = (message: string, isError = false) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastState({ message, isError });
    toastTimerRef.current = setTimeout(() => {
      setToastState(null);
    }, 3500);
  };

  const handleAvatarChange = async (newSignedUrl: string, storagePath?: string) => {
    if (storagePath) {
      try {
        const supabase = createClient();
        const { error } = await supabase.auth.updateUser({
          data: { avatar_url: storagePath },
        });
        if (error) {
          triggerToast("Foto terunggah namun gagal menyimpan referensi profil.", true);
          return;
        }
      } catch {
        triggerToast("Gagal menyimpan referensi foto profil.", true);
        return;
      }
    }
    if (newSignedUrl) setAvatarUrl(newSignedUrl);
    broadcastSync();
    router.refresh();
    triggerToast("Foto profil berhasil diperbarui");
  };

  const handleSaveData = async (
    payload: ProfilEditSavePayload
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const normalizedGender =
        /laki/i.test(payload.jenisKelamin)
          ? "Laki-laki"
          : /perempuan/i.test(payload.jenisKelamin)
          ? "Perempuan"
          : "";

      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama_lengkap: payload.namaLengkap,
          alamat: payload.alamat,
          nomor_telepon: payload.noTelepon,
          jenis_kelamin: normalizedGender || null,
          tempat_lahir: payload.tempatLahir || null,
          tanggal_lahir: payload.tanggalLahirIso || null,
        }),
      });

      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.success) {
        const errMsg = json?.error || "Gagal menyimpan perubahan profil ke server.";
        triggerToast(errMsg, true);
        return { success: false, error: errMsg };
      }

      const formattedDate = payload.tanggalLahirIso
        ? new Date(`${payload.tanggalLahirIso}T00:00:00`).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "";

      setTempatLahir(payload.tempatLahir);
      setTanggalLahirIso(payload.tanggalLahirIso);
      setData((prev) => ({
        ...prev,
        namaLengkap: payload.namaLengkap,
        jenisKelamin: normalizedGender || prev.jenisKelamin,
        alamat: payload.alamat,
        noTelepon: payload.noTelepon,
        tempatTanggalLahir:
          [payload.tempatLahir, formattedDate].filter(Boolean).join(", ") || prev.tempatTanggalLahir,
      }));

      broadcastSync();
      router.refresh();
      triggerToast("Data profil berhasil disimpan");
      return { success: true };
    } catch {
      const errMsg = "Terjadi kesalahan jaringan saat menyimpan profil.";
      triggerToast(errMsg, true);
      return { success: false, error: errMsg };
    }
  };

  return (
    <div className="flex flex-col w-full pb-10">
      {/* Toast Notification */}
      {toastState && (
        <div
          role="status"
          className={`fixed top-20 right-6 z-50 ${
            toastState.isError ? "bg-rose-600" : "bg-[#107C41]"
          } text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-200`}
        >
          {toastState.isError ? <AlertCircle size={16} /> : <Check size={16} strokeWidth={3} />}
          <span>{toastState.message}</span>
        </div>
      )}

      {/* Page Header */}
      <ProfilHeader />

      {/* Main Outer Card Container with subtle frosted glass look */}
      <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-3xl border border-white/80 dark:border-slate-800 shadow-sm p-4 sm:p-6 md:p-7">
        <div className="flex flex-col lg:flex-row gap-5 lg:gap-6 items-start">
          {/* LEFT COLUMN: User Card & Account Info */}
          <div className="w-full lg:w-[280px] xl:w-[310px] flex flex-col gap-4 flex-shrink-0">
            <ProfilUserCard
              name={data.namaLengkap}
              maskedNik={data.nik}
              avatarUrl={avatarUrl}
              onAvatarChange={handleAvatarChange}
            />

            <ProfilAccountInfoCard
              terdaftarSejak={initialTerdaftarSejak}
              statusVerifikasi="Terverifikasi"
              terakhirLogin={initialTerakhirLogin}
            />
          </div>

          {/* RIGHT COLUMN: Data Grid, Status Banner, & Action Button */}
          <div className="w-full flex-1 flex flex-col gap-4">
            <ProfilDataGrid data={data} />

            <ProfilStatusBanner />

            {/* Action Button: Ubah Data */}
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="bg-[#0B57D0] hover:bg-blue-700 active:scale-95 text-white font-semibold text-xs px-6 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 w-full sm:w-auto select-none"
              >
                <span>Ubah Data</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <ProfilEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        data={data}
        initialTempatLahir={tempatLahir}
        initialTanggalLahirIso={tanggalLahirIso}
        onSave={handleSaveData}
      />
    </div>
  );
}

