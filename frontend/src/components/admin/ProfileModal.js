import React, { useState } from 'react';
import { X, LogOut, User, Mail, Shield, Save, KeyRound, Lock } from 'lucide-react';
import { MOCK_ADMIN_USER } from '../../lib/adminMock';

export default function ProfileModal({ open, onClose, user, setUser, onLogout }) {
  const [profile, setProfile] = useState({
    username: user?.username || MOCK_ADMIN_USER.username,
    email: user?.email || MOCK_ADMIN_USER.email,
    pin: '',
  });
  const [pw, setPw] = useState({ old: '', new: '', confirm: '' });
  const [pin, setPin] = useState({ password: '', pin: '', confirm: '' });
  const [savedBanner, setSavedBanner] = useState('');
  const [error, setError] = useState('');

  if (!open) return null;

  const flash = (msg) => {
    setSavedBanner(msg);
    setError('');
    setTimeout(() => setSavedBanner(''), 2200);
  };

  const handleSaveProfile = () => {
    if (!profile.username.trim() || !profile.email.trim()) {
      setError('Username dan email tidak boleh kosong.');
      return;
    }
    setUser({ ...user, username: profile.username.trim(), email: profile.email.trim() });
    flash('Profil berhasil disimpan.');
  };

  const handleChangePassword = () => {
    if (!pw.old || !pw.new || !pw.confirm) {
      setError('Semua kolom password wajib diisi.');
      return;
    }
    if (pw.new.length < 6) {
      setError('Password baru minimal 6 karakter.');
      return;
    }
    if (pw.new !== pw.confirm) {
      setError('Konfirmasi password baru tidak cocok.');
      return;
    }
    setPw({ old: '', new: '', confirm: '' });
    flash('Password berhasil diganti.');
  };

  const handleSavePin = () => {
    if (!pin.password) {
      setError('Masukkan password saat ini.');
      return;
    }
    if (!/^\d{4,8}$/.test(pin.pin)) {
      setError('PIN harus 4-8 digit angka.');
      return;
    }
    if (pin.pin !== pin.confirm) {
      setError('Konfirmasi PIN tidak cocok.');
      return;
    }
    setUser({ ...user, pin_active: true });
    setPin({ password: '', pin: '', confirm: '' });
    flash('PIN berhasil disimpan.');
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/55 backdrop-blur-sm flex justify-end sm:items-center sm:justify-center p-0 sm:p-4 animate-fade-in"
      onClick={onClose}
      data-testid="profile-modal"
    >
      <div
        className="w-full sm:max-w-xl max-h-full sm:max-h-[88vh] bg-white sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-white sticky top-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-action grid place-items-center text-white font-bold">
              {(user?.username || 'M').slice(0, 1).toUpperCase()}
            </div>
            <div>
              <div className="font-display font-semibold text-slate-900">Pengaturan Akun</div>
              <div className="text-[11.5px] text-slate-500 font-mono">{user?.store_code}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 text-xs font-semibold bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 rounded-lg px-3 py-1.5"
              data-testid="btn-logout"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
              aria-label="Tutup"
              data-testid="btn-close-profile"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto px-5 py-5 space-y-6">
          {savedBanner && (
            <div className="text-sm bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg px-3 py-2">
              {savedBanner}
            </div>
          )}
          {error && (
            <div className="text-sm bg-rose-50 border border-rose-200 text-rose-700 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          {/* Section: Profile */}
          <section>
            <SectionTitle icon={<User className="w-4 h-4 text-brand-teal" />} title="Profil Akun" />
            <div className="space-y-3">
              <Field label="Username" icon={<User className="w-3.5 h-3.5" />}>
                <input
                  value={profile.username}
                  onChange={(e) => setProfile((p) => ({ ...p, username: e.target.value }))}
                  className="form-input"
                  data-testid="input-username"
                />
              </Field>
              <Field label="Email" icon={<Mail className="w-3.5 h-3.5" />}>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                  className="form-input"
                  data-testid="input-email"
                />
              </Field>
              <Field
                label={
                  <span className="flex items-center gap-2">
                    PIN
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full border ${
                        user?.pin_active
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                          : 'bg-slate-50 border-slate-200 text-slate-500'
                      }`}
                      data-testid="pin-status-badge"
                    >
                      {user?.pin_active ? 'Aktif' : 'Belum Aktif'}
                    </span>
                  </span>
                }
                icon={<Shield className="w-3.5 h-3.5" />}
              >
                <input
                  type="password"
                  value={profile.pin}
                  onChange={(e) => setProfile((p) => ({ ...p, pin: e.target.value }))}
                  placeholder="Kosong - atur di bagian Kelola PIN"
                  className="form-input"
                  disabled
                  data-testid="input-pin-display"
                />
              </Field>
              <div className="flex justify-end">
                <button
                  onClick={handleSaveProfile}
                  className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg px-4 py-2 text-sm font-semibold"
                  data-testid="btn-save-profile"
                >
                  <Save className="w-4 h-4" /> Simpan Profil
                </button>
              </div>
            </div>
          </section>

          {/* Section: Password */}
          <section className="pt-5 border-t border-slate-100">
            <SectionTitle icon={<Lock className="w-4 h-4 text-brand-teal" />} title="Ganti Password" />
            <div className="space-y-3">
              <Field label="Password Lama">
                <input
                  type="password"
                  value={pw.old}
                  onChange={(e) => setPw((p) => ({ ...p, old: e.target.value }))}
                  className="form-input"
                  data-testid="input-old-password"
                />
              </Field>
              <Field label="Password Baru">
                <input
                  type="password"
                  value={pw.new}
                  onChange={(e) => setPw((p) => ({ ...p, new: e.target.value }))}
                  className="form-input"
                  data-testid="input-new-password"
                />
              </Field>
              <Field label="Konfirmasi Password Baru">
                <input
                  type="password"
                  value={pw.confirm}
                  onChange={(e) => setPw((p) => ({ ...p, confirm: e.target.value }))}
                  className="form-input"
                  data-testid="input-confirm-password"
                />
              </Field>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  className="text-xs text-brand-cyan hover:underline"
                  data-testid="link-forgot-password"
                >
                  Lupa password?
                </button>
                <button
                  onClick={handleChangePassword}
                  className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg px-4 py-2 text-sm font-semibold"
                  data-testid="btn-change-password"
                >
                  <Lock className="w-4 h-4" /> Ganti Password
                </button>
              </div>
            </div>
          </section>

          {/* Section: PIN */}
          <section className="pt-5 border-t border-slate-100">
            <SectionTitle
              icon={<KeyRound className="w-4 h-4 text-brand-teal" />}
              title="Kelola PIN"
            />
            <div className="space-y-3">
              <Field label="Password Saat Ini">
                <input
                  type="password"
                  value={pin.password}
                  onChange={(e) => setPin((p) => ({ ...p, password: e.target.value }))}
                  className="form-input"
                  data-testid="input-pin-password"
                />
              </Field>
              <Field label="PIN Baru (4-8 digit)">
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={8}
                  value={pin.pin}
                  onChange={(e) => setPin((p) => ({ ...p, pin: e.target.value.replace(/\D/g, '') }))}
                  className="form-input font-mono tracking-widest"
                  data-testid="input-new-pin"
                />
              </Field>
              <Field label="Konfirmasi PIN">
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={8}
                  value={pin.confirm}
                  onChange={(e) =>
                    setPin((p) => ({ ...p, confirm: e.target.value.replace(/\D/g, '') }))
                  }
                  className="form-input font-mono tracking-widest"
                  data-testid="input-confirm-pin"
                />
              </Field>
              <div className="flex justify-end">
                <button
                  onClick={handleSavePin}
                  className="inline-flex items-center gap-1.5 bg-gradient-action text-white rounded-lg px-4 py-2 text-sm font-semibold"
                  data-testid="btn-save-pin"
                >
                  <Save className="w-4 h-4" /> Simpan PIN
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ icon, title }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      {icon}
      <h4 className="font-display font-semibold text-slate-900 text-sm">{title}</h4>
    </div>
  );
}

function Field({ label, icon, children }) {
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
