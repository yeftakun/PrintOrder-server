# Software Requirements Specification (SRS)
## PrintOrder - Platform Layanan Cetak Dokumen Mandiri (MVP)

**Versi Dokumen:** 1.0.0
**Tanggal:** 4 Oktober 2026

---

## 1. Pendahuluan (Introduction)

### 1.1 Tujuan (Purpose)
Dokumen Software Requirements Specification (SRS) ini dibuat untuk mendefinisikan secara rinci spesifikasi perangkat lunak untuk sistem **PrintOrder** (versi *Minimum Viable Product* / MVP). Dokumen ini bertujuan menjadi panduan teknis utama bagi tim pengembang, arsitek perangkat lunak, QA, dan pemangku kepentingan (stakeholder) dalam membangun ulang aplikasi PrintOrder agar siap beroperasi secara komersial sebagai produk SaaS (*Software as a Service*).

### 1.2 Konvensi Dokumen (Document Conventions)
Dokumen ini disusun menggunakan standar **IEEE 830-1998** (yang menjadi dasar ISO/IEC 29148).
Prioritas kebutuhan dinotasikan menggunakan format **MoSCoW**:
*   **Must Have (M)**: Kebutuhan mutlak untuk MVP.
*   **Should Have (S)**: Kebutuhan penting, tetapi dapat ditunda jika waktu/biaya terbatas.
*   **Could Have (C)**: Fitur tambahan (*nice to have*).
*   **Won't Have (W)**: Tidak termasuk dalam rilis MVP.

### 1.3 Ruang Lingkup Produk (Product Scope)
**PrintOrder** adalah platform berbasis awan (SaaS) yang menjembatani pelanggan (end-user) dan mitra percetakan (merchant). Platform ini memungkinkan pelanggan untuk mengirimkan dokumen siap cetak (PDF atau Gambar) ke antrean percetakan secara mandiri melalui *web browser* (tanpa menginstal aplikasi atau mengirim via aplikasi perpesanan pribadi), serta mengatur preferensi cetak. Mitra percetakan menggunakan Portal Web untuk mengatur toko dan Aplikasi Desktop Client berbasis Tauri untuk menerima serta memproses antrean cetak tersebut ke printer lokal. Model bisnis platform kepada mitra adalah B2B *Pay-Per-Print* (kredit cetak). Pembayaran cetak dari pelanggan ke mitra dilakukan *Over-the-Counter* (di kasir percetakan).

### 1.4 Referensi (References)
*   Arsitektur dan basis kode PrintOrder v0.1 (Tugas Akhir/Skripsi).
*   Dokumentasi `THISSYS.md`, `SYS-BEHAVIOR.md` (legacy system).
*   IEEE Std 830-1998, *IEEE Recommended Practice for Software Requirements Specifications*.

---

## 2. Deskripsi Umum (Overall Description)

### 2.1 Perspektif Produk (Product Perspective)
PrintOrder merupakan sistem baru yang sepenuhnya mandiri (*standalone*), terdiri dari tiga subsistem utama:
1.  **Backend API**: Node.js, Express/NestJS, PostgreSQL (Prisma ORM), WebSocket.
2.  **Frontend Web**: Next.js, melayani tiga portal (Pelanggan, Mitra, Admin).
3.  **Desktop Client**: Tauri (Rust + Web Frontend), dipasang di komputer kasir/operator mitra percetakan.

### 2.2 Fungsi Produk (Product Functions)
Fungsionalitas utama sistem (MVP) meliputi:
*   **Pendaftaran & Autentikasi**: Autentikasi mitra dan admin dengan JWT.
*   **Manajemen Toko**: Mitra dapat mengatur nama toko, jadwal buka/tutup, profil, dan kode unik URL toko.
*   **Antrean Cetak Pelanggan (*Customer Print Session*)**: Pelanggan memindai QR/membuka URL toko, mengunggah dokumen (PDF/Images), mengatur opsi cetak, dan melihat status realtime.
*   **Pemrosesan Desktop Client**: Desktop client terhubung via WebSocket, menerima job masuk, mengunduh file secara otomatis, mencetak ke mesin lokal, dan memperbarui status.
*   **Penagihan (*Billing/Credits*)**: Mitra membeli saldo "kredit cetak" dari platform. Setiap 1 dokumen yang dicetak memotong saldo kredit mitra.
*   **Manajemen File & Privasi**: *Shredding* data (penghapusan aman) dan *auto-cleanup* otomatis untuk file yang sudah dicetak.

### 2.3 Kelas Pengguna dan Karakteristik (User Classes and Characteristics)
1.  **Pelanggan (Guest)**: Pengguna akhir. Karakteristik: Ingin antarmuka yang sangat sederhana, tidak perlu membuat akun, diakses lewat smartphone.
2.  **Mitra Percetakan (Merchant)**: Pemilik atau operator toko. Karakteristik: Menggunakan PC/Laptop, butuh aplikasi *desktop* yang senyap dan tidak mengganggu alur kerja.
3.  **Administrator (Platform Owner)**: Pengelola platform PrintOrder. Karakteristik: Membutuhkan *dashboard* untuk memonitor pendaftaran toko baru, log sistem, dan verifikasi pembelian saldo kredit mitra.

### 2.4 Lingkungan Operasi (Operating Environment)
*   **Server Backend**: Lingkungan Linux/Docker container (VPS/Cloud). Node.js v20+, PostgreSQL 16+.
*   **Frontend Web**: Berjalan di berbagai peramban modern (Chrome, Safari, Firefox, Edge) dan responsif untuk seluler maupun desktop.
*   **Desktop Client**: OS Windows (Windows 10/11), macOS. Butuh *system runtime* WebView2 (Windows).

### 2.5 Batasan Desain & Implementasi (Design and Implementation Constraints)
*   **Keamanan Data**: Semua dokumen harus dihapus secara otomatis dalam maksimal X menit setelah sesi selesai/dicetak untuk menjamin privasi.
*   **Tanpa Konversi Server**: Server tidak melakukan konversi dokumen (misal: DOCX ke PDF). Hal ini membatasi *input* pelanggan hanya pada format PDF dan Gambar.
*   **Tanpa Payment Gateway C2B**: Transaksi pelanggan ke mitra tetap tunai/offline.

---

## 3. Kebutuhan Spesifik (Specific Requirements)

### 3.1 Kebutuhan Antarmuka Eksternal (External Interface Requirements)

#### 3.1.1 Antarmuka Pengguna (User Interfaces)
*   **UI Pelanggan**: Halaman pendaratan URL `/p/:kodeToko` dengan panduan langkah per langkah untuk *upload* dan pengaturan konfigurasi cetak. Harus *mobile-first*.
*   **UI Portal Mitra**: *Dashboard* statistik, manajemen printer, pengaturan toko, dan riwayat top-up.
*   **UI Desktop Client**: *System tray icon* dengan *window* pop-up minimalis untuk notifikasi pesanan masuk dan melihat *log* proses mesin cetak.

#### 3.1.2 Antarmuka Komunikasi (Communications Interfaces)
*   **Protokol REST API**: Komunikasi *stateless* untuk *upload* dokumen, *login*, *billing*, berbasis HTTPS.
*   **Protokol WebSocket (WSS)**: Koneksi persisten untuk notifikasi *realtime*, pembaruan status *job*, dan *heartbeat client desktop*.
*   **Protokol SMTP**: Untuk pengiriman email *reset password* atau notifikasi akun.

### 3.2 Kebutuhan Fungsional (Functional Requirements)

#### 3.2.1 Modul Pelanggan (*Customer Experience*)
*   **[REQ-CUST-01] (M)** Sistem harus memungkinkan pelanggan membuat sesi cetak sementara hanya dengan mengunjungi URL khusus toko tanpa perlu mendaftar.
*   **[REQ-CUST-02] (M)** Sistem hanya menerima dokumen dengan ekstensi `.pdf`, `.jpg`, `.jpeg`, `.png`, dan `.webp`. Maksimal ukuran file 25MB.
*   **[REQ-CUST-03] (M)** Sistem harus mengekstrak jumlah halaman dari PDF yang diunggah untuk ditampilkan kepada pelanggan.
*   **[REQ-CUST-04] (M)** Sistem harus memberikan opsi spesifikasi cetak (Ukuran Kertas, Mode Warna, Orientasi, Rentang Halaman, Jumlah Salinan).
*   **[REQ-CUST-05] (M)** Sistem harus menampilkan notifikasi visual (perubahan status *realtime*) dari antrean cetak pelanggan.

#### 3.2.2 Modul Mitra (*Merchant Management*)
*   **[REQ-MITRA-01] (M)** Sistem harus memungkinkan mitra mengelola profil toko (Nama, Alamat, Jam Operasional, Status Buka/Tutup).
*   **[REQ-MITRA-02] (S)** Sistem harus menyuntikkan *OpenGraph metadata* pada URL toko (SEO) agar link yang dibagikan via WhatsApp menampilkan pratinjau yang menarik.
*   **[REQ-MITRA-03] (M)** Sistem harus mengurangi 1 saldo kredit per dokumen cetak yang berhasil diproses oleh *desktop client*.
*   **[REQ-MITRA-04] (M)** Sistem akan memblokir pembuatan antrean (*print job*) baru jika saldo kredit mitra habis.

#### 3.2.3 Modul Desktop Client (*Tauri Application*)
*   **[REQ-DESK-01] (M)** Aplikasi Desktop harus mendaftarkan dirinya (Device UUID) dan *pairing* ke akun Mitra menggunakan *token auth*.
*   **[REQ-DESK-02] (M)** Aplikasi Desktop harus dapat membaca dan melaporkan daftar perangkat printer fisik yang terhubung ke OS lokal ke server.
*   **[REQ-DESK-03] (M)** Aplikasi Desktop harus terhubung ke server via WebSocket dan menerima kejadian (event) `job.created`.
*   **[REQ-DESK-04] (M)** Aplikasi Desktop harus melakukan klaim (*job locking*) sebelum mencetak untuk mencegah ganda.
*   **[REQ-DESK-05] (M)** Aplikasi Desktop harus dapat mengunduh dokumen secara asinkron lalu mengirimkannya ke antrean cetak OS (Spooler).

#### 3.2.4 Modul Admin & Billing (*Platform Management*)
*   **[REQ-ADMN-01] (M)** Admin dapat masuk ke Portal Admin untuk melihat ringkasan performa platform.
*   **[REQ-ADMN-02] (M)** Admin dapat mengelola dan memverifikasi pesanan *top-up* saldo kredit dari mitra.
*   **[REQ-ADMN-03] (S)** Sistem mencatat *Audit Logs* untuk semua peristiwa krusial (pembayaran, login, reset PIN).

#### 3.2.5 Modul Manajemen Berkas (*Cleanup & Privasi*)
*   **[REQ-FILE-01] (M)** Sistem harus menghapus berkas dokumen secara fisik (*secure delete* / *shredding*) saat status tugas cetak mencapai titik terminal (`done`, `canceled`, `rejected`, `failed`).
*   **[REQ-FILE-02] (M)** Sistem harus memiliki jadwal otomatis di latar belakang yang mendeteksi dan menghapus berkas yatim piatu (*orphan files*) dan sesi yang kedaluwarsa.

### 3.3 Kebutuhan Non-Fungsional (Non-Functional Requirements)

#### 3.3.1 Kinerja (Performance)
*   **Respon Waktu API**: 95% *request* REST API (selain *upload/download*) harus memiliki *response time* di bawah 200 milidetik.
*   **Latensi Realtime**: Notifikasi perubahan status tugas dari *desktop* ke *browser* pelanggan maksimal berdurasi jeda 500ms.

#### 3.3.2 Keamanan (Security)
*   Sistem menggunakan *hash* `bcrypt` untuk melindungi *password* mitra/admin dan *PIN*.
*   Otorisasi *endpoint* API menggunakan skema *Access Token* JWT (15 menit) dan *Refresh Token* dengan sistem rotasi yang disimpan dalam *database*.
*   Mencegah *directory traversal* dengan memberikan nama acak (*UUID*) pada berkas dokumen saat disimpan.

#### 3.3.3 Skalabilitas & Arsitektur (*Scalability*)
*   **Pola Adaptor (*Adapter Pattern*)**: Walaupun penyimpanan file dan penguncian antrean diatur di disk/memori lokal untuk MVP, antarmukanya harus bersifat generik (contoh: antarmuka `StorageService` dan `LockService`) agar mempermudah peralihan ke Amazon S3 atau Redis *Distributed Lock* di fase *scaling*.

#### 3.3.4 Ketersediaan (Availability)
*   Aplikasi *desktop* (Tauri) harus memiliki kemampuan *auto-reconnect* terhadap koneksi WebSocket yang terputus dengan *backoff* eksponensial.

---
*Akhir Dokumen SRS.*
