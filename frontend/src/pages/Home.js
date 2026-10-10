import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ScanLine, Search, Store, UserRound, Sparkles, Printer, Palette } from 'lucide-react';
import { useSession } from '../lib/SessionContext';
import { MOCK_STORES, findStoreByCode } from '../lib/mock';
import BarcodeScanner from '../components/BarcodeScanner';

export default function Home() {
  const navigate = useNavigate();
  const { alias, setAlias } = useSession();
  const [aliasInput, setAliasInput] = useState(alias || '');
  const [aliasSaved, setAliasSaved] = useState(Boolean(alias));
  const [storeCode, setStoreCode] = useState('');
  const [scanOpen, setScanOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setAliasInput(alias || '');
    setAliasSaved(Boolean(alias));
  }, [alias]);

  const handleSaveAlias = () => {
    const v = aliasInput.trim();
    if (!v) {
      setError('Alias tidak boleh kosong.');
      return;
    }
    setAlias(v);
    setAliasSaved(true);
    setError('');
  };

  const handleSearchStore = () => {
    const v = storeCode.trim();
    if (!aliasInput.trim()) {
      setError('Isi alias terlebih dahulu.');
      return;
    }
    if (!alias) setAlias(aliasInput.trim());
    if (!v) {
      setError('Masukkan kode toko atau gunakan scan barcode.');
      return;
    }
    const found = findStoreByCode(v);
    if (!found) {
      setError(`Toko dengan kode "${v}" tidak ditemukan. Coba PO-GRAFIKA-01 atau FASTPRINT-88.`);
      return;
    }
    setError('');
    navigate(`/store-confirm/${encodeURIComponent(found.store_code)}`);
  };

  const handleScanDetected = (code) => {
    setStoreCode(code);
    setScanOpen(false);
    if (!aliasInput.trim()) {
      setError('Isi alias terlebih dahulu untuk melanjutkan.');
      return;
    }
    if (!alias) setAlias(aliasInput.trim());
    const found = findStoreByCode(code);
    if (found) navigate(`/store-confirm/${encodeURIComponent(found.store_code)}`);
    else setError(`Kode "${code}" tidak dikenal.`);
  };

  const handleQuickPill = (code) => {
    setStoreCode(code);
    setError('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="grid lg:grid-cols-[1.05fr_1fr] gap-8 lg:gap-14 items-start">
        {/* Left: Branding */}
        <section className="animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-brand-tealLight/60 border border-brand-teal/15 text-brand-tealDark text-[11px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            Smart Print Kiosk
          </div>
          <h1 className="mt-4 font-display font-bold text-slate-900 text-3xl sm:text-4xl lg:text-5xl leading-[1.08] tracking-tight">
            Cetak dokumen tanpa <span className="text-brand-teal">antre</span>,
            <br className="hidden sm:block" /> tanpa kirim WA, tanpa flashdisk.
          </h1>
          <p className="mt-4 text-slate-600 text-[15px] sm:text-base leading-relaxed max-w-xl">
            Masukkan Alias Anda dan Kode Toko mitra terdekat, atau scan barcode toko &mdash; sesi
            cetak Anda akan langsung terbuka.
          </p>

          <ol className="mt-7 space-y-3 max-w-md">
            {[
              { icon: Store, title: 'Masukkan Kode Toko atau Scan Barcode' },
              { icon: Printer, title: 'Atur Lembar Cetak, Warna, & Spesifikasi' },
              { icon: Palette, title: 'Tugas Langsung Masuk Antrean Toko' },
            ].map((step, idx) => {
              const Icon = step.icon;
              return (
                <li
                  key={step.title}
                  className="flex items-start gap-3 bg-white/70 border border-slate-200/80 rounded-xl px-4 py-3"
                >
                  <div className="w-8 h-8 shrink-0 rounded-lg bg-brand-tealLight/70 grid place-items-center text-brand-tealDark font-mono text-xs font-bold">
                    0{idx + 1}
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 text-sm font-medium">
                    <Icon className="w-4 h-4 text-brand-teal" />
                    {step.title}
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        {/* Right: Form */}
        <section
          className="bg-white rounded-3xl border border-slate-200/90 sheet-shadow p-5 sm:p-7 md:p-8 animate-fade-in"
          data-testid="home-form-card"
        >
          <div className="space-y-6">
            {/* Alias field */}
            <div>
              <label className="flex items-center gap-2 text-[11px] uppercase tracking-wider font-semibold text-slate-500 font-mono mb-2">
                <UserRound className="w-3.5 h-3.5" />
                Alias / Nama Pemesan
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={aliasInput}
                  onChange={(e) => {
                    setAliasInput(e.target.value);
                    setAliasSaved(false);
                  }}
                  placeholder="Contoh: Budi Santoso / Meja 4 - Rian"
                  className="flex-1 rounded-xl border border-slate-200 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 outline-none px-4 py-3 text-sm bg-slate-50/60 placeholder:text-slate-400"
                  data-testid="alias-input-field"
                />
                <button
                  type="button"
                  onClick={handleSaveAlias}
                  className={`${
                    aliasSaved
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      : 'bg-slate-900 text-white hover:bg-slate-800 border-slate-900'
                  } border rounded-xl px-4 py-3 text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors`}
                  data-testid="btn-save-alias"
                >
                  {aliasSaved ? (
                    <>
                      <Check className="w-4 h-4" /> Tersimpan
                    </>
                  ) : (
                    'Simpan Alias'
                  )}
                </button>
              </div>
            </div>

            {/* Store code field */}
            <div>
              <label className="flex items-center gap-2 text-[11px] uppercase tracking-wider font-semibold text-slate-500 font-mono mb-2">
                <Store className="w-3.5 h-3.5" />
                Kode Toko Percetakan
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={storeCode}
                  onChange={(e) => setStoreCode(e.target.value.toUpperCase())}
                  placeholder="PO-GRAFIKA-01 / FASTPRINT-88"
                  className="w-full rounded-xl border border-slate-200 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 outline-none pl-4 pr-12 py-3 text-sm font-mono tracking-wide bg-slate-50/60 placeholder:text-slate-400 placeholder:font-sans"
                  data-testid="store-code-input-field"
                />
                <button
                  type="button"
                  onClick={() => setScanOpen(true)}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 w-9 rounded-lg bg-gradient-action text-white grid place-items-center shadow-sm hover:brightness-110 transition"
                  aria-label="Scan barcode"
                  title="Scan barcode toko"
                  data-testid="btn-barcode-scan"
                >
                  <ScanLine className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleSearchStore}
                className="mt-3 w-full bg-gradient-action text-white rounded-xl px-4 py-3 text-sm font-semibold inline-flex items-center justify-center gap-2 shadow-md shadow-brand-teal/20 hover:brightness-110 transition"
                data-testid="btn-search-store"
              >
                <Search className="w-4 h-4" /> Cari Toko
              </button>

              <div className="mt-4">
                <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-2">
                  Toko demo cepat
                </p>
                <div className="flex flex-wrap gap-2">
                  {MOCK_STORES.slice(0, 3).map((s) => (
                    <button
                      key={s.store_code}
                      onClick={() => handleQuickPill(s.store_code)}
                      className="text-[11px] font-mono bg-white border border-slate-200 hover:border-brand-teal hover:text-brand-tealDark px-2.5 py-1.5 rounded-full transition-colors"
                      data-testid={`quick-store-${s.store_code}`}
                    >
                      {s.store_code}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {error && (
              <div
                className="text-sm bg-rose-50 border border-rose-200 text-rose-700 rounded-lg px-3 py-2"
                data-testid="home-error"
              >
                {error}
              </div>
            )}
          </div>
        </section>
      </div>

      <BarcodeScanner open={scanOpen} onClose={() => setScanOpen(false)} onDetected={handleScanDetected} />
    </div>
  );
}
