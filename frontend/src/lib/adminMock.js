// Mock data for the admin / mitra portal

export const MOCK_ADMIN_USER = {
  username: 'yefta_mitra',
  email: 'yefta@printorder-mitra.id',
  pin_active: false,
  store_code: 'PO-GRAFIKA-01',
  avatar: 'YM',
};

export const MOCK_STATS = {
  clients_online: 1,
  tasks_today: 23,
  tasks_done: 19,
  tasks_rejected: 2,
  estimated_revenue: 184500,
};

export const MOCK_CREDITS = {
  usable: 847,
  scheduled: 200,
  total_entitlement: 1047,
  nearest_expiry: '20 Nov 2026',
  usable_now: 847,
  free_active_until: '17 Jan 2026',
  free_remaining: 7,
};

export const MOCK_PLANS = [
  {
    id: 'free',
    name: 'Free',
    description: '10 tugas per minggu untuk mencoba layanan PrintOrder',
    price: 0,
    credits: 10,
    period: '1 minggu',
    cta: 'Ambil Tawaran',
    badge: null,
  },
  {
    id: 'starter',
    name: 'Starter',
    description: '1000 tugas cetak per bulan',
    price: 5000,
    unit_hint: 'Rp 5 / tugas',
    credits: 1000,
    period: '1 bulan',
    cta: 'Pilih Starter',
    badge: null,
  },
  {
    id: 'pro',
    name: 'Pro',
    description: '2500 tugas cetak per bulan',
    price: 10000,
    unit_hint: 'Rp 4 / tugas',
    credits: 2500,
    period: '1 bulan',
    cta: 'Pilih Pro',
    badge: 'Paling Hemat',
  },
  {
    id: 'topup',
    name: 'Beli Kredit',
    description: '200 kredit tugas, berlaku 4 bulan',
    price: 5000,
    credits: 200,
    period: '4 bulan',
    cta: 'Top Up',
    badge: null,
  },
];

export const MOCK_DESKTOP_CLIENTS = [
  {
    name: 'Yefta',
    id: 'd0b57e70-4730-4537-bd60-619460d0c0fd',
    online: true,
    ready: true,
    printer: 'Canon G1030 series',
    last_active: '10 Okt 2026, 05.07',
  },
];

export const DEFAULT_STORE_PROFILE = {
  photo:
    'https://images.unsplash.com/photo-1716737954480-41496faf9541?crop=entropy&cs=srgb&fm=jpg&w=600&q=70',
  name: 'Sentra Grafika & Digital Print Express',
  code: 'PO-GRAFIKA-01',
  status: 'open', // 'open' | 'closed'
  phone: '+62 812-3456-7890',
  address:
    'Jl. Kaliurang KM 5 No. 42, Sleman, D.I. Yogyakarta (Dekat Bundaran Kampus)',
};

export const DAYS = [
  { key: 'mon', label: 'Senin' },
  { key: 'tue', label: 'Selasa' },
  { key: 'wed', label: 'Rabu' },
  { key: 'thu', label: 'Kamis' },
  { key: 'fri', label: 'Jumat' },
  { key: 'sat', label: 'Sabtu' },
  { key: 'sun', label: 'Minggu' },
];

export const DEFAULT_HOURS = {
  mon: { enabled: true, open: '07:30', close: '21:30' },
  tue: { enabled: true, open: '07:30', close: '21:30' },
  wed: { enabled: true, open: '07:30', close: '21:30' },
  thu: { enabled: true, open: '07:30', close: '21:30' },
  fri: { enabled: true, open: '07:30', close: '21:30' },
  sat: { enabled: true, open: '08:00', close: '20:00' },
  sun: { enabled: false, open: '', close: '' },
};

export const DEFAULT_PAPER_SIZES = [
  { value: 'A4', label: 'A4 (210 x 297 mm)', enabled: true },
  { value: 'F4', label: 'F4 / Folio (215 x 330 mm)', enabled: true },
  { value: 'A3', label: 'A3 (297 x 420 mm)', enabled: false },
  { value: 'Legal', label: 'Legal (216 x 356 mm)', enabled: true },
  { value: 'A5', label: 'A5 (148 x 210 mm)', enabled: false },
];

export const DEFAULT_COLOR_MODES = [
  { value: 'bw', label: 'Hitam Putih', enabled: true, price: 350 },
  { value: 'color', label: 'Warna', enabled: true, price: 1500 },
];
