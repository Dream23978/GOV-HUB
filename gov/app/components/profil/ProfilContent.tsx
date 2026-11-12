"use client";

import React, { useState, useEffect } from "react";
import { ProfilHeader } from "./ProfilHeader";
import { ProfilUserCard } from "./ProfilUserCard";
import { ProfilAccountInfoCard } from "./ProfilAccountInfoCard";
import { ProfilDataGrid, ProfilDataValues } from "./ProfilDataGrid";
import { ProfilStatusBanner } from "./ProfilStatusBanner";
import { ProfilEditModal } from "./ProfilEditModal";
import { Check } from "lucide-react";

const DEFAULT_PROFIL_DATA: ProfilDataValues = {
  namaLengkap: "Hapis Khairullah",
  nik: "610*********002",
  tempatTanggalLahir: "Pontianak, 06 Mei 2026",
  jenisKelamin: "Laki - Laki",
  alamat: "Jl. Merdeka No. 12, Pontianak",
  noTelepon: "0812334561579",
  email: "hapisramatullah@gmail.com",
};

interface ProfilContentProps {
  initialData?: Partial<ProfilDataValues>;
}

export function ProfilContent({ initialData }: ProfilContentProps) {
  const [data, setData] = useState<ProfilDataValues>(() => {
    return {
      ...DEFAULT_PROFIL_DATA,
      ...initialData,
    };
  });

  const [avatarUrl, setAvatarUrl] = useState<string>("/avatar-hapis.png");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("Perubahan profil berhasil disimpan!");

  // Restore from localStorage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem("govhub_user_profile");
      if (saved) {
        const parsed = JSON.parse(saved);
        setData((prev) => ({ ...prev, ...parsed }));
      }
      const savedAvatar = localStorage.getItem("govhub_user_avatar");
      if (savedAvatar) {
        setAvatarUrl(savedAvatar);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const handleAvatarChange = (newUrl: string) => {
    setAvatarUrl(newUrl);
    try {
      localStorage.setItem("govhub_user_avatar", newUrl);
    } catch {
      // ignore
    }
    triggerToast("Foto profil berhasil diperbarui");
  };

  const handleSaveData = (newData: ProfilDataValues) => {
    setData(newData);
    try {
      localStorage.setItem("govhub_user_profile", JSON.stringify(newData));
    } catch {
      // ignore
    }
    triggerToast("Data profil berhasil disimpan");
  };

  const triggerToast = (msg?: string) => {
    if (msg) {
      setToastMessage(msg);
    }
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return (
    <div className="flex flex-col w-full pb-10">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-20 right-6 z-50 bg-[#107C41] text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-200">
          <Check size={16} strokeWidth={3} />
          <span>{toastMessage}</span>
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
              terdaftarSejak="10 Mei 2026"
              statusVerifikasi="Terverifikasi"
              terakhirLogin="16 Oktober 2026, 15:42"
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
        onSave={handleSaveData}
      />
    </div>
  );
}

