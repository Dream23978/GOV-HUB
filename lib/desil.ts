export interface DesilDefinition {
  level: number;
  kategori: string;
  deskripsi: string;
  persen: string;
  badgeColor: string;
}

export const DESIL_TIERS: readonly DesilDefinition[] = [
  {
    level: 1,
    kategori: "Miskin Ekstrem / Sangat Miskin",
    deskripsi: "Kelompok 10% keluarga dengan kesejahteraan terendah dan kesulitan memenuhi kebutuhan dasar.",
    persen: "10% terendah",
    badgeColor: "bg-red-600 text-white",
  },
  {
    level: 2,
    kategori: "Miskin",
    deskripsi: "Kelompok peringkat 11–20% terbawah dengan kondisi ekonomi sangat terbatas dan tidak stabil.",
    persen: "11–20% terbawah",
    badgeColor: "bg-orange-500 text-white",
  },
  {
    level: 3,
    kategori: "Hampir Miskin",
    deskripsi: "Kelompok peringkat 21–30% terbawah yang hidup pas-pasan dan berisiko jatuh miskin jika ada guncangan ekonomi.",
    persen: "21–30% terbawah",
    badgeColor: "bg-amber-500 text-white",
  },
  {
    level: 4,
    kategori: "Rentan Miskin",
    deskripsi: "Kelompok peringkat 31–40% terbawah dengan kondisi ekonomi sedikit lebih baik namun masih tergolong rentan.",
    persen: "31–40% terbawah",
    badgeColor: "bg-yellow-500 text-slate-900",
  },
  {
    level: 5,
    kategori: "Menengah Bawah / Transisi",
    deskripsi: "Kelompok peringkat 41–50% terbawah yang mampu memenuhi kebutuhan dasar secara mandiri namun belum mapan.",
    persen: "41–50% terbawah",
    badgeColor: "bg-lime-600 text-white",
  },
  {
    level: 6,
    kategori: "Menengah",
    deskripsi: "Kelompok peringkat 51–60% dengan kondisi ekonomi stabil dan sudah memiliki aset dasar yang memadai.",
    persen: "51–60%",
    badgeColor: "bg-emerald-600 text-white",
  },
  {
    level: 7,
    kategori: "Menengah Ke Atas",
    deskripsi: "Kelompok peringkat 61–70% dengan tingkat kesejahteraan yang baik serta akses pendidikan dan kesehatan terjamin.",
    persen: "61–70%",
    badgeColor: "bg-teal-600 text-white",
  },
  {
    level: 8,
    kategori: "Sejahtera / Mapan",
    deskripsi: "Kelompok peringkat 71–80% dengan penghasilan tetap yang kuat dan kepemilikan aset yang cukup tinggi.",
    persen: "71–80%",
    badgeColor: "bg-cyan-600 text-white",
  },
  {
    level: 9,
    kategori: "Sangat Sejahtera",
    deskripsi: "Kelompok peringkat 81–90% dengan kondisi finansial sangat mapan dan jauh di atas garis kemiskinan.",
    persen: "81–90%",
    badgeColor: "bg-blue-600 text-white",
  },
  {
    level: 10,
    kategori: "Paling Sejahtera / Kaya",
    deskripsi: "Kelompok 10% keluarga teratas dengan tingkat kesejahteraan dan kepemilikan aset paling tinggi secara nasional.",
    persen: "10% teratas",
    badgeColor: "bg-[#1b3a6b] text-white",
  },
] as const;

export function getDesilDefinition(level: number | string | null | undefined): DesilDefinition | undefined {
  const num = typeof level === "string" ? parseInt(level, 10) : Number(level);
  if (!Number.isInteger(num) || num < 1 || num > 10) return undefined;
  return DESIL_TIERS[num - 1];
}
