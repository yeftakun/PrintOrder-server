# Sifat Sistem Berdasarkan `.env`

Dokumen ini menerjemahkan konfigurasi aktif pada root [`.env`](../.env) menjadi perilaku sistem PrintOrder. Tujuannya adalah membantu pengembang memahami konsekuensi operasional konfigurasi saat ini; untuk arti dan format setiap variabel, lihat [ENVIRONMENT.md](ENVIRONMENT.md).

> Dokumen ini tidak menyalin nilai secret, password SMTP, atau connection string database. `.env` tetap menjadi sumber konfigurasi yang berlaku saat proses server dimulai.

## Ringkasan konfigurasi aktif

| Area | Sifat sistem saat ini |
| --- | --- |
| Lingkungan | Mode `development` pada mesin Windows lokal. |
| Penyimpanan data | PostgreSQL lokal digunakan sebagai penyimpanan utama. |
| File | Dokumen job dan upload disimpan pada direktori lokal proyek. |
| Akses API | Autentikasi bearer token diberlakukan; pendaftaran akun publik tetap dibuka. |
| Realtime | Server menyediakan WebSocket pada path `/ws` dan menganggap client cepat offline. |
| Email | Reset password mengirim email melalui SMTP, bukan hanya ditulis ke log. |
| Verifikasi manusia | Cloudflare Turnstile dinonaktifkan. |
| Pembayaran | Instruksi pembayaran masih berupa data contoh/dummy. |

## Runtime, database, dan monitoring

Server utama berjalan pada port `3000`. Sistem menggunakan PostgreSQL karena `USE_DB=true`; akibatnya database lokal yang tercantum pada `DATABASE_URL` harus dapat diakses sebelum fitur yang memakai data persisten berfungsi. Penyimpanan JSON lokal bukan mode aktif.

Dashboard monitoring juga dikonfigurasi pada port `3000`. Bila server utama dan dashboard dijalankan bersamaan pada mesin yang sama, proses kedua yang mulai akan gagal melakukan bind port. Ubah `MONITORING_PORT` menjadi port lain, misalnya `3100`, agar keduanya dapat berjalan bersamaan.

Karena `NODE_ENV=development`, konfigurasi ini cocok untuk pengembangan lokal, bukan deployment publik. Variabel tersebut terutama dipakai oleh tooling/deployment; keamanan endpoint tetap dikendalikan oleh `AUTH_ENFORCE`.

## Penyimpanan dan masa hidup file

Semua path storage menunjuk ke `D:\code\PrintForm-server`. Dengan demikian data aplikasi, file job, bukti pembayaran, dan foto profil tersimpan di disk komputer pengembang. Proses Node harus memiliki izin baca/tulis pada direktori tersebut.

Sistem menerima PDF, JPEG, PNG, Word, dan PowerPoint. Batasnya adalah:

| Objek | Batas aktif |
| --- | ---: |
| File job utama | 25 MiB |
| Bukti pembayaran | 25 MiB |
| Foto profil | 5 MiB |
| Total file aktif | 500 MiB |

Dokumen Office diproses dengan mode `SYNC`: permintaan preview/konversi menunggu hasil konversi PDF sebelum memberi respons. Ini membuat hasil tersedia langsung saat respons diterima, tetapi waktu respons bergantung pada LibreOffice dan ukuran dokumen.

File pada job berstatus terminal akan dihapus secara otomatis. File yang tidak lagi memiliki referensi dapat mulai dihapus setelah sekitar 5 detik, dan pemindaian pembersihan file berlangsung setiap 5 detik. Konfigurasi ini agresif untuk development; jangan mengandalkannya sebagai retensi arsip. Data client yang stale ditahan 14 hari, tetapi scheduler retensinya berjalan setiap 3 detik sehingga cukup intensif untuk lingkungan produksi.

## Client desktop, sesi cetak, dan realtime

Client desktop dianggap aktif selama masih memiliki heartbeat dalam 12 detik terakhir. Presence disinkronkan setiap 1 detik dan server mengirim ping WebSocket setiap 15 detik. Setelah koneksi realtime putus, toleransi offline hanya 1,2 detik; gangguan jaringan singkat dapat membuat status client cepat berubah menjadi offline.

Sesi cetak tanpa aktivitas kedaluwarsa setelah 30 detik dan pembersihannya berjalan tiap 10 detik. Ketika membuat sesi yang memerlukan konfirmasi client, server menunggu maksimum 6,5 detik dan memeriksa hasilnya setiap 300 milidetik. Konfigurasi ini cocok untuk umpan balik cepat, tetapi client yang lambat atau jaringan tidak stabil lebih mungkin dianggap gagal konfirmasi.

Daftar client juga dapat memuat client yang belum dikenali atau belum terikat ke akun karena `CLIENT_LIST_INCLUDE_UNRECOGNIZED=true`.

## Pembatasan trafik

Endpoint pendaftaran client dibatasi maksimal 20 permintaan per identitas pembatas dalam jendela 60 detik. Endpoint heartbeat dibatasi 120 permintaan per 60 detik. Dengan nilai tersebut, heartbeat normal tetap memiliki ruang, sedangkan loop client yang terlalu cepat dapat terkena pembatasan.

## Autentikasi dan kompatibilitas API

Endpoint yang dilindungi mengharuskan bearer token karena `AUTH_ENFORCE=true`. Access token berlaku 15 menit; refresh token dapat dipakai hingga 30 hari. Password akun di-hash menggunakan bcrypt dengan cost factor 12, yang memberikan perlindungan cukup kuat dengan konsekuensi proses hash sedikit lebih berat.

Pendaftaran akun publik tetap aktif. Artinya siapa pun yang dapat menjangkau aplikasi dapat mencoba membuat akun, kecuali terdapat pembatasan lain di lapisan aplikasi atau jaringan. Jalur kompatibilitas API lama untuk pembuatan sesi client dan filter daftar job dimatikan, sehingga sistem menggunakan alur berbasis akun yang baru.

## Email dan reset password

`MAIL_DRIVER=smtp` membuat aplikasi benar-benar mengirim email melalui server SMTP yang dikonfigurasi. Ini berbeda dari mode `log`, yang hanya mencetak isi email ke console. Token reset password berlaku 60 menit.

Namun `APP_BASE_URL` masih menunjuk ke `http://localhost:3000`. Email reset yang diterima pada perangkat lain akan mengarah ke `localhost` perangkat penerima, bukan ke komputer server. Untuk penggunaan publik, nilai ini harus diganti dengan URL HTTPS domain aplikasi.

## Turnstile dan pendaftaran otomatis

Walaupun key Turnstile telah tersedia di `.env`, `TURNSTILE_ENABLED=false` membuat verifikasi Cloudflare Turnstile tidak dijalankan. Dengan pendaftaran publik tetap aktif, sistem belum memakai challenge Turnstile untuk menahan bot. Aktifkan Turnstile hanya ketika frontend telah memakai site key yang sesuai dan hostname yang diizinkan telah benar.

## Pembayaran manual

Sistem menampilkan instruksi pembayaran manual, tetapi nama bank dan nomor rekening saat ini masih berupa placeholder. Order pembayaran memiliki batas waktu 24 jam. Jangan gunakan konfigurasi ini untuk menerima pembayaran aktual sebelum data rekening dan instruksinya diganti.

## Konsekuensi sebelum production

Sebelum dipublikasikan, lakukan perubahan berikut:

1. Set `NODE_ENV=production`, gunakan path Linux/host target, dan pisahkan `PORT` dari `MONITORING_PORT`.
2. Gunakan database dengan user dan password khusus aplikasi; jangan memakai kredensial lokal dummy.
3. Ganti kedua secret JWT dengan nilai acak yang baru dan aman. Penggantian secret akan mencabut token yang sedang aktif.
4. Ganti `APP_BASE_URL` dengan domain HTTPS publik dan pastikan reverse proxy meneruskan WebSocket pada `/ws`.
5. Verifikasi kredensial SMTP dan gunakan app password/provider credential yang khusus; jangan menyimpan password akun utama.
6. Aktifkan Turnstile setelah domain dan frontend siap, atau batasi pendaftaran publik bila fitur tersebut belum digunakan.
7. Tinjau interval pembersihan 3–5 detik serta toleransi offline 1,2 detik agar sesuai dengan beban dan kestabilan jaringan production.
8. Ganti informasi pembayaran dummy sebelum order pembayaran dapat digunakan oleh pengguna.
