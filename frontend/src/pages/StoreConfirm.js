import React, { useMemo } from 'react';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import {
  MapPin,
  Clock,
  Phone,
  Star,
  ArrowLeft,
  CheckCircle2,
  Store as StoreIcon,
} from 'lucide-react';
import { useSession } from '../lib/SessionContext';
import { findStoreByCode, makeSessionId } from '../lib/mock';

export default function StoreConfirm() {
  const { code } = useParams();
  const navigate = useNavigate();
  const { alias, setStore, setSession } = useSession();

  const store = useMemo(() => findStoreByCode(code), [code]);

  if (!alias) return <Navigate to="/" replace />;
  if (!store) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center">
        <h2 className="font-display text-xl font-semibold text-slate-800">Toko tidak ditemukan</h2>
        <p className="text-sm text-slate-500 mt-1">Kode &quot;{code}&quot; belum terdaftar.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 text-sm text-brand-tealDark underline"
        >
          Kembali ke halaman awal
        </button>
      </div>
    );
  }

  const openStatus = store.is_open
    ? { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'BUKA SEKARANG' }
    : { bg: 'bg-rose-50', text: 'text-rose-700', dot: 'bg-rose-500', label: 'TUTUP SEMENTARA' };

  const handleConfirm = () => {
    setStore(store);
    setSession({
      session_id: makeSessionId(),
      alias,
      store_code: store.store_code,
      started_at: new Date().toISOString(),
    });
    navigate('/session');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 animate-fade-in">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-5"
        data-testid="btn-cancel-store"
      >
        <ArrowLeft className="w-4 h-4" />
        Bukan toko ini / ganti kode
      </button>

      <div className="bg-white rounded-3xl border border-slate-200/90 sheet-shadow overflow-hidden">
        {/* Banner */}
        <div className="relative">
          <img
            src={store.photo}
            alt={store.name}
            className="w-full h-40 sm:h-56 object-cover"
            data-testid="store-photo"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent" />
          <div
            className={`absolute top-4 left-4 inline-flex items-center gap-1.5 ${openStatus.bg} ${openStatus.text} px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm`}
            data-testid="store-status-badge"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${openStatus.dot} animate-pulseDot`} />
            {openStatus.label}
          </div>
          <div className="absolute left-4 bottom-4 right-4 text-white">
            <div className="flex items-center gap-1 text-[11px] font-mono bg-white/20 backdrop-blur-sm w-fit px-2 py-0.5 rounded-md">
              <StoreIcon className="w-3 h-3" />
              <span data-testid="store-code-badge">{store.store_code}</span>
            </div>
            <h1
              className="mt-2 font-display font-bold text-xl sm:text-2xl leading-tight drop-shadow"
              data-testid="store-name"
            >
              {store.name}
            </h1>
          </div>
        </div>

        {/* Meta grid */}
        <div className="p-5 sm:p-7 space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 bg-slate-50/70 rounded-xl px-3 py-3 border border-slate-100">
              <MapPin className="w-4 h-4 text-brand-teal mt-0.5 shrink-0" />
              <div>
                <div className="text-[10.5px] uppercase tracking-wider font-semibold text-slate-500">
                  Alamat
                </div>
                <div
                  className="text-[13.5px] text-slate-700 mt-0.5 leading-relaxed"
                  data-testid="store-address"
                >
                  {store.address}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-50/70 rounded-xl px-3 py-3 border border-slate-100">
              <Clock className="w-4 h-4 text-brand-teal mt-0.5 shrink-0" />
              <div>
                <div className="text-[10.5px] uppercase tracking-wider font-semibold text-slate-500">
                  Jam Buka Hari Ini
                </div>
                <div
                  className="text-[13.5px] text-slate-700 mt-0.5 font-medium"
                  data-testid="store-hours"
                >
                  {store.hours_today}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-50/70 rounded-xl px-3 py-3 border border-slate-100">
              <Phone className="w-4 h-4 text-brand-teal mt-0.5 shrink-0" />
              <div>
                <div className="text-[10.5px] uppercase tracking-wider font-semibold text-slate-500">
                  Kontak
                </div>
                <div className="text-[13.5px] text-slate-700 mt-0.5 font-mono">{store.phone}</div>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-50/70 rounded-xl px-3 py-3 border border-slate-100">
              <Star className="w-4 h-4 text-amber-500 mt-0.5 shrink-0 fill-amber-500" />
              <div>
                <div className="text-[10.5px] uppercase tracking-wider font-semibold text-slate-500">
                  Rating Mitra
                </div>
                <div className="text-[13.5px] text-slate-700 mt-0.5 font-medium">
                  {store.rating} / 5.0
                </div>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 mb-2">
              Layanan Tersedia
            </div>
            <div className="flex flex-wrap gap-2" data-testid="store-services">
              {store.services.map((svc) => (
                <span
                  key={svc}
                  className="inline-flex items-center gap-1 bg-brand-cyanLight/70 border border-brand-cyan/15 text-brand-cyan px-2.5 py-1 rounded-full text-[11.5px] font-medium"
                >
                  <CheckCircle2 className="w-3 h-3" />
                  {svc}
                </span>
              ))}
            </div>
          </div>

          {/* Alias summary */}
          <div className="bg-brand-tealLight/50 border border-brand-teal/15 rounded-xl px-4 py-3 text-sm text-brand-tealDark">
            Anda akan masuk sesi cetak sebagai: <span className="font-semibold">{alias}</span>
          </div>

          {/* CTA bar */}
          <div className="pt-1 flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => navigate('/')}
              className="flex-1 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl px-4 py-3 text-sm font-semibold"
              data-testid="btn-back-store"
            >
              Kembali
            </button>
            <button
              onClick={handleConfirm}
              disabled={!store.is_open}
              className="flex-[1.4] bg-gradient-action text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-xl px-4 py-3 text-sm font-semibold shadow-md shadow-brand-teal/20 hover:brightness-110 transition"
              data-testid="btn-confirm-store"
            >
              Konfirmasi &amp; Mulai Cetak
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
