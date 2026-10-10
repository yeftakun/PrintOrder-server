import React, { useMemo, useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  LogOut,
  ListChecks,
  FileText,
  Upload,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Palette,
  CircleDot,
  Triangle,
  Send,
  X,
  CheckCircle2,
  AlertCircle,
  Clock3,
  Printer,
} from 'lucide-react';
import { useSession } from '../lib/SessionContext';
import {
  COLOR_MODE_RATES,
  PAPER_OPTIONS,
  SAMPLE_DOCUMENTS,
  estimatePrice,
  formatBytes,
  formatRupiah,
  parsePageRange,
} from '../lib/mock';

const PAPER_ASPECT = {
  A4: 210 / 297,
  F4: 215 / 330,
  A3: 297 / 420,
  Legal: 216 / 356,
};

export default function PrintSession() {
  const navigate = useNavigate();
  const { alias, store, session, tasks, addTask, endSession } = useSession();
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [showTasksDrawer, setShowTasksDrawer] = useState(false);
  const [toast, setToast] = useState(null);

  const [doc, setDoc] = useState(SAMPLE_DOCUMENTS[0]);
  const [previewPage, setPreviewPage] = useState(1);
  const [settings, setSettings] = useState({
    copies: 1,
    colorMode: 'bw',
    paperSize: 'A4',
    pageRange: `1-${SAMPLE_DOCUMENTS[0].pages}`,
    scale: 100,
    notes: '',
    agreeTerms: false,
  });
  const [formError, setFormError] = useState('');
  const fileInputRef = useRef(null);

  const estimatedPrice = useMemo(
    () => estimatePrice({ document: doc, settings }),
    [doc, settings]
  );
  const pagesToPrint = useMemo(
    () => parsePageRange(settings.pageRange, doc?.pages || 0) || doc?.pages || 0,
    [settings.pageRange, doc]
  );

  if (!session || !store) return <Navigate to="/" replace />;

  const update = (patch) => setSettings((s) => ({ ...s, ...patch }));

  const bumpScale = (delta) => {
    setSettings((s) => {
      const next = Math.min(200, Math.max(25, Math.round((s.scale + delta) / 5) * 5));
      return { ...s, scale: next };
    });
  };

  const handleSelectSample = (sampleName) => {
    const sample = SAMPLE_DOCUMENTS.find((d) => d.name === sampleName);
    if (!sample) return;
    setDoc(sample);
    setPreviewPage(1);
    update({ pageRange: `1-${sample.pages}` });
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split('.').pop()?.toUpperCase() || 'FILE';
    // Estimate pages: ~80KB per page for PDF/DOCX; min 1
    const estPages = Math.max(1, Math.round(file.size / 90000));
    setDoc({
      name: file.name,
      size_bytes: file.size,
      pages: estPages,
      type: ext,
      excerpt: 'Dokumen yang Anda unggah akan diproses oleh mesin cetak mitra.',
    });
    setPreviewPage(1);
    update({ pageRange: `1-${estPages}` });
  };

  const handleSubmitTask = () => {
    if (!doc) {
      setFormError('Pilih atau unggah dokumen terlebih dahulu.');
      return;
    }
    if (!settings.agreeTerms) {
      setFormError('Centang persetujuan syarat & ketentuan.');
      return;
    }
    if (pagesToPrint <= 0) {
      setFormError('Rentang halaman tidak valid.');
      return;
    }
    setFormError('');
    const task = {
      id: `JOB-${Math.floor(100 + Math.random() * 899)}`,
      createdAt: new Date().toISOString(),
      document: { name: doc.name, pages: doc.pages, size_bytes: doc.size_bytes },
      pagesToPrint,
      settings: { ...settings },
      price: Math.round(estimatedPrice),
      status: 'queued',
    };
    addTask(task);
    setToast({ type: 'success', message: `Tugas ${task.id} berhasil masuk antrean toko.` });
    setShowTasksDrawer(true);
    setTimeout(() => setToast(null), 3200);
  };

  const handleEndSession = () => {
    endSession();
    navigate('/');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
      {/* Session Status Bar */}
      <section
        className="bg-white rounded-2xl border border-slate-200/90 sheet-shadow p-4 sm:p-5 mb-6"
        data-testid="session-status-bar"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="w-10 h-10 rounded-xl bg-gradient-action grid place-items-center">
              <Printer className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <div
                className="font-mono text-[12.5px] font-semibold text-brand-tealDark bg-brand-tealLight/60 inline-block px-2 py-0.5 rounded-md"
                data-testid="session-id-display"
              >
                #{session.session_id}
              </div>
              <div className="mt-1 text-[12.5px] text-slate-600 truncate">
                <span className="text-slate-400">Alias</span>{' '}
                <span className="font-semibold text-slate-800">{alias}</span>
                <span className="mx-1.5 text-slate-300">&middot;</span>
                <span className="text-slate-400">Toko</span>{' '}
                <span className="font-mono text-slate-800">{store.store_code}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTasksDrawer(true)}
              className="relative inline-flex items-center gap-2 bg-white border border-slate-200 hover:border-brand-teal hover:text-brand-tealDark text-slate-700 rounded-lg px-3 py-2 text-xs font-semibold transition"
              data-testid="btn-toggle-task-list"
            >
              <ListChecks className="w-4 h-4" />
              Daftar Tugas
              {tasks.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-brand-teal text-white text-[10px] font-bold rounded-full w-4.5 h-4.5 min-w-[18px] px-1 grid place-items-center">
                  {tasks.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setShowEndConfirm(true)}
              className="inline-flex items-center gap-1.5 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 rounded-lg px-3 py-2 text-xs font-semibold transition"
              data-testid="btn-end-session"
            >
              <LogOut className="w-4 h-4" />
              Akhiri Sesi
            </button>
          </div>
        </div>
      </section>

      {/* Workbench */}
      <div className="grid lg:grid-cols-[1.1fr_1fr] gap-6">
        {/* Preview & File info */}
        <section className="space-y-4">
          <div
            className="bg-white rounded-2xl border border-slate-200/90 sheet-shadow p-4 sm:p-5"
            data-testid="document-preview-card"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-teal" />
                <h3 className="font-display font-semibold text-slate-900 text-sm">
                  Preview Dokumen
                </h3>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-500 font-mono">
                <button
                  onClick={() => setPreviewPage((p) => Math.max(1, p - 1))}
                  className="p-1 rounded hover:bg-slate-100"
                  aria-label="Halaman sebelumnya"
                  data-testid="btn-prev-page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span data-testid="preview-page-indicator">
                  {previewPage} / {doc.pages}
                </span>
                <button
                  onClick={() => setPreviewPage((p) => Math.min(doc.pages, p + 1))}
                  className="p-1 rounded hover:bg-slate-100"
                  aria-label="Halaman berikutnya"
                  data-testid="btn-next-page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div
              className="bg-slate-100 rounded-xl p-4 sm:p-6 grid place-items-center min-h-[320px]"
              data-testid="document-preview-area"
            >
              <div
                className={`relative bg-white sheet-shadow origin-center transition-transform ${
                  settings.colorMode === 'bw' ? 'grayscale' : ''
                }`}
                style={{
                  width: 220,
                  aspectRatio: PAPER_ASPECT[settings.paperSize] || PAPER_ASPECT.A4,
                  transform: `scale(${Math.max(0.4, settings.scale / 100)})`,
                }}
              >
                <div className="absolute inset-3 border border-dashed border-slate-200" />
                <div className="p-5 h-full flex flex-col">
                  <div className="text-[9px] uppercase tracking-wider text-slate-400 font-mono">
                    {doc.type} &middot; Hal. {previewPage}
                  </div>
                  <div className="mt-2 h-1 w-10 bg-slate-800 rounded" />
                  <div className="mt-2 text-[9px] text-slate-700 leading-snug whitespace-pre-line line-clamp-[18]">
                    {doc.excerpt}
                  </div>
                  <div className="mt-auto flex gap-1">
                    <span className="h-1 flex-1 bg-slate-200 rounded" />
                    <span className="h-1 flex-1 bg-slate-200 rounded" />
                    <span className="h-1 w-6 bg-slate-800 rounded" />
                  </div>
                </div>
                <div className="absolute bottom-1 right-2 text-[8px] text-slate-400 font-mono">
                  {settings.paperSize}
                </div>
              </div>
            </div>
          </div>

          {/* File info card */}
          <div
            className="bg-white rounded-2xl border border-slate-200/90 sheet-shadow p-4 sm:p-5"
            data-testid="file-info-card"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-semibold text-slate-900 text-sm">Tentang File</h3>
              <div className="flex items-center gap-2">
                <select
                  onChange={(e) => e.target.value && handleSelectSample(e.target.value)}
                  value=""
                  className="text-[11px] bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-600"
                  data-testid="sample-doc-select"
                >
                  <option value="">Pilih contoh dokumen</option>
                  {SAMPLE_DOCUMENTS.map((d) => (
                    <option key={d.name} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.pptx,.jpg,.jpeg,.png"
                  onChange={handleFile}
                  className="hidden"
                  data-testid="file-picker-input"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg px-3 py-1.5 text-[11.5px] font-semibold"
                  data-testid="btn-select-document"
                >
                  <Upload className="w-3.5 h-3.5" /> Pilih Dokumen
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <InfoCell label="Nama File" value={doc.name} testid="info-file-name" truncate />
              <InfoCell
                label="Ukuran"
                value={formatBytes(doc.size_bytes)}
                testid="info-file-size"
              />
              <InfoCell label="Halaman" value={`${doc.pages} hal.`} testid="info-file-pages" />
              <InfoCell
                label="Est. Harga"
                value={formatRupiah(estimatedPrice)}
                testid="info-estimated-price"
                highlight
              />
            </div>
            <p className="mt-3 text-[11px] text-slate-500">
              Estimasi harga otomatis berdasarkan {pagesToPrint} halaman &times; {settings.copies}{' '}
              salinan &middot; {settings.colorMode === 'bw' ? 'Hitam-Putih' : 'Warna'} &middot;{' '}
              {settings.paperSize}.
            </p>
          </div>
        </section>

        {/* Print Config Form */}
        <section
          className="bg-white rounded-2xl border border-slate-200/90 sheet-shadow p-5 sm:p-6"
          data-testid="print-spec-form"
        >
          <h3 className="font-display font-semibold text-slate-900 text-base mb-5">
            Spesifikasi Cetak
          </h3>

          <div className="space-y-5">
            {/* Copies */}
            <div>
              <Label>Jumlah Salinan</Label>
              <div className="flex items-stretch rounded-xl border border-slate-200 overflow-hidden w-fit">
                <button
                  onClick={() => update({ copies: Math.max(1, settings.copies - 1) })}
                  className="px-3 bg-slate-50 hover:bg-slate-100 text-slate-700"
                  data-testid="btn-copies-down"
                  aria-label="Kurangi salinan"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  min="1"
                  max="999"
                  value={settings.copies}
                  onChange={(e) =>
                    update({ copies: Math.max(1, parseInt(e.target.value || '1', 10)) })
                  }
                  className="w-16 text-center outline-none text-sm font-semibold text-slate-800"
                  data-testid="input-copies"
                />
                <button
                  onClick={() => update({ copies: Math.min(999, settings.copies + 1) })}
                  className="px-3 bg-slate-50 hover:bg-slate-100 text-slate-700"
                  data-testid="btn-copies-up"
                  aria-label="Tambah salinan"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Color mode */}
            <div>
              <Label>Mode Cetak (B/W atau Warna)</Label>
              <div className="relative">
                <select
                  value={settings.colorMode}
                  onChange={(e) => update({ colorMode: e.target.value })}
                  className="w-full appearance-none bg-slate-50/60 border border-slate-200 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 rounded-xl px-4 py-3 text-sm font-medium outline-none pr-10"
                  data-testid="dropdown-color-mode"
                >
                  <option value="bw">
                    Hitam Putih (B/W) &middot; {formatRupiah(COLOR_MODE_RATES.bw)}/lembar
                  </option>
                  <option value="color">
                    Warna (Full Color) &middot; {formatRupiah(COLOR_MODE_RATES.color)}/lembar
                  </option>
                </select>
                {settings.colorMode === 'bw' ? (
                  <CircleDot className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                ) : (
                  <Palette className="w-4 h-4 text-brand-cyan absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                )}
              </div>
            </div>

            {/* Paper size */}
            <div>
              <Label>Ukuran Kertas</Label>
              <select
                value={settings.paperSize}
                onChange={(e) => update({ paperSize: e.target.value })}
                className="w-full bg-slate-50/60 border border-slate-200 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 rounded-xl px-4 py-3 text-sm font-medium outline-none"
                data-testid="dropdown-paper-size"
              >
                {PAPER_OPTIONS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label} &mdash; {p.badge}
                  </option>
                ))}
              </select>
            </div>

            {/* Page range */}
            <div>
              <Label>Rentang Halaman</Label>
              <input
                type="text"
                value={settings.pageRange}
                onChange={(e) => update({ pageRange: e.target.value })}
                placeholder={`Semua, 1-${doc.pages}, atau 1-5, 8, 11-${doc.pages}`}
                className="w-full bg-slate-50/60 border border-slate-200 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 rounded-xl px-4 py-3 text-sm font-mono outline-none"
                data-testid="input-page-range"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                {pagesToPrint} dari {doc.pages} halaman akan dicetak.
              </p>
            </div>

            {/* Scale with triangle steppers */}
            <div>
              <Label>Skala Cetak (%)</Label>
              <div className="relative w-40">
                <input
                  type="number"
                  min="25"
                  max="200"
                  step="5"
                  value={settings.scale}
                  onChange={(e) =>
                    update({ scale: Math.min(200, Math.max(25, parseInt(e.target.value || '100', 10))) })
                  }
                  className="w-full bg-slate-50/60 border border-slate-200 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 rounded-xl pl-4 pr-10 py-3 text-sm font-semibold outline-none"
                  data-testid="input-scale-percent"
                />
                <div className="absolute right-1 top-1 bottom-1 flex flex-col w-7 border-l border-slate-200">
                  <button
                    onClick={() => bumpScale(5)}
                    className="flex-1 grid place-items-center text-slate-500 hover:text-brand-teal hover:bg-brand-tealLight/50 rounded-tr-xl"
                    aria-label="Naikkan skala"
                    data-testid="btn-scale-up"
                  >
                    <Triangle className="w-3 h-3 fill-current" />
                  </button>
                  <div className="h-px bg-slate-200" />
                  <button
                    onClick={() => bumpScale(-5)}
                    className="flex-1 grid place-items-center text-slate-500 hover:text-brand-teal hover:bg-brand-tealLight/50 rounded-br-xl"
                    aria-label="Turunkan skala"
                    data-testid="btn-scale-down"
                  >
                    <Triangle className="w-3 h-3 fill-current rotate-180" />
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Rentang 25% hingga 200%, step 5%.</p>
            </div>

            {/* Notes */}
            <div>
              <Label>Catatan Tambahan</Label>
              <textarea
                rows={3}
                value={settings.notes}
                onChange={(e) => update({ notes: e.target.value })}
                placeholder="Contoh: Tolong dijilid mika bening depan, staples 2 kiri, cetak bolak-balik."
                className="w-full bg-slate-50/60 border border-slate-200 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 rounded-xl px-4 py-3 text-sm outline-none resize-none"
                data-testid="input-additional-notes"
              />
            </div>

            {/* Terms */}
            <label
              className="flex items-start gap-2.5 text-[12.5px] text-slate-600 cursor-pointer select-none"
              data-testid="label-terms"
            >
              <input
                type="checkbox"
                checked={settings.agreeTerms}
                onChange={(e) => update({ agreeTerms: e.target.checked })}
                className="mt-0.5 w-4 h-4 rounded border-slate-300 text-brand-teal focus:ring-brand-teal/40"
                data-testid="checkbox-terms-agree"
              />
              <span>
                Saya menyetujui syarat &amp; ketentuan pencetakan serta kerahasiaan dokumen
                PrintOrder.
              </span>
            </label>

            {formError && (
              <div
                className="flex items-start gap-2 text-sm bg-rose-50 border border-rose-200 text-rose-700 rounded-lg px-3 py-2"
                data-testid="form-error"
              >
                <AlertCircle className="w-4 h-4 mt-0.5" />
                {formError}
              </div>
            )}

            <button
              onClick={handleSubmitTask}
              className="w-full bg-gradient-action text-white rounded-xl px-4 py-3.5 text-sm font-semibold inline-flex items-center justify-center gap-2 shadow-md shadow-brand-teal/20 hover:brightness-110 transition"
              data-testid="btn-submit-print-task"
            >
              <Send className="w-4 h-4" />
              Kirim Tugas Cetak &middot; {formatRupiah(estimatedPrice)}
            </button>
          </div>
        </section>
      </div>

      {/* Tasks drawer */}
      {showTasksDrawer && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex justify-end animate-fade-in"
          onClick={() => setShowTasksDrawer(false)}
          data-testid="print-tasks-drawer"
        >
          <aside
            className="w-full sm:max-w-md bg-white h-full shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ListChecks className="w-5 h-5 text-brand-teal" />
                <h3 className="font-display font-semibold text-slate-900">
                  Daftar Tugas Cetak ({tasks.length})
                </h3>
              </div>
              <button
                onClick={() => setShowTasksDrawer(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
                aria-label="Tutup"
                data-testid="btn-close-tasks"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {tasks.length === 0 && (
                <div className="text-center py-10 text-sm text-slate-500">
                  Belum ada tugas cetak di sesi ini.
                </div>
              )}
              {tasks.map((t) => (
                <TaskItem key={t.id} task={t} />
              ))}
            </div>
          </aside>
        </div>
      )}

      {/* End session confirm */}
      {showEndConfirm && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm grid place-items-center p-4 animate-fade-in"
          onClick={() => setShowEndConfirm(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-5"
            onClick={(e) => e.stopPropagation()}
            data-testid="end-session-modal"
          >
            <h4 className="font-display font-bold text-slate-900">Akhiri Sesi Cetak?</h4>
            <p className="text-sm text-slate-600 mt-1.5">
              Sesi {session.session_id} akan ditutup. Tugas yang sudah dikirim tetap akan diproses
              toko.
            </p>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowEndConfirm(false)}
                className="flex-1 border border-slate-200 text-slate-700 rounded-lg px-3 py-2 text-sm font-semibold"
                data-testid="btn-cancel-end"
              >
                Batal
              </button>
              <button
                onClick={handleEndSession}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg px-3 py-2 text-sm font-semibold"
                data-testid="btn-confirm-end"
              >
                Ya, Akhiri
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[60] bg-emerald-600 text-white rounded-xl shadow-xl px-4 py-3 text-sm font-medium flex items-center gap-2 animate-fade-in"
          data-testid="task-success-toast"
        >
          <CheckCircle2 className="w-4 h-4" />
          {toast.message}
        </div>
      )}
    </div>
  );
}

function Label({ children }) {
  return (
    <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 font-mono mb-1.5">
      {children}
    </div>
  );
}

function InfoCell({ label, value, testid, highlight, truncate }) {
  return (
    <div
      className={`rounded-lg px-3 py-2 ${
        highlight
          ? 'bg-gradient-to-br from-brand-tealLight/80 to-brand-cyanLight/60 border border-brand-teal/20'
          : 'bg-slate-50/80 border border-slate-100'
      }`}
    >
      <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
        {label}
      </div>
      <div
        className={`mt-0.5 text-[13px] font-semibold ${
          highlight ? 'text-brand-tealDark' : 'text-slate-800'
        } ${truncate ? 'truncate' : ''}`}
        data-testid={testid}
        title={truncate ? value : undefined}
      >
        {value}
      </div>
    </div>
  );
}

function TaskItem({ task }) {
  const statusMap = {
    queued: {
      label: 'Dalam Antrean',
      cls: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: Clock3,
    },
    processing: {
      label: 'Sedang Dicetak',
      cls: 'bg-sky-50 text-sky-700 border-sky-200',
      icon: Printer,
    },
    done: {
      label: 'Siap Diambil',
      cls: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: CheckCircle2,
    },
  };
  const s = statusMap[task.status] || statusMap.queued;
  const Icon = s.icon;
  return (
    <div
      className="border border-slate-200 rounded-xl p-3 hover:border-brand-teal/40 transition"
      data-testid="print-task-item"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="font-mono text-[12px] font-semibold text-brand-tealDark bg-brand-tealLight/50 px-2 py-0.5 rounded-md">
          #{task.id}
        </div>
        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold border rounded-full px-2 py-0.5 ${s.cls}`}>
          <Icon className="w-3 h-3" />
          {s.label}
        </span>
      </div>
      <div className="mt-1.5 text-[13px] font-semibold text-slate-800 truncate" title={task.document.name}>
        {task.document.name}
      </div>
      <div className="mt-1 text-[11.5px] text-slate-500">
        {task.settings.paperSize} &middot;{' '}
        {task.settings.colorMode === 'bw' ? 'Hitam-Putih' : 'Warna'} &middot; {task.settings.copies}{' '}
        salinan &middot; {task.pagesToPrint} hal. &middot; Skala {task.settings.scale}%
      </div>
      <div className="mt-2 text-[12.5px] font-semibold text-slate-900">
        {formatRupiah(task.price)}
      </div>
    </div>
  );
}
