// Mock data based on design_guidelines.json

export const MOCK_STORES = [
  {
    store_code: 'PO-GRAFIKA-01',
    name: 'Sentra Grafika & Digital Print Express',
    address: 'Jl. Kaliurang KM 5 No. 42, Sleman, D.I. Yogyakarta (Dekat Bundaran Kampus)',
    hours_today: '07:30 - 21:30 WIB',
    is_open: true,
    phone: '+62 812-3456-7890',
    photo:
      'https://images.unsplash.com/photo-1716737954480-41496faf9541?crop=entropy&cs=srgb&fm=jpg&w=600&q=70',
    rating: 4.9,
    services: [
      'Laser BW High-Speed',
      'Full Color A4 & F4',
      'Plotter A3/A2/A1',
      'Jilid Spiral Kawat',
      'Jilid Skripsi Hardcover',
      'Laminasi Panas/Dingin',
      'Kertas HVS 75/80/100gr',
    ],
  },
  {
    store_code: 'FASTPRINT-88',
    name: 'FastPrint 88 Pusat Fotokopi & Offset',
    address: 'Jl. Gejayan No. 18, Depok, Sleman, Yogyakarta',
    hours_today: '08:00 - 22:00 WIB',
    is_open: true,
    phone: '+62 821-9876-5432',
    photo:
      'https://images.unsplash.com/photo-1511081692775-05d0f180a065?crop=entropy&cs=srgb&fm=jpg&w=600&q=70',
    rating: 4.8,
    services: [
      'Fotokopi Kilat',
      'Print Warna Inkjet & Laser',
      'Kertas Buffalo & Art Carton',
      'Staples Tengah & Blok Lem',
    ],
  },
  {
    store_code: 'ALPHA-DOC-02',
    name: 'Alpha DocuPrint 24 Jam',
    address: 'Jl. Colombo No. 1, Caturtunggal, Yogyakarta',
    hours_today: '24 Jam Nonstop',
    is_open: true,
    phone: '+62 856-1122-3344',
    photo:
      'https://images.unsplash.com/photo-1689037676470-b72230d5236e?crop=entropy&cs=srgb&fm=jpg&w=600&q=70',
    rating: 4.7,
    services: [
      'Self Service Print Kiosk',
      'Print PDF via Web',
      'Cetak Skripsi Kilat',
      'Scanner OCR Otomatis',
    ],
  },
  {
    store_code: 'MITRA-EDU-07',
    name: 'Mitra Edu Fotokopi & Jilid',
    address: 'Jl. Sosio Yustisia No. 1, Bulaksumur, Yogyakarta',
    hours_today: '07:00 - 23:00 WIB',
    is_open: false,
    phone: '+62 877-5544-3322',
    photo:
      'https://images.unsplash.com/photo-1716737954480-41496faf9541?crop=entropy&cs=srgb&fm=jpg&w=600&q=70',
    rating: 4.6,
    services: ['Cetak Dokumen', 'Jilid Spiral', 'Scan Dokumen', 'Laminating'],
  },
];

export const SAMPLE_DOCUMENTS = [
  {
    name: 'Laporan_Skripsi_Bab_1-3_Revisi_Final.pdf',
    size_bytes: 2_515_968,
    pages: 18,
    type: 'PDF',
    excerpt:
      'BAB I PENDAHULUAN\n1.1 Latar Belakang Masalah\nPerkembangan teknologi otomasi pada industri percetakan modern...',
  },
  {
    name: 'Proposal_Sponsorship_Event_Warna.pdf',
    size_bytes: 6_081_740,
    pages: 8,
    type: 'PDF',
    excerpt:
      'PROPOSAL SPONSORSHIP\nFESTIVAL TEKNOLOGI NUSANTARA 2026\nMenghubungkan Inovator Muda dan Industri...',
  },
  {
    name: 'Formulir_Pendaftaran_Magang_2026.docx',
    size_bytes: 430_080,
    pages: 2,
    type: 'DOCX',
    excerpt:
      'KEMENTERIAN PENDIDIKAN DAN KEBUDAYAAN\nFORMULIR PENDAFTARAN PROGRAM MAGANG BERSERTIFIKAT...',
  },
];

export const PAPER_OPTIONS = [
  { value: 'A4', label: 'A4 (210 x 297 mm)', badge: 'Paling Populer', multiplier: 1.0 },
  { value: 'F4', label: 'F4 / Folio (215 x 330 mm)', badge: 'Standar Kantor', multiplier: 1.15 },
  { value: 'A3', label: 'A3 (297 x 420 mm)', badge: 'Format Besar', multiplier: 2.2 },
  { value: 'Legal', label: 'Legal (216 x 356 mm)', badge: 'Dokumen Hukum', multiplier: 1.2 },
];

export const COLOR_MODE_RATES = { bw: 350, color: 1500 };

export function findStoreByCode(code) {
  if (!code) return null;
  const normalized = String(code).trim().toUpperCase();
  return MOCK_STORES.find((s) => s.store_code.toUpperCase() === normalized) || null;
}

export function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return '-';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function formatRupiah(num) {
  const value = Math.max(0, Math.round(num || 0));
  return `Rp ${value.toLocaleString('id-ID')}`;
}

export function parsePageRange(rangeStr, totalPages) {
  if (!rangeStr || !totalPages) return 0;
  const trimmed = rangeStr.trim().toLowerCase();
  if (trimmed === '' || trimmed === 'semua' || trimmed.startsWith('semua')) return totalPages;
  const parts = trimmed.split(',').map((p) => p.trim()).filter(Boolean);
  const pages = new Set();
  for (const part of parts) {
    if (part.includes('-')) {
      const [a, b] = part.split('-').map((n) => parseInt(n, 10));
      if (!Number.isNaN(a) && !Number.isNaN(b)) {
        const lo = Math.max(1, Math.min(a, b));
        const hi = Math.min(totalPages, Math.max(a, b));
        for (let i = lo; i <= hi; i += 1) pages.add(i);
      }
    } else {
      const n = parseInt(part, 10);
      if (!Number.isNaN(n) && n >= 1 && n <= totalPages) pages.add(n);
    }
  }
  return pages.size;
}

export function estimatePrice({ document, settings }) {
  if (!document) return 0;
  const paper = PAPER_OPTIONS.find((p) => p.value === settings.paperSize) || PAPER_OPTIONS[0];
  const rate = COLOR_MODE_RATES[settings.colorMode] || COLOR_MODE_RATES.bw;
  const pages = parsePageRange(settings.pageRange, document.pages) || document.pages;
  const scaleFactor = (settings.scale || 100) >= 100 ? 1 : 0.9; // tiny eco-discount if downscaled
  return pages * (settings.copies || 1) * rate * paper.multiplier * scaleFactor;
}

export function makeSessionId() {
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  const num = Math.floor(10000 + Math.random() * 89999);
  return `PO-${num}-${rand.slice(0, 1)}`;
}
