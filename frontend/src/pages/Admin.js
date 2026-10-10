import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  Store,
  Settings2,
  LifeBuoy,
  Download,
  RefreshCw,
  Info,
  ListChecks,
  Users,
  CheckCircle2,
  XCircle,
  Wallet,
  Printer,
  Clock,
  QrCode,
  PlugZap,
  Unplug,
  Image as ImageIcon,
  Save,
  Sparkles,
  Phone,
  MapPin,
  Hash,
} from 'lucide-react';
import {
  MOCK_ADMIN_USER,
  MOCK_STATS,
  MOCK_CREDITS,
  MOCK_PLANS,
  MOCK_DESKTOP_CLIENTS,
  DEFAULT_STORE_PROFILE,
  DEFAULT_HOURS,
  DEFAULT_PAPER_SIZES,
  DEFAULT_COLOR_MODES,
  DAYS,
} from '../lib/adminMock';
import { formatRupiah } from '../lib/mock';
import ProfileModal from '../components/admin/ProfileModal';
import HoursModal from '../components/admin/HoursModal';

const TABS = [
  { id: 'summary', label: 'Ringkasan', icon: LayoutDashboard },
  { id: 'billing', label: 'Billing', icon: Receipt },
  { id: 'store', label: 'Toko', icon: Store },
  { id: 'services', label: 'Layanan', icon: Settings2 },
  { id: 'help', label: 'Bantuan', icon: LifeBuoy },
];

export default function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('summary');
  const [profileOpen, setProfileOpen] = useState(false);
  const [hoursOpen, setHoursOpen] = useState(false);
  const [user, setUser] = useState(MOCK_ADMIN_USER);
  const [storeProfile, setStoreProfile] = useState(DEFAULT_STORE_PROFILE);
  const [hours, setHours] = useState(DEFAULT_HOURS);
  const [paperSizes, setPaperSizes] = useState(DEFAULT_PAPER_SIZES);
  const [colorModes, setColorModes] = useState(DEFAULT_COLOR_MODES);
  const [toast, setToast] = useState(null);

  const storeOpen = storeProfile.status === 'open';

  const flash = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50/60">
      {/* Admin Header */}
      <section className="bg-white border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-action grid place-items-center">
              <Printer className="w-4 h-4 text-white" />
            </div>
            <div className="leading-tight">
              <div className="font-display font-semibold text-slate-900 text-[14.5px]">
                Portal Mitra
              </div>
              <div className="text-[10.5px] uppercase tracking-wider text-slate-500 font-mono">
                PrintOrder Admin
              </div>
            </div>
            <span
              className={`ml-2 inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-bold tracking-wider border ${
                storeOpen
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}
              data-testid="admin-store-status-badge"
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  storeOpen ? 'bg-emerald-500' : 'bg-rose-500'
                } animate-pulseDot`}
              />
              {storeOpen ? 'TOKO BUKA' : 'TOKO TUTUP'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => flash('Mengunduh installer klien desktop...')}
              className="inline-flex items-center gap-1.5 bg-white border border-slate-200 hover:border-brand-teal hover:text-brand-tealDark text-slate-700 rounded-lg px-3 py-1.5 text-xs font-semibold"
              data-testid="btn-download-client"
            >
              <Download className="w-3.5 h-3.5" />
              Klien Desktop
            </button>

            <button
              onClick={() => setProfileOpen(true)}
              className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl pl-1.5 pr-3 py-1"
              data-testid="btn-open-profile"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-action grid place-items-center text-white text-xs font-bold">
                {user.username.slice(0, 2).toUpperCase()}
              </div>
              <div className="text-left leading-tight hidden sm:block">
                <div className="text-[12.5px] font-semibold text-slate-800">{user.username}</div>
                <div className="text-[10.5px] font-mono text-slate-500">{user.store_code}</div>
              </div>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <nav
          className="max-w-6xl mx-auto px-2 sm:px-6 lg:px-8 flex gap-1 overflow-x-auto"
          data-testid="admin-tabs"
        >
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`relative inline-flex items-center gap-1.5 whitespace-nowrap text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2.5 transition ${
                  active ? 'text-brand-tealDark' : 'text-slate-500 hover:text-slate-800'
                }`}
                data-testid={`admin-tab-${t.id}`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
                {active && (
                  <span className="absolute left-2 right-2 bottom-0 h-0.5 bg-gradient-action rounded-full" />
                )}
              </button>
            );
          })}
        </nav>
      </section>

      {/* Tab contents */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'summary' && <SummaryTab username={user.username} />}
        {activeTab === 'billing' && <BillingTab onToast={flash} />}
        {activeTab === 'store' && (
          <StoreTab
            storeProfile={storeProfile}
            setStoreProfile={setStoreProfile}
            onEditHours={() => setHoursOpen(true)}
            hours={hours}
            onToast={flash}
          />
        )}
        {activeTab === 'services' && (
          <ServicesTab
            paperSizes={paperSizes}
            setPaperSizes={setPaperSizes}
            colorModes={colorModes}
            setColorModes={setColorModes}
            onToast={flash}
          />
        )}
        {activeTab === 'help' && <HelpTab />}
      </section>

      {toast && (
        <div
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[60] bg-slate-900 text-white rounded-xl shadow-xl px-4 py-3 text-sm font-medium flex items-center gap-2 animate-fade-in"
          data-testid="admin-toast"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {toast}
        </div>
      )}

      <ProfileModal
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        user={user}
        setUser={setUser}
        onLogout={() => {
          setProfileOpen(false);
          navigate('/');
        }}
      />
      <HoursModal
        open={hoursOpen}
        initial={hours}
        onClose={() => setHoursOpen(false)}
        onSave={(h) => {
          setHours(h);
          setHoursOpen(false);
          flash('Waktu operasional disimpan.');
        }}
      />
    </div>
  );
}

/* ------------------ RINGKASAN ------------------ */
function SummaryTab({ username }) {
  const stats = MOCK_STATS;
  const cards = [
    {
      key: 'clients',
      label: 'Klien Online',
      value: stats.clients_online,
      icon: Users,
      accent: 'bg-brand-tealLight text-brand-tealDark',
    },
    {
      key: 'today',
      label: 'Tugas Hari Ini',
      value: stats.tasks_today,
      icon: ListChecks,
      accent: 'bg-brand-cyanLight text-brand-cyan',
    },
    {
      key: 'done',
      label: 'Selesai',
      value: stats.tasks_done,
      icon: CheckCircle2,
      accent: 'bg-emerald-50 text-emerald-700',
    },
    {
      key: 'rejected',
      label: 'Ditolak / Batal',
      value: stats.tasks_rejected,
      icon: XCircle,
      accent: 'bg-rose-50 text-rose-700',
    },
    {
      key: 'revenue',
      label: 'Estimasi Pendapatan',
      value: formatRupiah(stats.estimated_revenue),
      icon: Wallet,
      accent: 'bg-amber-50 text-amber-700',
      wide: true,
    },
  ];

  return (
    <div className="space-y-6" data-testid="tab-content-summary">
      <div className="flex items-center gap-2 text-brand-tealDark text-xs font-semibold uppercase tracking-wider">
        <Sparkles className="w-3.5 h-3.5" /> Selamat Datang
      </div>
      <h2 className="font-display font-bold text-slate-900 text-2xl sm:text-3xl -mt-4">
        Halo, <span className="text-brand-teal">{username}</span>! Dashboard mitra Anda hari ini.
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.key}
              className={`bg-white border border-slate-200/90 rounded-2xl p-4 sheet-shadow ${
                c.wide ? 'col-span-2 sm:col-span-3 lg:col-span-1' : ''
              }`}
              data-testid={`stat-card-${c.key}`}
            >
              <div className={`inline-flex items-center justify-center w-9 h-9 rounded-xl ${c.accent}`}>
                <Icon className="w-4.5 h-4.5" />
              </div>
              <div className="mt-3 text-[11px] uppercase tracking-wider font-semibold text-slate-500 font-mono">
                {c.label}
              </div>
              <div className="mt-1 font-display font-bold text-slate-900 text-xl sm:text-2xl">
                {c.value}
              </div>
            </div>
          );
        })}
      </div>

      <div>
        <button
          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg px-4 py-2.5 text-sm font-semibold"
          data-testid="btn-view-all-tasks"
        >
          <ListChecks className="w-4 h-4" />
          Lihat Semua Tugas
        </button>
      </div>
    </div>
  );
}

/* ------------------ BILLING ------------------ */
function BillingTab({ onToast }) {
  const credits = MOCK_CREDITS;

  return (
    <div className="space-y-6" data-testid="tab-content-billing">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="font-display font-bold text-slate-900 text-xl sm:text-2xl">
            Billing &amp; Kredit
          </h2>
          <p className="text-sm text-slate-500">
            Kelola rencana dan kredit penggunaan platform PrintOrder.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onToast('Membuka daftar order...')}
            className="inline-flex items-center gap-1.5 bg-white border border-slate-200 hover:border-brand-teal hover:text-brand-tealDark text-slate-700 rounded-lg px-3 py-2 text-xs font-semibold"
            data-testid="btn-order-list"
          >
            <Receipt className="w-3.5 h-3.5" /> Daftar Order
          </button>
          <button
            onClick={() => onToast('Memperbarui data kredit...')}
            className="inline-flex items-center gap-1.5 bg-white border border-slate-200 hover:border-brand-teal hover:text-brand-tealDark text-slate-700 rounded-lg px-3 py-2 text-xs font-semibold"
            data-testid="btn-refresh-billing"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>
      </div>

      {/* Credits summary */}
      <div className="bg-white border border-slate-200/90 rounded-2xl sheet-shadow p-5">
        <div className="flex items-center gap-2 mb-4">
          <Wallet className="w-4 h-4 text-brand-teal" />
          <h3 className="font-display font-semibold text-slate-900 text-sm">Informasi Kredit</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <CreditCell label="Bisa Dipakai" value={credits.usable} testid="credit-usable" />
          <CreditCell label="Terjadwal" value={credits.scheduled} testid="credit-scheduled" />
          <CreditCell
            label="Total Hak Kredit"
            value={credits.total_entitlement}
            testid="credit-total"
          />
          <CreditCell
            label="Kedaluwarsa Terdekat"
            value={credits.nearest_expiry}
            testid="credit-expiry"
          />
          <CreditCell
            label="Bisa Dipakai Sekarang"
            value={credits.usable_now}
            testid="credit-usable-now"
            highlight
          />
        </div>
        <div className="mt-4 flex items-center gap-2 text-[12.5px] bg-brand-tealLight/50 border border-brand-teal/15 text-brand-tealDark rounded-lg px-3 py-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span data-testid="free-active-info">
            Free masih aktif sampai <b>{credits.free_active_until}</b> ({credits.free_remaining}{' '}
            kredit free)
          </span>
        </div>
      </div>

      {/* Plans */}
      <div>
        <h3 className="font-display font-semibold text-slate-900 text-sm mb-3">
          Pilihan Rencana &amp; Top Up Kredit
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {MOCK_PLANS.map((p) => (
            <div
              key={p.id}
              className={`relative bg-white border rounded-2xl p-4 sheet-shadow flex flex-col ${
                p.badge ? 'border-brand-teal/50 ring-1 ring-brand-teal/30' : 'border-slate-200/90'
              }`}
              data-testid={`plan-card-${p.id}`}
            >
              {p.badge && (
                <span className="absolute -top-2.5 right-3 bg-gradient-action text-white text-[10.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                  {p.badge}
                </span>
              )}
              <div className="font-display font-bold text-slate-900 text-lg">{p.name}</div>
              <p className="text-[12.5px] text-slate-500 mt-1 min-h-[36px]">{p.description}</p>
              <div className="mt-3">
                <div className="font-display font-bold text-slate-900 text-2xl">
                  {formatRupiah(p.price)}
                </div>
                {p.unit_hint && (
                  <div className="text-[11px] text-slate-500">{p.unit_hint}</div>
                )}
              </div>
              <div className="mt-3 text-[11.5px] text-slate-600 flex items-center justify-between border-t border-slate-100 pt-2.5">
                <span>Kredit</span>
                <span className="font-semibold text-slate-800">{p.credits}</span>
              </div>
              <div className="text-[11.5px] text-slate-600 flex items-center justify-between">
                <span>Berlaku</span>
                <span className="font-semibold text-slate-800">{p.period}</span>
              </div>
              <button
                onClick={() => onToast(`${p.cta} - ${p.name}`)}
                className={`mt-4 rounded-lg px-3 py-2 text-sm font-semibold ${
                  p.id === 'pro'
                    ? 'bg-gradient-action text-white hover:brightness-110'
                    : p.id === 'free'
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
                data-testid={`btn-plan-${p.id}`}
              >
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CreditCell({ label, value, testid, highlight }) {
  return (
    <div
      className={`rounded-xl px-3 py-2.5 border ${
        highlight
          ? 'bg-gradient-to-br from-brand-tealLight/80 to-brand-cyanLight/60 border-brand-teal/20'
          : 'bg-slate-50/70 border-slate-100'
      }`}
    >
      <div className="text-[10.5px] uppercase tracking-wider font-semibold text-slate-500">
        {label}
      </div>
      <div
        className={`mt-0.5 font-display font-bold text-base ${
          highlight ? 'text-brand-tealDark' : 'text-slate-900'
        }`}
        data-testid={testid}
      >
        {value}
      </div>
    </div>
  );
}

/* ------------------ TOKO ------------------ */
function StoreTab({ storeProfile, setStoreProfile, onEditHours, hours, onToast }) {
  const [clients] = useState(MOCK_DESKTOP_CLIENTS);
  const [infoOpen, setInfoOpen] = useState(false);
  const qrUrl = `http://localhost:3000/p/${storeProfile.code}`;

  const update = (patch) => setStoreProfile((s) => ({ ...s, ...patch }));

  const activeDaySummary = useMemo(() => {
    const enabled = DAYS.filter((d) => hours[d.key]?.enabled);
    if (enabled.length === 0) return 'Belum diatur';
    const first = enabled[0];
    const h = hours[first.key];
    return `${enabled.length} hari aktif · ${first.label} ${h.open}-${h.close}`;
  }, [hours]);

  return (
    <div className="space-y-6" data-testid="tab-content-store">
      {/* Store profile */}
      <div className="bg-white border border-slate-200/90 rounded-2xl sheet-shadow p-5">
        <div className="flex items-center gap-2 mb-4">
          <Store className="w-4 h-4 text-brand-teal" />
          <h3 className="font-display font-semibold text-slate-900 text-sm">Pengaturan Toko</h3>
        </div>

        <div className="grid lg:grid-cols-[auto_1fr] gap-5">
          {/* PP + QR */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={storeProfile.photo}
                alt="PP Toko"
                className="w-32 h-32 rounded-2xl object-cover border border-slate-200"
                data-testid="admin-store-photo"
              />
              <button
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white border border-slate-200 rounded-full px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:border-brand-teal"
                data-testid="btn-upload-photo"
                onClick={() => onToast('Pilih file foto toko')}
              >
                <ImageIcon className="w-3 h-3 inline mr-1" /> Ganti Foto
              </button>
            </div>

            <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-3 w-full flex flex-col items-center">
              <div className="text-[10.5px] uppercase tracking-wider font-semibold text-slate-500 mb-2 flex items-center gap-1">
                <QrCode className="w-3 h-3" /> QR Toko
              </div>
              <img
                alt="QR"
                src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(qrUrl)}`}
                className="w-28 h-28 rounded-md bg-white border border-slate-200"
                data-testid="store-qr-image"
              />
              <div
                className="mt-2 text-[11px] text-slate-600 font-mono text-center break-all"
                data-testid="store-qr-url"
              >
                {qrUrl}
              </div>
              <button
                onClick={() => onToast('QR berhasil diunduh.')}
                className="mt-2 inline-flex items-center gap-1 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg px-3 py-1.5"
                data-testid="btn-download-qr"
              >
                <Download className="w-3 h-3" /> Download QR
              </button>
            </div>
          </div>

          {/* Fields */}
          <div className="space-y-3">
            <AdminField label="Nama Toko" icon={<Store className="w-3.5 h-3.5" />}>
              <input
                className="form-input"
                value={storeProfile.name}
                onChange={(e) => update({ name: e.target.value })}
                data-testid="input-store-name"
              />
            </AdminField>
            <div className="grid sm:grid-cols-2 gap-3">
              <AdminField label="Kode Toko" icon={<Hash className="w-3.5 h-3.5" />}>
                <input
                  className="form-input font-mono"
                  value={storeProfile.code}
                  onChange={(e) => update({ code: e.target.value.toUpperCase() })}
                  data-testid="input-store-code"
                />
              </AdminField>
              <AdminField label="Status" icon={<CheckCircle2 className="w-3.5 h-3.5" />}>
                <select
                  className="form-input"
                  value={storeProfile.status}
                  onChange={(e) => update({ status: e.target.value })}
                  data-testid="dropdown-store-status"
                >
                  <option value="open">Buka</option>
                  <option value="closed">Tutup</option>
                </select>
              </AdminField>
            </div>
            <AdminField label="Waktu Operasional" icon={<Clock className="w-3.5 h-3.5" />}>
              <button
                type="button"
                onClick={onEditHours}
                className="form-input text-left hover:border-brand-teal"
                data-testid="btn-open-hours"
              >
                <span className="text-slate-700">{activeDaySummary}</span>
                <span className="float-right text-[11px] text-brand-tealDark font-semibold">
                  Ubah
                </span>
              </button>
            </AdminField>
            <AdminField label="Kontak" icon={<Phone className="w-3.5 h-3.5" />}>
              <input
                className="form-input font-mono"
                value={storeProfile.phone}
                onChange={(e) => update({ phone: e.target.value })}
                data-testid="input-store-phone"
              />
            </AdminField>
            <AdminField label="Alamat Toko" icon={<MapPin className="w-3.5 h-3.5" />}>
              <textarea
                rows={2}
                className="form-input resize-none"
                value={storeProfile.address}
                onChange={(e) => update({ address: e.target.value })}
                data-testid="input-store-address"
              />
            </AdminField>
            <div className="flex justify-end">
              <button
                onClick={() => onToast('Pengaturan toko disimpan.')}
                className="inline-flex items-center gap-1.5 bg-gradient-action text-white rounded-lg px-4 py-2 text-sm font-semibold"
                data-testid="btn-save-store"
              >
                <Save className="w-4 h-4" /> Simpan Toko
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop clients */}
      <div className="bg-white border border-slate-200/90 rounded-2xl sheet-shadow p-5">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <PlugZap className="w-4 h-4 text-brand-teal" />
            <h3 className="font-display font-semibold text-slate-900 text-sm">
              Klien Desktop ({clients.length})
            </h3>
          </div>
          <div className="flex gap-2 items-center">
            <button
              onClick={() => onToast('Memperbarui daftar klien...')}
              className="inline-flex items-center gap-1.5 bg-white border border-slate-200 hover:border-brand-teal text-slate-700 rounded-lg px-3 py-1.5 text-xs font-semibold"
              data-testid="btn-refresh-clients"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
            <div className="relative">
              <button
                onClick={() => setInfoOpen((v) => !v)}
                className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-brand-teal text-slate-500"
                data-testid="btn-client-info"
                aria-label="Info"
              >
                <Info className="w-4 h-4" />
              </button>
              {infoOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-lg p-3 text-[12.5px] text-slate-600 z-30"
                  data-testid="client-info-popover"
                >
                  Install aplikasi desktop PrintOrder, login dengan akun portal ini, lalu pilih
                  printer aktif dari aplikasi client.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto -mx-5 px-5">
          <table className="min-w-full text-sm" data-testid="clients-table">
            <thead>
              <tr className="text-left text-[10.5px] uppercase tracking-wider text-slate-500 font-semibold">
                <th className="py-2 pr-4">Nama</th>
                <th className="py-2 pr-4">Client ID</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Printer Aktif</th>
                <th className="py-2 pr-4">Terakhir Aktif</th>
                <th className="py-2 pr-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr
                  key={c.id}
                  className="border-t border-slate-100"
                  data-testid={`client-row-${c.id}`}
                >
                  <td className="py-3 pr-4 font-medium text-slate-800">{c.name}</td>
                  <td className="py-3 pr-4">
                    <code className="text-[11px] font-mono bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5">
                      {c.id}
                    </code>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="inline-flex items-center gap-1.5">
                      <span
                        className={`inline-flex items-center gap-1 text-[10.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          c.online
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-100 text-slate-500 border-slate-200'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulseDot" />
                        {c.online ? 'Online' : 'Offline'}
                      </span>
                      <span className="text-[12px] text-slate-600">
                        {c.ready ? 'siap' : '—'}
                      </span>
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-slate-700">{c.printer}</td>
                  <td className="py-3 pr-4 text-[12.5px] text-slate-500 whitespace-nowrap">
                    {c.last_active}
                  </td>
                  <td className="py-3 pr-4">
                    <button
                      onClick={() => onToast(`Klien ${c.name} dilepas (unbind).`)}
                      className="inline-flex items-center gap-1 text-[12px] font-semibold bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 rounded-lg px-2.5 py-1"
                      data-testid={`btn-unbind-${c.id}`}
                    >
                      <Unplug className="w-3.5 h-3.5" /> Unbind
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AdminField({ label, icon, children }) {
  return (
    <label className="block">
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-semibold text-slate-500 mb-1 font-mono">
        {icon}
        {label}
      </div>
      {children}
    </label>
  );
}

/* ------------------ LAYANAN ------------------ */
function ServicesTab({ paperSizes, setPaperSizes, colorModes, setColorModes, onToast }) {
  const togglePaper = (value) =>
    setPaperSizes((arr) =>
      arr.map((p) => (p.value === value ? { ...p, enabled: !p.enabled } : p))
    );
  const toggleMode = (value) =>
    setColorModes((arr) =>
      arr.map((m) => (m.value === value ? { ...m, enabled: !m.enabled } : m))
    );
  const updateModePrice = (value, price) =>
    setColorModes((arr) =>
      arr.map((m) => (m.value === value ? { ...m, price: Math.max(0, price) } : m))
    );

  return (
    <div className="space-y-6" data-testid="tab-content-services">
      <div>
        <h2 className="font-display font-bold text-slate-900 text-xl sm:text-2xl">
          Pengaturan Layanan
        </h2>
        <p className="text-sm text-slate-500">
          Atur ukuran kertas dan mode warna yang tersedia untuk pelanggan Anda.
        </p>
      </div>

      {/* Paper sizes */}
      <div className="bg-white border border-slate-200/90 rounded-2xl sheet-shadow p-5">
        <h3 className="font-display font-semibold text-slate-900 text-sm mb-3">Ukuran Kertas</h3>
        <div className="grid sm:grid-cols-2 gap-2">
          {paperSizes.map((p) => (
            <label
              key={p.value}
              className={`flex items-center gap-3 cursor-pointer border rounded-xl px-3 py-2.5 transition ${
                p.enabled ? 'border-brand-teal/40 bg-brand-tealLight/30' : 'border-slate-200'
              }`}
              data-testid={`paper-row-${p.value}`}
            >
              <input
                type="checkbox"
                checked={p.enabled}
                onChange={() => togglePaper(p.value)}
                className="w-4 h-4 rounded border-slate-300 text-brand-teal focus:ring-brand-teal/40"
                data-testid={`checkbox-paper-${p.value}`}
              />
              <div className="flex-1">
                <div className="text-sm font-semibold text-slate-800">{p.value}</div>
                <div className="text-[11.5px] text-slate-500">{p.label}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Color modes */}
      <div className="bg-white border border-slate-200/90 rounded-2xl sheet-shadow p-5">
        <h3 className="font-display font-semibold text-slate-900 text-sm mb-3">Mode Warna</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {colorModes.map((m) => (
            <div
              key={m.value}
              className={`border rounded-xl p-3 ${
                m.enabled ? 'border-brand-teal/40 bg-brand-tealLight/30' : 'border-slate-200'
              }`}
              data-testid={`mode-row-${m.value}`}
            >
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={m.enabled}
                  onChange={() => toggleMode(m.value)}
                  className="w-4 h-4 rounded border-slate-300 text-brand-teal focus:ring-brand-teal/40"
                  data-testid={`checkbox-mode-${m.value}`}
                />
                <div className="text-sm font-semibold text-slate-800">{m.label}</div>
              </label>
              <div className="mt-2 flex items-center gap-2">
                <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 font-mono">
                  Harga/lembar
                </div>
                <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden pl-2">
                  <span className="text-xs text-slate-500">Rp</span>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={m.price}
                    onChange={(e) => updateModePrice(m.value, parseInt(e.target.value || '0', 10))}
                    className="w-24 px-2 py-1.5 text-sm font-semibold outline-none"
                    disabled={!m.enabled}
                    data-testid={`price-mode-${m.value}`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => onToast('Pengaturan layanan disimpan.')}
          className="inline-flex items-center gap-1.5 bg-gradient-action text-white rounded-lg px-4 py-2.5 text-sm font-semibold"
          data-testid="btn-save-services"
        >
          <Save className="w-4 h-4" /> Simpan Pengaturan Layanan
        </button>
      </div>
    </div>
  );
}

/* ------------------ BANTUAN ------------------ */
function HelpTab() {
  return (
    <div className="min-h-[320px] grid place-items-center" data-testid="tab-content-help">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-action grid place-items-center">
          <LifeBuoy className="w-7 h-7 text-white" />
        </div>
        <h2 className="mt-4 font-display font-bold text-slate-900 text-xl">Pusat Bantuan</h2>
        <p className="mt-2 text-sm text-slate-500">
          Konten bantuan untuk mitra akan segera hadir. Sementara ini, hubungi tim kami melalui
          kontak pada profil toko Anda.
        </p>
        <div className="mt-5 inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full">
          <Sparkles className="w-3.5 h-3.5" /> Coming Soon
        </div>
      </div>
    </div>
  );
}
