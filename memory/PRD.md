# PrintOrder Frontend - PRD

## Original Problem Statement
Buatkan frontend web PrintOrder (tampilan web + mobile) dalam Bahasa Indonesia dengan 3 halaman:
1. **Halaman Awal**: form Alias + tombol Simpan Alias; input Kode Toko + icon barcode (scan) + tombol Cari.
2. **Konfirmasi Toko**: PP toko, nama, kode, alamat, jam buka, status buka/tutup, badge layanan, tombol konfirmasi.
3. **Sesi Cetak**: status sesi (session id, alias, kode toko), tombol akhiri sesi, toggle daftar tugas cetak, preview dokumen, info file (ukuran, halaman, nama, estimasi harga), pilih dokumen, isian salinan, dropdown B/W-Warna, dropdown ukuran kertas, isian rentang halaman, isian skala dengan segitiga up/down, catatan tambahan, checkbox S&K, tombol kirim tugas.

## User Choices
- Frontend-only dengan data mock
- Modern minimalis + aksen teal/cyan
- Scan barcode kamera asli (html5-qrcode)
- Dropdown "hp/warna" = Hitam-Putih vs Warna
- Bahasa Indonesia
- Branding boleh menonjol di halaman awal

## Architecture
- React 18 + Craco + Tailwind CSS 3
- React Router v6 (3 route: /, /store-confirm/:code, /session)
- State via React Context + localStorage (SessionContext)
- Icons: lucide-react
- Scanner: html5-qrcode (kamera belakang)
- Backend FastAPI minimal (hanya health endpoint, siap dihubungkan ke backend asli nanti)

## Core Requirements - IMPLEMENTED (10 Jan 2026)
- [x] Halaman Awal: Alias + Simpan Alias (persist localStorage), Kode Toko + scan barcode + Cari Toko
- [x] Modal Scan Barcode kamera asli dengan viewfinder animasi laser + fallback demo pill
- [x] Halaman Konfirmasi Toko: foto, badge buka/tutup live, kode mono, alamat, jam, kontak, rating, 7+ badge layanan, ringkasan alias, tombol Konfirmasi & Mulai Cetak
- [x] Halaman Sesi Cetak: session-id #PO-xxxxx-X, pill header, Akhiri Sesi (dialog konfirmasi), toggle Daftar Tugas (counter), preview dokumen interaktif prev/next page, info file 4-cell, estimasi harga realtime
- [x] Form spesifikasi: stepper salinan, dropdown B/W vs Warna (dengan tarif), dropdown kertas (A4/F4/A3/Legal + multiplier), rentang halaman (parser '1-5, 8'), scale 25-200% dengan tombol segitiga up/down, catatan textarea, checkbox T&C, submit dengan toast sukses
- [x] Daftar Tugas drawer: JOB-### badge, spesifikasi ringkas, status pill, harga
- [x] Fully responsive (mobile 390px tanpa overflow horizontal)
- [x] Semua elemen interaktif memiliki data-testid

## Admin Portal - IMPLEMENTED (10 Jan 2026, iteration 2 - 37/37 tests pass)
- [x] Route `/admin` dengan header: badge status toko (TOKO BUKA/TUTUP), tombol Klien Desktop, profile pill (username + kode toko)
- [x] 5 tab terpisah: Ringkasan, Billing, Toko, Layanan, Bantuan
- [x] **Ringkasan**: salam dinamis + 5 stat card (klien online, tugas hari ini, selesai, ditolak/batal, estimasi pendapatan) + tombol Lihat Semua Tugas
- [x] **Billing**: daftar order + refresh, info kredit (bisa dipakai, terjadwal, total hak kredit, kedaluwarsa, bisa dipakai sekarang, free active), 4 plan card (Free/Starter/Pro-Paling Hemat/Beli Kredit)
- [x] **Toko**: pengaturan toko (PP + ganti foto, nama, kode, status dropdown, waktu operasional via Modal A1, kontak, alamat, QR + download), tabel Klien Desktop (nama, client ID, status online/siap, printer aktif, terakhir aktif, tombol Unbind + info popover + refresh)
- [x] **Layanan**: ukuran kertas (5 checkbox opsi), mode warna (B/W + Warna checkbox + harga editable), simpan pengaturan layanan
- [x] **Bantuan**: Coming Soon placeholder
- [x] **Modal A0** (Profile): logout, pengaturan akun (username, email, PIN status badge), ganti password (lama/baru/konfirmasi + lupa password link + validasi 6+ karakter dan match), kelola PIN (password + PIN 4-8 digit + konfirmasi) - PIN sukses mengubah status badge jadi "Aktif"
- [x] **Modal A1** (Hours): 7 hari dengan checkbox + input jam buka/tutup (disabled saat checkbox off), simpan & batal
- [x] Link "Portal Mitra" di header utama untuk navigasi dari halaman pelanggan ke /admin

## Validated via Testing Agent (iteration_1.json - 100% pass)
15/15 skenario lulus: alias save, quick pill prefill, invalid code error, barcode modal, store confirm navigation, session creation, realtime price calc, copies linear scaling, color mode recalc, scale steppers clamping, T&C validation, task drawer, end session flow, mobile viewport.

## Future / Backlog
- P1: Integrasi backend asli PrintOrder (/api/sessions, /api/jobs, /api/stores)
- P1: Status realtime WebSocket untuk update status tugas (queued -> processing -> ready)
- P2: Upload file nyata ke server + preview PDF menggunakan pdf.js
- P2: Riwayat sesi cetak lintas kunjungan
- P2: Multi-dokumen dalam satu tugas

## File Map
- /app/frontend/src/App.js - router + SessionProvider
- /app/frontend/src/pages/Home.js
- /app/frontend/src/pages/StoreConfirm.js
- /app/frontend/src/pages/PrintSession.js
- /app/frontend/src/components/Header.js
- /app/frontend/src/components/BarcodeScanner.js
- /app/frontend/src/lib/SessionContext.js
- /app/frontend/src/lib/mock.js - mock stores, sample docs, price formulas
- /app/backend/server.py - minimal FastAPI (placeholder /api/health)
