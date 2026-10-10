import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SessionProvider } from './lib/SessionContext';
import Home from './pages/Home';
import StoreConfirm from './pages/StoreConfirm';
import PrintSession from './pages/PrintSession';
import Header from './components/Header';

export default function App() {
  return (
    <SessionProvider>
      <div className="min-h-screen flex flex-col paper-noise">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/store-confirm/:code" element={<StoreConfirm />} />
            <Route path="/session" element={<PrintSession />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <footer className="border-t border-slate-200/80 bg-white/70 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-xs text-slate-500 flex items-center justify-between flex-wrap gap-2">
            <span>&copy; 2026 PrintOrder &middot; Cetak Dokumen Tanpa Antre</span>
            <span className="font-mono text-[11px]">v0.1 Mock Preview</span>
          </div>
        </footer>
      </div>
    </SessionProvider>
  );
}
