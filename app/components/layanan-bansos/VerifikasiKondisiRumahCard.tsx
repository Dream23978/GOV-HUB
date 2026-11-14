"use client";

import React, { useRef, useState, useEffect } from "react";
import { RefreshCw, AlertCircle, CheckCircle2, MapPin, Loader2 } from "lucide-react";
import { uploadPrivateDocument } from "@/lib/upload-document";

interface VerifikasiKondisiRumahCardProps {
  photo?: string | null;
  onPhotoCaptured?: (photoPreviewUrl: string | null, storagePath?: string | null) => void;
}

export function VerifikasiKondisiRumahCard({
  photo: initialPhoto,
  onPhotoCaptured,
}: VerifikasiKondisiRumahCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [photo, setPhoto] = useState<string | null>(initialPhoto || null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [geotag, setGeotag] = useState<string | null>(null);

  // Stop camera stream when unmounting
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Pastikan stream terpasang ke elemen video saat komponen selesai me-render video di DOM
  useEffect(() => {
    if (isCameraOpen && videoRef.current && streamRef.current) {
      const video = videoRef.current;
      if (video.srcObject !== streamRef.current) {
        video.srcObject = streamRef.current;
      }
      video.onloadedmetadata = () => {
        video.play().catch((err) => console.warn("Video play error:", err));
      };
      video.play().catch(() => {});
    }
  }, [isCameraOpen]);

  // Callback ref untuk memastikan stream dipasang seketika saat tag <video> dipasang ke DOM
  const attachVideo = (el: HTMLVideoElement | null) => {
    videoRef.current = el;
    if (el && streamRef.current && el.srcObject !== streamRef.current) {
      el.srcObject = streamRef.current;
      el.onloadedmetadata = () => {
        el.play().catch((err) => console.warn("Video play error:", err));
      };
      el.play().catch(() => {});
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  };

  const startCamera = async () => {
    setCameraError(null);
    setIsLoading(true);

    // Ambil koordinat Geotagging otomatis jika browser mendukung
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGeotag(
            `Lat: ${pos.coords.latitude.toFixed(4)}, Long: ${pos.coords.longitude.toFixed(4)}`
          );
        },
        () => {
          setGeotag("Lokasi perangkat (GPS tidak diizinkan)");
        },
        { timeout: 5000 }
      );
    } else {
      setGeotag("Lokasi perangkat");
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Browser Anda tidak mendukung akses kamera langsung.");
      }

      // Hentikan stream lama jika masih aktif
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }

      // Meminta izin kamera ke perangkat pengguna (dengan fallback jika environment mode tidak ada di laptop/PC)
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
      } catch {
        // Fallback untuk webcam laptop/komputer standar
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }

      streamRef.current = stream;

      // 1. Tampilkan tampilan kamera di state (sehingga tag <video> masuk ke DOM)
      setIsCameraOpen(true);

      // 2. Jika elemen video sudah ada di DOM, langsung sambungkan srcObject
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(() => {});
        };
        await videoRef.current.play().catch(() => {});
      }
    } catch (err: unknown) {
      console.warn("Camera access error:", err);
      const errName = (err as Error)?.name || "";
      if (errName === "NotAllowedError" || errName === "PermissionDeniedError") {
        setCameraError(
          "Izin akses kamera ditolak. Harap izinkan akses kamera di pengaturan browser Anda untuk melanjutkan verifikasi live camera."
        );
      } else if (errName === "NotFoundError" || errName === "DevicesNotFoundError") {
        setCameraError("Kamera tidak ditemukan pada perangkat Anda.");
      } else {
        setCameraError(
          "Gagal mengakses kamera perangkat. Pastikan izin kamera aktif dan tidak sedang digunakan aplikasi lain."
        );
      }
      setIsCameraOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current || isUploading) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const rawWidth = video.videoWidth || 640;
    const rawHeight = video.videoHeight || 480;
    const scale = rawWidth > 1280 ? 1280 / rawWidth : 1;
    canvas.width = Math.round(rawWidth * scale);
    canvas.height = Math.round(rawHeight * scale);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const previewDataUrl = canvas.toDataURL("image/jpeg", 0.78);
    setCameraError(null);
    setIsUploading(true);
    stopCamera();

    canvas.toBlob(
      async (blob) => {
        try {
          if (!blob) {
            setCameraError("Gagal memproses hasil tangkapan kamera.");
            return;
          }
          const file = new File([blob], `rumah-${Date.now()}.jpg`, { type: "image/jpeg" });
          const uploadRes = await uploadPrivateDocument(file, "bansos", { imagesOnly: true });
          if (!uploadRes.success || !uploadRes.path) {
            setCameraError(uploadRes.error || "Gagal mengunggah foto kondisi rumah.");
            return;
          }
          const displayUrl = uploadRes.signedUrl || previewDataUrl;
          setPhoto(displayUrl);
          onPhotoCaptured?.(displayUrl, uploadRes.path);
        } catch {
          setCameraError("Terjadi kesalahan saat mengunggah foto kondisi rumah.");
        } finally {
          setIsUploading(false);
        }
      },
      "image/jpeg",
      0.78
    );
  };

  const retakePhoto = () => {
    setPhoto(null);
    onPhotoCaptured?.(null, null);
    startCamera();
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-300/80 dark:border-slate-700 shadow-sm p-6 md:p-8 mb-6 w-full">
      {/* Hidden Canvas for Capturing Frame */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Card Header */}
      <div className="mb-5">
        <h2 className="text-base md:text-lg font-bold text-gray-900 dark:text-white leading-tight">
          Verifikasi Kondisi Rumah
        </h2>
        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 leading-snug">
          Ambil foto kondisi rumah secara langsung untuk melengkapi pengajuan Anda.
        </p>
      </div>

      {/* Two Column Layout: Camera Box (Left) & Live Camera Instructions (Right) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
        {/* LEFT COLUMN: Camera Box / Preview / Placeholder */}
        <div className="w-full">
          <div className="border border-gray-400 dark:border-slate-600 rounded-lg aspect-[4/3] relative overflow-hidden bg-white dark:bg-slate-900 flex flex-col items-center justify-center p-4">
            {/* 1. Live Video Stream View */}
            {isCameraOpen && (
              <div className="relative w-full h-full">
                <video
                  ref={attachVideo}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover rounded-md"
                />
                {/* Live Camera Watermark & Shutter Button Overlay */}
                <div className="absolute top-2 left-2 bg-red-600/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span>REC LIVE</span>
                </div>

                <div className="absolute bottom-3 inset-x-0 flex justify-center">
                  <button
                    type="button"
                    onClick={capturePhoto}
                    disabled={isUploading}
                    className="w-12 h-12 rounded-full border-2 border-white bg-red-600 hover:bg-red-700 active:scale-90 shadow-lg flex items-center justify-center text-white transition-all cursor-pointer disabled:opacity-60"
                    aria-label="Ambil Foto"
                  >
                    <div className="w-4 h-4 rounded-full bg-white" />
                  </button>
                </div>
              </div>
            )}

            {/* 2. Photo Captured Preview View */}
            {!isCameraOpen && photo && (
              <div className="relative w-full h-full flex flex-col">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo}
                  alt="Foto Kondisi Rumah"
                  className="w-full h-full object-cover rounded-md"
                />

                {/* Geotag & Time Badge Overlay */}
                <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-sm text-white p-2 rounded-lg text-[10px] flex items-center justify-between">
                  <div className="flex items-center gap-1 truncate">
                    <MapPin size={11} className="text-emerald-400 flex-shrink-0" />
                    <span className="truncate">{geotag || "Lokasi terdeteksi"}</span>
                  </div>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1 flex-shrink-0 ml-1">
                    <CheckCircle2 size={11} /> Terverifikasi
                  </span>
                </div>

                <button
                  type="button"
                  onClick={retakePhoto}
                  className="absolute top-2 right-2 bg-white/90 dark:bg-slate-800/90 text-gray-800 dark:text-gray-200 text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow flex items-center gap-1 hover:bg-white transition-colors cursor-pointer"
                >
                  <RefreshCw size={11} />
                  <span>Ulangi</span>
                </button>
              </div>
            )}

            {/* 3. Empty Placeholder / Upload Progress */}
            {!isCameraOpen && !photo && (
              <div className="flex flex-col items-center justify-center text-center p-4">
                {isUploading ? (
                  <div className="flex flex-col items-center gap-2 text-blue-600 dark:text-blue-400">
                    <Loader2 size={22} className="animate-spin" />
                    <span className="text-xs font-semibold">Mengunggah foto terverifikasi...</span>
                  </div>
                ) : (
                  <>
                    <span className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Belum ada foto rumah
                    </span>
                    <button
                      type="button"
                      onClick={startCamera}
                      disabled={isLoading}
                      className="text-xs font-semibold text-gray-900 dark:text-white hover:underline focus:outline-none cursor-pointer"
                    >
                      {isLoading ? "Menghubungkan kamera..." : "Buka Kamera"}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Camera Error Alert & Fallback */}
          {cameraError && (
            <div className="mt-2.5 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 flex items-start gap-2 text-xs text-amber-800 dark:text-amber-300">
              <AlertCircle size={15} className="flex-shrink-0 mt-0.5 text-amber-600" />
              <div className="flex-1">
                <p className="leading-snug">{cameraError}</p>
                <button
                  type="button"
                  onClick={startCamera}
                  className="mt-1 text-[11px] font-bold underline hover:no-underline cursor-pointer"
                >
                  Coba Minta Izin Kamera Lagi
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Live Camera Instructions (Matches Mockup 100%) */}
        <div className="flex flex-col justify-center pt-1 md:pt-4">
          <h3 className="text-sm md:text-base font-bold text-gray-900 dark:text-white uppercase tracking-tight mb-3">
            LIVE CAMERA
          </h3>

          <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
            Foto harus diambil langsung melalui kamera perangkat.
          </p>

          <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
            Tidak dapat menggunakan foto galeri
          </p>

          <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
            Geotagging Lokasi pengambilan foto akan dicatat secara otomatis.
          </p>
        </div>
      </div>
    </div>
  );
}
