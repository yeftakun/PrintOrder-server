import React, { useState } from 'react';
import { X, Clock, Save } from 'lucide-react';
import { DAYS } from '../../lib/adminMock';

export default function HoursModal({ open, initial, onClose, onSave }) {
  const [hours, setHours] = useState(initial);

  if (!open) return null;

  const update = (key, patch) => setHours((h) => ({ ...h, [key]: { ...h[key], ...patch } }));

  const handleSave = () => {
    // Normalize: clear open/close if disabled
    const normalized = Object.fromEntries(
      Object.entries(hours).map(([k, v]) => [
        k,
        v.enabled ? v : { enabled: false, open: '', close: '' },
      ])
    );
    onSave(normalized);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/55 backdrop-blur-sm grid place-items-center p-4 animate-fade-in"
      onClick={onClose}
      data-testid="hours-modal"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-brand-teal" />
            <h3 className="font-display font-semibold text-slate-900">Waktu Operasional Toko</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
            data-testid="btn-close-hours"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-4 space-y-2">
          {DAYS.map((d) => {
            const h = hours[d.key] || { enabled: false, open: '', close: '' };
            return (
              <div
                key={d.key}
                className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 bg-slate-50/70 border border-slate-100 rounded-xl px-3 py-2.5"
                data-testid={`hours-row-${d.key}`}
              >
                <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer min-w-[90px]">
                  <input
                    type="checkbox"
                    checked={h.enabled}
                    onChange={(e) => update(d.key, { enabled: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 text-brand-teal focus:ring-brand-teal/40"
                    data-testid={`checkbox-day-${d.key}`}
                  />
                  <span className="font-medium">{d.label}</span>
                </label>
                <div />
                <input
                  type="time"
                  disabled={!h.enabled}
                  value={h.open}
                  onChange={(e) => update(d.key, { open: e.target.value })}
                  className="form-input !py-1.5 !px-2 text-xs w-24 disabled:bg-slate-100 disabled:text-slate-400"
                  data-testid={`input-open-${d.key}`}
                />
                <input
                  type="time"
                  disabled={!h.enabled}
                  value={h.close}
                  onChange={(e) => update(d.key, { close: e.target.value })}
                  className="form-input !py-1.5 !px-2 text-xs w-24 disabled:bg-slate-100 disabled:text-slate-400"
                  data-testid={`input-close-${d.key}`}
                />
              </div>
            );
          })}
        </div>

        <div className="px-5 py-3 border-t border-slate-100 flex gap-2 bg-slate-50/50">
          <button
            onClick={onClose}
            className="flex-1 border border-slate-200 bg-white text-slate-700 rounded-lg px-3 py-2 text-sm font-semibold"
            data-testid="btn-cancel-hours"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-gradient-action text-white rounded-lg px-3 py-2 text-sm font-semibold inline-flex items-center justify-center gap-1.5"
            data-testid="btn-save-hours"
          >
            <Save className="w-4 h-4" /> Simpan Waktu
          </button>
        </div>
      </div>
    </div>
  );
}
