# GOV-HUB — Design Documentation

Dokumentasi rancangan portal layanan publik GOV-HUB berdasarkan keseluruhan desain Figma yang tersedia.

- Tanggal dokumentasi: 30 Oktober 2026
- Sumber: https://www.figma.com/design/VbQtB8qQeFeBvEbMgEDsCf
- Halaman: Page 1
- Cakupan: warga, admin, dan petugas
- Inventaris: 113 frame tingkat atas, termasuk duplikat, varian formulir, dan eksplorasi; bukan 113 halaman produk unik.

> Dokumen ini membedakan rancangan yang sudah terlihat dari rekomendasi implementasi. Keberadaan tampilan tidak membuktikan bahwa integrasi atau fungsinya sudah berjalan.

## 1. Ringkasan Produk

GOV-HUB adalah portal terpadu untuk layanan administrasi kependudukan dan peninjauan kondisi sosial-ekonomi berbasis identitas NIK.

Pesan utama:

> Satu NIK, Satu Akses untuk Berbagai Layanan Publik.

> Semua Layanan Publik, Dalam Satu Hub.

Tujuan pengalaman:

1. Mengurangi pengisian data dan penyerahan dokumen berulang.
2. Memudahkan pengajuan KTP-el.
3. Memfasilitasi pemilihan jadwal perekaman biometrik.
4. Memudahkan pengajuan peninjauan desil.
5. Menampilkan perkembangan pengajuan secara transparan.
6. Mendukung pemeriksaan dan keputusan admin/petugas.

Bahasa utama: Bahasa Indonesia.

Karakter visual: formal, ramah, berorientasi layanan publik, dominan biru, dan menggunakan kartu informasi.

## 2. Peran Pengguna

| Peran | Kebutuhan | Area utama |
| --- | --- | --- |
| Warga | Mengakses layanan dan memantau pengajuan pribadi | Beranda, KTP, desil, profil |
| Admin | Memeriksa data dan mengelola keputusan | Dashboard, pengajuan, data warga, blangko |
| Petugas | Menangani proses operasional | Dashboard petugas, konfirmasi, unggah data |

Matriks izin dan pembagian kewenangan belum dijelaskan secara lengkap pada desain.

Pendaftaran publik tidak boleh otomatis dianggap dapat membuat akun admin atau petugas.

## 3. Arsitektur Informasi

### Area Publik

- Pengantar layanan.
- Masuk.
- Pendaftaran.
- Lupa kata sandi.
- Verifikasi kode.
- Penetapan kata sandi baru.

### Area Warga

- Beranda.
- Layanan KTP & Dukcapil.
  - Ajukan KTP Baru.
  - Pilih jadwal biometrik.
  - Konfirmasi pengajuan.
  - Tracking pengajuan.
- Layanan Bansos & Desil.
  - Ringkasan desil.
  - Verifikasi identitas dan keluarga.
  - Kondisi ekonomi.
  - Kondisi rumah.
  - Ringkasan dan persetujuan.
  - Tracking peninjauan.
- Pengajuan Saya.
- Notifikasi.
- Profil.
- Dark Mode.
- Keluar.

Pengajuan Saya dan Notifikasi terlihat pada navigasi, tetapi layar khususnya belum teridentifikasi secara jelas.

### Area Admin

- Dashboard.
- Pengajuan Desil.
- Pengajuan KTP.
- Data Warga.
- Detail dan riwayat pengajuan.
- Pengaturan.
- Dark Mode.
- Keluar.

### Area Petugas

- Dashboard.
- Pengajuan KTP.
- Konfirmasi.
- Unggah data.
- Pengaturan.

Detail alur konfirmasi dan unggah data masih perlu dipastikan.

## 4. Struktur Layout

### Autentikasi

- Komposisi dua kolom.
- Panel foto/ilustrasi Garuda di kiri.
- Panel formulir biru sangat muda di kanan.
- Judul, deskripsi, input, dan tombol disusun vertikal.
- Input menggunakan ikon.
- Input kata sandi memiliki kontrol tampil/sembunyikan.
- Tombol utama memenuhi lebar formulir.
- Tautan bantuan berada dekat aksi utama.

Ukuran frame autentikasi umumnya 1440 × 1008 px.

### Aplikasi Warga

- Sidebar biru di kiri.
- Lebar sidebar sekitar 277 px pada sejumlah layar.
- Header berisi logo GOV-HUB dan avatar.
- Konten utama berwarna putih.
- Judul halaman dilengkapi tombol kembali pada halaman turunan.
- Panel Dark Mode dan Keluar berada di bawah sidebar.
- Beranda menggunakan banner ilustrasi dan kartu layanan.

### Aplikasi Admin

- Sidebar navy lebih gelap.
- Lebar sidebar sekitar 284 px pada sejumlah varian.
- Header mengikuti pola aplikasi warga.
- Konten lebih padat dengan statistik, filter, tabel, dan panel detail.
- Detail pengajuan menggunakan beberapa kelompok informasi.
- Halaman panjang disusun vertikal.

Mayoritas layar aplikasi memiliki lebar 1440 px. Tinggi mengikuti isi.

Perilaku fixed/sticky sidebar belum ditetapkan secara jelas.

## 5. Warna

Nama token berikut adalah usulan semantik berdasarkan warna yang ditemukan, bukan nama variable resmi.

| Token | Warna | Penggunaan |
| --- | --- | --- |
| brand.sidebar.citizen | #0E3F9A | Sidebar warga |
| brand.sidebar.admin | #091E45 | Sidebar admin/petugas |
| brand.ink | #1C3D7B | Teks dan aksen biru gelap |
| action.primary | #2065CE | Tombol utama, khususnya autentikasi |
| action.accent | #3473E6 | Tautan dan aksi layanan |
| action.service | #0254AA | Beberapa tombol layanan KTP |
| surface.base | #FFFFFF | Latar utama dan kartu |
| surface.subtle | #F6FAFF | Permukaan input/panel ringan |
| border.neutral | #D9D9D9 | Elemen netral dan pembatas |
| text.primary | #000000 | Teks utama |
| text.secondary | #666666 | Teks pendukung |
| status.success | #067218 | Persetujuan/berhasil |
| status.warning | #FB9200 | Dalam proses/peninjauan |
| status.danger.accent | #FB3F4A | Aksen bahaya/keluar |

Catatan:

- Badge menggunakan latar muda dan teks semantik.
- Tombol Tolak juga memiliki varian merah gelap.
- Terdapat beberapa varian warna untuk fungsi serupa.
- Konsolidasi token diperlukan sebelum implementasi final.
- Warna mockup WhatsApp bukan bagian palet inti GOV-HUB.
- Kontrol Dark Mode terlihat, tetapi tema gelap GOV-HUB belum lengkap.

## 6. Tipografi

Font dominan: Plus Jakarta Sans.

Weight yang ditemukan:

- Regular.
- Medium.
- SemiBold.
- Bold.
- ExtraBold.

Ukuran yang sering muncul: 18, 20, 22, 23, 24, 32, 38, dan 40 px.

| Peran | Acuan pada desain |
| --- | --- |
| Judul halaman | Sekitar 38–40 px, Bold/ExtraBold pada sejumlah layar |
| Judul bagian | Sekitar 24–32 px |
| Isi dan label | Umumnya 20–24 px |
| Metadata kecil | 16–18 px pada sebagian layer |

Ukuran tersebut adalah ukuran kanvas sumber, bukan ukuran pratinjau yang diperkecil.

Font tambahan: Public Sans ExtraBold dan Homenaje Regular.

Skala tipografi belum sepenuhnya seragam.

## 7. Bentuk dan Aset Visual

- Kartu putih dengan garis tepi tipis.
- Sudut membulat ringan.
- Bayangan halus pada sebagian kartu dan tombol.
- Tombol utama berwarna biru dengan teks putih.
- Ikon navigasi menggunakan simbol layanan yang mudah dikenali.
- Banner menggunakan ilustrasi layanan publik.
- Foto rumah ditampilkan besar dengan indikator lokasi.
- Avatar/inisial digunakan pada daftar pengajuan.

Rekomendasi:

- Tetapkan skala spacing.
- Seragamkan radius.
- Seragamkan ukuran ikon.
- Definisikan level elevasi.

Nilai baku keempatnya belum diverifikasi konsisten di seluruh desain.

## 8. Inventaris Komponen

Inventaris ini menjelaskan pola UI, bukan klaim bahwa semuanya sudah menjadi komponen native Figma.

| Komponen | Isi atau varian |
| --- | --- |
| Sidebar | Logo, menu berdasarkan peran, tema, keluar |
| Header | Logo, avatar, pemisah |
| Page heading | Kembali, judul, deskripsi |
| Button | Primary, secondary, outline, link, approve, reject |
| Input | Kosong, terisi, error, kata sandi |
| Verification code | Input digit terpisah |
| Read-only data | Label dan nilai dari sumber terintegrasi |
| Verification banner | Status NIK/KK dan hasil verifikasi |
| Service card | Ilustrasi, judul, deskripsi, aksi |
| Summary card | Ikon, jumlah, label, status |
| Badge | Aktif, perlu diperbarui, diverifikasi, selesai |
| Filter bar | Status, kecamatan, tanggal, pencarian |
| Table/list | Data pengajuan dan aksi detail |
| Date picker | Kalender dan tanggal terpilih |
| Time picker | Daftar slot waktu |
| Confirmation panel | Ringkasan dan persetujuan |
| Timeline | Tahap selesai, berjalan, dan berikutnya |
| Camera evidence | Kosong, kamera, foto, lokasi |
| Stock selector | Blangko tersedia/habis |
| Citizen detail | Identitas, keluarga, ekonomi, riwayat |

## 9. Alur Autentikasi

### Masuk

Pengantar → Formulir masuk → NIK dan kata sandi → Area sesuai peran.

State teramati:

- Formulir kosong.
- Nilai terisi.
- Kata sandi terlihat.
- Kata sandi tersamarkan.
- Kata sandi salah.

Rekomendasi:

- Validasi NIK 16 digit.
- Tampilkan error dekat input.
- Bedakan error kredensial dan gangguan layanan.
- Tentukan perilaku Ingat Saya dan masa sesi.

### Pendaftaran

NIK → Email/nomor handphone → Kata sandi → Konfirmasi → Daftar.

Frame pengisian bertahap tidak harus diterapkan sebagai halaman terpisah.

Kebijakan kata sandi dan verifikasi akun baru belum lengkap.

### Pemulihan Kata Sandi

Masukkan kontak → Kirim permintaan → Verifikasi kode → Kata sandi baru → Berhasil.

Salinan desain menyebut kode lima digit.

Perlu ditentukan:

- Masa berlaku kode.
- Batas percobaan.
- Jeda kirim ulang.
- Dukungan nomor handphone/SMS.
- Urutan pesan berhasil.

## 10. Alur KTP & Dukcapil

### Pilihan Layanan

- Ajukan KTP Baru.
- Tracking Pengajuan KTP.

Desain menekankan pengambilan data otomatis dan pengurangan fotokopi dokumen.

### Pengajuan

1. Periksa status NIK dan sinkronisasi KK.
2. Tinjau identitas pemohon.
3. Pilih jenis pengajuan.
4. Pilih tanggal perekaman biometrik.
5. Pilih slot waktu.
6. Tinjau ringkasan dan lokasi layanan.
7. Berikan persetujuan.
8. Konfirmasi dan kirim.
9. Pantau perkembangan.

Data pemohon:

- Nama.
- NIK.
- Tempat/tanggal lahir.
- Jenis kelamin.
- Alamat.
- Agama.
- Status perkawinan.
- Pekerjaan.
- Kewarganegaraan.

Varian teramati:

- Data tidak sesuai.
- Data terverifikasi.
- Kalender terbuka.
- Tanggal terpilih.
- Daftar waktu.
- Jadwal lengkap.
- Konfirmasi.
- Pengajuan diproses.

### Tracking

Tahapan utama:

Pengajuan diterima → Verifikasi data → Perekaman biometrik → Menunggu cetak → KTP selesai.

Varian lain memisahkan menunggu perekaman dan perekaman selesai serta menggunakan istilah KTP siap diambil.

Perlu satu model status final.

Informasi tracking:

- Nomor pengajuan.
- Jenis layanan.
- Tanggal.
- Lokasi.
- Identitas tersamarkan.
- Status dan keterangan tahap.

Konflik: tombol Upload masih muncul meskipun salinan menyatakan tidak perlu mengunggah fotokopi dokumen. Fungsi tombol tersebut perlu dipastikan.

## 11. Alur Bansos & Desil

### Ringkasan Desil

Menampilkan:

- Desil saat ini.
- Status data kesejahteraan.
- Tanggal penetapan/pembaruan.
- Sumber data.
- Aksi peninjauan.

Sumber yang disebut: DTKS, Dukcapil, dan BPS.

Keberadaan label sumber tidak membuktikan integrasinya tersedia.

Angka desil dalam mockup adalah contoh, bukan aturan resmi penentuan bantuan.

### Pengajuan Peninjauan

1. Tinjau identitas.
2. Tinjau data keluarga.
3. Tinjau kondisi ekonomi.
4. Ambil foto kondisi rumah.
5. Sertakan lokasi.
6. Tinjau ringkasan.
7. Berikan persetujuan kebenaran data.
8. Kirim.
9. Pantau peninjauan.

Data yang muncul:

- Nama dan NIK tersamarkan.
- Alamat.
- Anggota keluarga.
- Anak sekolah.
- Orang dewasa/tanggungan.
- Status pekerjaan.
- Pendapatan.
- Aset kendaraan.
- Perubahan terakhir.
- Sumber data.
- Alasan pengajuan.

### Bukti Rumah

Layar terperinci menyebut:

- Foto langsung dari kamera.
- Tidak menggunakan galeri.
- Lokasi dicatat otomatis.

Eksplorasi awal masih menyebut kamera atau file.

Kebijakan final perlu dikonfirmasi.

Desil sementara harus dibedakan dari hasil final dan tidak boleh dianggap jaminan bantuan.

### Tracking

Pengajuan dibuat → Data otomatis diverifikasi → Verifikasi admin → Hasil sementara → Pengecekan tempat → Verifikasi Dinsos → Hasil peninjauan.

Hasil akhir dapat memuat:

- Perubahan desil.
- Keputusan.
- Pembaruan data.
- Lihat Detail.
- Kembali ke Beranda.

Indikator selesai hanya boleh digunakan untuk tahap yang benar-benar selesai.

## 12. Area Admin

### Dashboard

- Ringkasan pengajuan masuk.
- Dalam proses.
- Selesai.
- Daftar pengajuan terbaru.
- Badge status.
- Tanggal/jam.
- Aksi Lihat.

Angka pada mockup merupakan contoh.

### Pengajuan Desil

- Filter status, kecamatan, dan tanggal.
- Pencarian NIK/nama.
- Detail pemohon.
- Verifikasi identitas, keluarga, dan ekonomi.
- Foto rumah.
- Lokasi dan Buka di Map.
- Perbandingan desil awal/sementara/saat ini.
- Tolak, Dalam Peninjauan, dan Setuju.

Mockup WhatsApp menggambarkan koordinasi pemeriksaan tambahan, bukan bukti integrasi atau keputusan otomatis.

### Pengajuan KTP

- Daftar dan detail pengajuan.
- Data pemohon.
- Data pengajuan.
- Verifikasi NIK/KK.
- Status penduduk.
- Usia.
- Ketersediaan blangko.
- Persetujuan/penolakan.
- Status proses.

Pisahkan:

1. Status persetujuan.
2. Status produksi KTP.
3. Ketersediaan blangko.

Blangko habis tidak otomatis berarti pengajuan ditolak.

### Data Warga

- Daftar warga.
- Identitas.
- Data keluarga.
- Kondisi ekonomi.
- Desil.
- Informasi bantuan.
- Riwayat pengajuan.

Desil dan status penerimaan bantuan adalah informasi berbeda.

## 13. Profil dan Petugas

### Profil Warga

- Nama.
- NIK tersamarkan.
- Jenis kelamin.
- Tempat/tanggal lahir.
- Telepon.
- Alamat.
- Email.
- Status verifikasi.
- Tanggal daftar.
- Login terakhir.
- Ubah Data.
- Ganti Foto.

Bedakan data akun yang dapat diedit langsung dari data kependudukan yang memerlukan koreksi resmi.

### Petugas

Dashboard petugas sudah terlihat, tetapi contoh daftar masih mencampurkan konteks KTP dan desil.

Isi, akses, serta kewenangan perlu diselaraskan sebelum implementasi.

## 14. Model Informasi

| Kelompok | Informasi inti |
| --- | --- |
| Akun | Peran, kontak, verifikasi, avatar |
| Warga | Identitas, NIK, alamat, status |
| Keluarga | Anggota, anak sekolah, tanggungan |
| Ekonomi | Pekerjaan, pendapatan, aset, sumber |
| Pengajuan KTP | Nomor, jenis, jadwal, lokasi, verifikasi |
| Pengajuan desil | Alasan, desil awal/sementara/final, status |
| Bukti rumah | Foto, lokasi, hasil pemeriksaan |
| Keputusan | Hasil, catatan, waktu, penanggung jawab |
| Blangko | Ketersediaan dan jumlah stok |

Metadata audit dan waktu pengambilan bukti direkomendasikan; belum semuanya ditetapkan pada desain.

Jangan menggabungkan jenis layanan, tahap proses, keputusan, dan status koreksi data menjadi satu status tanpa pemetaan.

## 15. Responsivitas dan Aksesibilitas

Desain didominasi desktop. Alur mobile lengkap belum terbukti tersedia.

Rekomendasi:

- Sidebar dapat dibuka/tutup pada layar kecil.
- Panel dua kolom berubah menjadi satu kolom.
- Tabel memiliki strategi overflow atau versi kartu.
- Jangan sekadar mengecilkan seluruh desktop.
- Sediakan fokus terlihat dan navigasi keyboard.
- Gunakan label permanen untuk input.
- Beri nama aksesibel pada tombol ikon.
- Jangan mengandalkan warna saja untuk status.
- Targetkan WCAG AA.
- Sediakan pesan error dengan tindakan pemulihan.
- Tangani penolakan izin kamera/lokasi.
- Umumkan perubahan status kepada pembaca layar.

Kontras seluruh warna belum diuji lengkap.

## 16. Privasi dan Keamanan

Rekomendasi implementasi:

1. Samarkan NIK pada ringkasan, daftar, dan percakapan.
2. Jangan menggunakan data pribadi atau contoh kata sandi dari mockup sebagai data aplikasi.
3. Jelaskan penggunaan foto rumah dan lokasi.
4. Batasi data sensitif berdasarkan peran.
5. Catat perubahan data, status, stok, dan keputusan.
6. Jangan mengirim informasi sensitif ke kanal eksternal tanpa kebijakan yang disetujui.
7. Tampilkan sumber serta waktu pembaruan data.
8. Tentukan masa simpan dan prosedur koreksi/penghapusan.

## 17. Inkonsistensi dan Keputusan Terbuka

| Temuan | Tindak lanjut |
| --- | --- |
| Banyak frame duplikat | Konsolidasikan sebagai state/varian |
| Salah eja pada label | Seragamkan Bahasa Indonesia |
| Password/kata sandi bercampur | Pilih istilah konsisten |
| Tracking/pelacakan bercampur | Pilih istilah konsisten |
| Nama, tanggal, dan pekerjaan berbeda | Gunakan data contoh konsisten |
| Deskripsi desil menyebut KTP | Koreksi sesuai layanan |
| Tidak perlu dokumen tetapi ada Upload | Tetapkan fungsi unggahan |
| Kamera saja vs kamera/file | Pilih kebijakan bukti |
| Tracking KTP lima dan enam tahap | Tetapkan model final |
| Desil sementara/final bercampur | Bedakan hasil tiap tahap |
| Dashboard petugas mencampurkan layanan | Sesuaikan konteks peran |
| Dark Mode belum lengkap | Lengkapi token dan state |
| Beberapa menu belum memiliki layar rinci | Lengkapi cakupan |
| State gagal belum lengkap | Tambahkan error, retry, loading |

Keputusan lain:

- Aturan penetapan desil.
- Integrasi data yang tersedia.
- Pembagian tugas admin/petugas.
- Alur koreksi data.
- Alasan penolakan dan banding.
- Kuota serta pembatalan jadwal.
- Penanganan blangko habis.
- Kebijakan kamera dan geotagging.

## 18. Checklist Handoff

- [ ] Pilih versi layar acuan.
- [ ] Konsolidasikan warna dan tipografi.
- [ ] Tetapkan spacing, radius, ikon, dan elevasi.
- [ ] Definisikan seluruh state komponen.
- [ ] Selaraskan status antarperan.
- [ ] Lengkapi alur KTP.
- [ ] Lengkapi alur desil.
- [ ] Lengkapi Notifikasi, Pengajuan Saya, dan Pengaturan.
- [ ] Konfirmasi integrasi dan kewenangan layanan.
- [ ] Tambahkan loading, empty, error, dan retry.
- [ ] Tangani izin kamera/lokasi.
- [ ] Tangani jadwal penuh dan blangko habis.
- [ ] Cegah pengiriman pengajuan ganda.
- [ ] Siapkan layout mobile.
- [ ] Periksa aksesibilitas.
- [ ] Ganti data pribadi dengan placeholder aman.
- [ ] Rapikan salinan, format rupiah, tanggal, dan nomor pengajuan.

---


