# Konfigurasi Environment

Dokumen ini menjelaskan seluruh variabel pada root [`.env`](../.env) yang dibaca saat runtime oleh server PrintOrder dan aplikasi monitoring. File `.env` tidak disimpan oleh Git karena memuat konfigurasi mesin dan secret.

## Aturan Umum

- Format setiap baris adalah `NAMA_VARIABEL=nilai`.
- Nilai boolean yang diterima adalah `true`, `false`, `1`, `0`, `yes`, `no`, `on`, atau `off`.
- Nilai waktu berakhiran `_MS` menggunakan milidetik.
- Nilai ukuran berakhiran `_BYTES` menggunakan byte.
- Nilai CSV dipisahkan dengan koma tanpa spasi yang tidak diperlukan.
- Jangan menambahkan tanda kutip kecuali nilai memang harus memuatnya; `dotenv` akan membaca isi sesudah tanda `=` sebagai nilai.
- Ganti semua secret, password, dan URL lokal sebelum deployment produksi. Jangan menyalin `.env` ke dokumentasi, commit, atau chat.

## Runtime dan Database

| Variabel | Dipakai oleh | Nilai/format | Keterangan |
| --- | --- | --- | --- |
| `NODE_ENV` | Process manager/deployment | `development` atau `production` | Tidak dibaca langsung oleh kode aplikasi, tetapi harus `production` pada VPS. |
| `PORT` | Server utama | nomor port, mis. `3000` | Port HTTP untuk `server.js`. |
| `MONITORING_PORT` | `monitoring/server.js` | nomor port, mis. `3100` | Port dashboard monitoring. Harus berbeda dari `PORT` jika dua proses berjalan di mesin yang sama. |
| `USE_DB` | Server utama | `true` atau `false` | `true` memakai PostgreSQL; `false` memakai penyimpanan JSON lokal. |
| `DATABASE_URL` | Server utama dan monitoring | PostgreSQL connection string | Wajib saat `USE_DB=true` dan selalu wajib untuk monitoring. Contoh: `postgresql://user:password@host:5432/database`. |

## Direktori Penyimpanan

| Variabel | Dipakai oleh | Nilai/format | Keterangan |
| --- | --- | --- | --- |
| `STORAGE_DIR` | JSON storage, file job, preview | path absolut | Root untuk data internal. Default kode: `<root>/storage`. Gunakan path Linux pada VPS, mis. `/var/www/printorder-server/storage`. |
| `UPLOADS_DIR` | Upload bukti pembayaran dan foto profil | path absolut | Root upload publik. Default kode: `<root>/uploads`. |
| `PAYMENT_PROOFS_DIR` | Upload bukti pembayaran | path absolut | Default: `<UPLOADS_DIR>/payment-proofs`. |
| `PROFILE_PHOTOS_DIR` | Upload foto profil | path absolut | Default: `<UPLOADS_DIR>/profile-photos`. |

## Client, Sesi, dan Realtime

| Variabel | Nilai/format | Keterangan |
| --- | --- | --- |
| `CLIENT_TTL_MS` | durasi ms | Lama heartbeat client tetap dianggap online. Juga digunakan monitoring untuk menghitung status client. |
| `CLIENT_LIST_INCLUDE_UNRECOGNIZED` | boolean | Menentukan apakah API daftar client menyertakan client yang belum terikat akun. |
| `SESSION_TTL_MS` | durasi ms | Masa aktif sesi cetak tanpa aktivitas. |
| `SESSION_CLEANUP_INTERVAL_MS` | durasi ms | Interval scheduler untuk membersihkan sesi kedaluwarsa. |
| `SESSION_CREATE_CONFIRM_TIMEOUT_MS` | durasi ms | Batas tunggu konfirmasi client saat sesi dibuat. |
| `SESSION_CREATE_CONFIRM_POLL_INTERVAL_MS` | durasi ms | Interval polling selama proses konfirmasi pembuatan sesi. |
| `REALTIME_PATH` | path URL, mis. `/ws` | Endpoint WebSocket server. Harus sesuai dengan konfigurasi reverse proxy dan client desktop. |
| `REALTIME_PRESENCE_SYNC_INTERVAL_MS` | durasi ms | Interval sinkronisasi presence realtime. |
| `REALTIME_PING_INTERVAL_MS` | durasi ms | Interval ping WebSocket dari server. |
| `REALTIME_CLIENT_OFFLINE_GRACE_MS` | durasi ms | Toleransi setelah koneksi WebSocket putus sebelum client dianggap offline. |

## Upload, Preview, dan Siklus File

| Variabel | Nilai/format | Keterangan |
| --- | --- | --- |
| `CONVERSION_MODE` | `SYNC` atau `HYBRID` | `SYNC` menunggu konversi DOC/DOCX/PPT/PPTX ke PDF; `HYBRID` segera memberi respons lalu konversi di background. Konversi membutuhkan LibreOffice yang tersedia di host. |
| `MAX_UPLOAD_BYTES` | ukuran byte | Batas ukuran file job utama. Contoh `26214400` = 25 MiB. |
| `PAYMENT_PROOF_MAX_BYTES` | ukuran byte | Batas ukuran upload bukti pembayaran. Jika tidak diisi, mengikuti `MAX_UPLOAD_BYTES`. |
| `PROFILE_PHOTO_MAX_BYTES` | ukuran byte | Batas ukuran foto profil. |
| `FILE_QUOTA_BYTES` | ukuran byte | Kuota total file aktif. Contoh `524288000` = 500 MiB. |
| `AUTO_DELETE_TERMINAL_JOB_FILES` | boolean | Jika bukan `false`, file job fisik dihapus saat job berstatus terminal. |
| `ALLOWED_UPLOAD_MIME_TYPES` | CSV MIME type | Allowlist tipe file job. Nilai saat ini mencakup PDF, JPEG, PNG, Word, dan PowerPoint. |
| `ALLOWED_UPLOAD_EXTENSIONS` | CSV ekstensi | Allowlist ekstensi file job, mis. `.pdf,.jpg,.jpeg,.png,.doc,.docx,.ppt,.pptx`. |
| `ORPHAN_GRACE_MS` | durasi ms | File orphan baru boleh dibersihkan setelah periode ini. |
| `FILE_CLEANUP_INTERVAL_MS` | durasi ms | Interval pemindaian dan pembersihan file orphan. |
| `CLIENT_RETENTION_DAYS` | jumlah hari | Retensi data client stale sebelum dibersihkan. |
| `RETENTION_CLEANUP_INTERVAL_MS` | durasi ms | Interval pembersihan client, sesi, dan job yang melewati retensi. |

## Rate Limit Endpoint Client

| Variabel | Nilai/format | Keterangan |
| --- | --- | --- |
| `CLIENT_REGISTER_RATE_LIMIT_WINDOW_MS` | durasi ms | Jendela waktu pembatasan endpoint registrasi client. |
| `CLIENT_REGISTER_RATE_LIMIT_MAX` | bilangan bulat | Maksimum registrasi per key selama satu window. |
| `CLIENT_HEARTBEAT_RATE_LIMIT_WINDOW_MS` | durasi ms | Jendela waktu pembatasan endpoint heartbeat. |
| `CLIENT_HEARTBEAT_RATE_LIMIT_MAX` | bilangan bulat | Maksimum heartbeat per key selama satu window. |

## Pembayaran

| Variabel | Nilai/format | Keterangan |
| --- | --- | --- |
| `PAYMENT_BANK_NAME` | teks | Nama bank/rekening yang ditampilkan untuk pembayaran manual. |
| `PAYMENT_ACCOUNT_NUMBER` | teks | Nomor rekening pembayaran. Simpan sebagai teks agar nol awal tidak hilang. |
| `PAYMENT_ACCOUNT_NAME` | teks | Nama pemilik rekening. |
| `PAYMENT_MANUAL_INSTRUCTIONS` | teks | Instruksi transfer dan upload bukti yang ditampilkan ke pengguna. |
| `PAYMENT_ORDER_TTL_HOURS` | jumlah jam | Batas waktu order pembayaran sebelum kedaluwarsa. |

## Autentikasi dan Kompatibilitas API

| Variabel | Nilai/format | Keterangan |
| --- | --- | --- |
| `AUTH_ENFORCE` | boolean | Mengaktifkan validasi bearer token pada endpoint API yang dilindungi. Harus `true` di produksi. |
| `AUTH_ALLOW_PUBLIC_REGISTER` | boolean | Mengizinkan pendaftaran akun tanpa login. Matikan jika register hanya melalui admin. |
| `AUTH_ACCESS_TOKEN_SECRET` | secret acak | Kunci penandatangan access token. Wajib unik dan panjang pada produksi. Mengganti nilai ini membatalkan access token yang aktif. |
| `AUTH_REFRESH_TOKEN_SECRET` | secret acak | Kunci penandatangan refresh token. Wajib berbeda dari access-token secret. Mengganti nilai ini membatalkan refresh token yang aktif. |
| `AUTH_ACCESS_TOKEN_TTL` | format `jsonwebtoken`, mis. `15m` | Masa berlaku access token. |
| `AUTH_REFRESH_TOKEN_TTL_DAYS` | jumlah hari | Masa berlaku refresh token. |
| `AUTH_BCRYPT_ROUNDS` | bilangan bulat | Cost factor bcrypt. Nilai lebih tinggi lebih aman tetapi menambah waktu hash. |
| `ACCOUNT_QUEUE_ALLOW_LEGACY_CLIENT_SESSION_CREATE` | boolean | Fallback kompatibilitas untuk alur lama pembuatan sesi client. Biarkan `false` untuk alur account-centric saat ini. |
| `JOBS_LIST_ALLOW_LEGACY_CLIENT_FILTER` | boolean | Fallback kompatibilitas filter daftar job lama. Biarkan `false` kecuali masih ada client lama yang bergantung padanya. |

## Email dan Reset Password

| Variabel | Nilai/format | Keterangan |
| --- | --- | --- |
| `MAIL_DRIVER` | `log` atau `smtp` | `log` hanya menulis email ke console, cocok untuk lokal. `smtp` benar-benar mengirim email dan memerlukan konfigurasi SMTP. |
| `SMTP_HOST` | hostname | Host SMTP, mis. `smtp.gmail.com`. Wajib bila `MAIL_DRIVER=smtp`. |
| `SMTP_PORT` | nomor port | Umumnya `587` untuk STARTTLS atau `465` untuk TLS langsung. |
| `SMTP_SECURE` | boolean | `true` untuk TLS langsung pada port 465; `false` untuk STARTTLS pada port 587. |
| `SMTP_USER` | username/email | Akun autentikasi SMTP. |
| `SMTP_PASS` | secret | Password SMTP atau app password. Jangan gunakan password akun utama jika penyedia mendukung app password. |
| `MAIL_FROM_NAME` | teks | Nama pengirim yang dilihat penerima. |
| `MAIL_FROM_ADDRESS` | alamat email | Alamat pengirim; biasanya harus sesuai akun SMTP atau sender yang terverifikasi. |
| `APP_BASE_URL` | URL absolut | Base URL yang dipakai untuk membangun tautan reset password. Gunakan URL publik HTTPS pada produksi. |
| `PASSWORD_RESET_TOKEN_TTL_MINUTES` | jumlah menit | Masa berlaku token reset password; minimum efektif adalah satu menit. |

## Cloudflare Turnstile

| Variabel | Nilai/format | Keterangan |
| --- | --- | --- |
| `TURNSTILE_ENABLED` | boolean | Mengaktifkan verifikasi Turnstile untuk endpoint yang menggunakannya. |
| `TURNSTILE_SITE_KEY` | public key | Site key Turnstile untuk frontend. Tetap jangan dicampur dengan secret key. |
| `TURNSTILE_SECRET_KEY` | secret | Secret key verifikasi server-side. Wajib saat Turnstile diaktifkan. |
| `TURNSTILE_VERIFY_URL` | URL | Endpoint verifikasi Cloudflare. Nilai standar: `https://challenges.cloudflare.com/turnstile/v0/siteverify`. |
| `TURNSTILE_ALLOWED_HOSTNAMES` | CSV hostname | Hostname tambahan yang diterima setelah token diverifikasi, mis. `printorder.example,localhost,127.0.0.1`. Kosong berarti tidak ada pembatasan tambahan dari aplikasi. |

## Checklist Produksi

1. Set `NODE_ENV=production`, `PORT`, dan `MONITORING_PORT` yang tidak saling bertabrakan.
2. Isi `DATABASE_URL` dengan user database khusus aplikasi dan password kuat.
3. Ubah dua secret JWT menjadi nilai acak yang berbeda.
4. Ganti seluruh path Windows pada bagian storage menjadi path absolut Linux dan pastikan proses Node dapat membaca/menulisnya.
5. Set `APP_BASE_URL` ke domain HTTPS publik.
6. Isi kredensial SMTP, ubah `MAIL_DRIVER=smtp`, lalu uji alur reset password.
7. Isi kedua key Turnstile dan aktifkan hanya setelah domain serta frontend telah dikonfigurasi.
8. Pastikan reverse proxy meneruskan `PORT` dan `REALTIME_PATH`, termasuk upgrade koneksi WebSocket.

## Validasi Cepat

Untuk memeriksa bahwa `.env` dapat dimuat tanpa menampilkan secret:

```powershell
node -e "const c=require('./src/config'); console.log({ port: c.port, useDb: c.useDb, mailDriver: c.MAIL_DRIVER, turnstileEnabled: c.TURNSTILE_ENABLED })"
```

Jalankan dashboard monitoring dengan port yang berbeda dari server utama:

```powershell
node monitoring/server.js
```
