import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Printer } from 'lucide-react';
import { useSession } from '../lib/SessionContext';

export default function Header() {
  const { alias, store, session } = useSession();
  const location = useLocation();
  const onSession = location.pathname.startsWith('/session');

  return (
    <header
      className="sticky top-0 z-40 backdrop-blur-md bg-white/85 border-b border-slate-200/80"
      data-testid="app-header"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-2.5 group" data-testid="brand-home-link">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-action grid place-items-center shadow-md shadow-brand-teal/20">
              <Printer className="w-5 h-5 text-white" strokeWidth={2.4} />
            </div>
            <span className="absolute -right-0.5 -bottom-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-white animate-pulseDot" />
          </div>
          <div className="leading-tight">
            <div className="font-display font-bold text-slate-900 text-[17px] tracking-tight">
              PrintOrder
            </div>
            <div className="text-[10.5px] uppercase tracking-wider text-slate-500 font-mono">
              Smart Print Kiosk
            </div>
          </div>
        </Link>

        {onSession && session ? (
          <div
            className="hidden sm:flex items-center gap-2 text-xs font-mono bg-brand-tealLight/60 text-brand-tealDark px-3 py-1.5 rounded-full border border-brand-teal/20"
            data-testid="header-session-pill"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-teal animate-pulseDot" />
            <span>{session.session_id}</span>
            <span className="text-slate-400">&middot;</span>
            <span className="text-slate-700">{alias}</span>
            <span className="text-slate-400">&middot;</span>
            <span className="text-slate-700">{store?.store_code}</span>
          </div>
        ) : (
          <div className="text-[11px] text-slate-500 hidden sm:block">
            Kirim dokumen cetak langsung &middot; tanpa antre, tanpa WA
          </div>
        )}
      </div>
    </header>
  );
}
