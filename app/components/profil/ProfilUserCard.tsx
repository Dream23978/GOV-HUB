"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Camera } from "lucide-react";

interface ProfilUserCardProps {
  name: string;
  maskedNik: string;
  avatarUrl: string;
  onAvatarChange: (newUrl: string) => void;
}

export function ProfilUserCard({
  name,
  maskedNik,
  avatarUrl,
  onAvatarChange,
}: ProfilUserCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      onAvatarChange(objectUrl);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200/90 dark:border-slate-700/80 shadow-xs p-5 md:p-6 flex flex-col items-center text-center">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Avatar Container with Camera Badge */}
      <div className="relative mb-3 group cursor-pointer" onClick={handleUploadClick}>
        <div className="w-20 h-20 md:w-22 md:h-22 rounded-full overflow-hidden border-2 border-white dark:border-slate-700 shadow-md relative bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={name}
              fill
              className="object-cover"
              sizes="88px"
              priority
            />
          ) : (
            <span className="text-white font-bold text-xl">
              {name.slice(0, 2).toUpperCase()}
            </span>
          )}
        </div>

        {/* Camera Badge at bottom-right */}
        <div
          title="Ubah Foto Profil"
          className="w-6 h-6 rounded-full bg-[#0B57D0] text-white flex items-center justify-center shadow-md absolute bottom-0 right-0 border-2 border-white dark:border-slate-800 group-hover:scale-110 transition-transform"
        >
          <Camera size={12} strokeWidth={2.5} />
        </div>
      </div>

      {/* User Name & NIK */}
      <h2 className="text-base font-bold text-gray-900 dark:text-white leading-tight">
        {name}
      </h2>
      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">
        NIK : {maskedNik}
      </p>

      {/* Ganti Foto Button */}
      <button
        type="button"
        onClick={handleUploadClick}
        className="mt-3.5 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl border border-[#0B57D0] text-[#0B57D0] dark:text-blue-400 dark:border-blue-500 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 active:scale-95 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
      >
        <Camera size={14} className="stroke-[#0B57D0] dark:stroke-blue-400" />
        <span>Ganti Foto</span>
      </button>
    </div>
  );
}

