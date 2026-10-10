import React, { useEffect, useRef, useState } from 'react';
import { X, Camera, CameraOff, ScanLine, Loader2 } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { MOCK_STORES } from '../lib/mock';

export default function BarcodeScanner({ open, onClose, onDetected }) {
  const regionId = 'barcode-reader-region';
  const scannerRef = useRef(null);
  const [status, setStatus] = useState('idle'); // idle | starting | running | denied | error
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    (async () => {
      setStatus('starting');
      setErrorMsg('');
      try {
        const el = document.getElementById(regionId);
        if (!el) return;
        const scanner = new Html5Qrcode(regionId, { verbose: false });
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 240, height: 240 } },
          (decodedText) => {
            if (cancelled) return;
            onDetected(decodedText);
          },
          () => {}
        );
        if (!cancelled) setStatus('running');
      } catch (err) {
        console.warn('Scanner error:', err);
        if (cancelled) return;
        const name = err?.name || '';
        if (name === 'NotAllowedError' || /permission/i.test(String(err))) {
          setStatus('denied');
          setErrorMsg('Izin kamera ditolak. Berikan akses kamera atau pilih toko manual.');
        } else {
          setStatus('error');
          setErrorMsg('Kamera tidak tersedia pada perangkat ini.');
        }
      }
    })();

    return () => {
      cancelled = true;
      const s = scannerRef.current;
      if (s && s.isScanning) {
        s.stop().catch(() => {}).finally(() => s.clear().catch(() => {}));
      }
    };
  }, [open, onDetected]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      data-testid="barcode-scanner-modal"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ScanLine className="w-5 h-5 text-brand-teal" />
            <h3 className="font-display font-semibold text-slate-900">Scan Barcode Toko</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
            data-testid="btn-close-scanner"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative aspect-square bg-slate-900">
          <div id={regionId} className="absolute inset-0" />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="relative w-60 h-60 border-2 border-brand-teal rounded-2xl overflow-hidden">
              <div className="absolute left-0 right-0 h-0.5 bg-brand-teal shadow-[0_0_12px_#0D9488] animate-laser" />
              <div className="absolute -left-1 -top-1 w-6 h-6 border-t-4 border-l-4 border-brand-teal rounded-tl-xl" />
              <div className="absolute -right-1 -top-1 w-6 h-6 border-t-4 border-r-4 border-brand-teal rounded-tr-xl" />
              <div className="absolute -left-1 -bottom-1 w-6 h-6 border-b-4 border-l-4 border-brand-teal rounded-bl-xl" />
              <div className="absolute -right-1 -bottom-1 w-6 h-6 border-b-4 border-r-4 border-brand-teal rounded-br-xl" />
            </div>
          </div>

          {status === 'starting' && (
            <div className="absolute inset-0 bg-slate-900/70 flex flex-col items-center justify-center text-white gap-2">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-sm">Menyiapkan kamera...</span>
            </div>
          )}
          {(status === 'denied' || status === 'error') && (
            <div className="absolute inset-0 bg-slate-900/85 flex flex-col items-center justify-center text-white gap-2 px-6 text-center">
              {status === 'denied' ? (
                <CameraOff className="w-7 h-7 text-rose-400" />
              ) : (
                <Camera className="w-7 h-7 text-amber-400" />
              )}
              <p className="text-sm leading-relaxed">{errorMsg}</p>
            </div>
          )}
        </div>

        <div className="px-5 py-4 bg-slate-50/70 border-t border-slate-100">
          <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 mb-2">
            Atau pilih toko demo
          </p>
          <div className="flex flex-wrap gap-2">
            {MOCK_STORES.slice(0, 3).map((s) => (
              <button
                key={s.store_code}
                onClick={() => onDetected(s.store_code)}
                className="text-xs font-mono bg-white border border-slate-200 hover:border-brand-teal hover:text-brand-tealDark px-2.5 py-1.5 rounded-lg transition-colors"
                data-testid={`demo-store-pill-${s.store_code}`}
              >
                {s.store_code}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
