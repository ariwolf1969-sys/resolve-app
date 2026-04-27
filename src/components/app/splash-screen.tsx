'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { useAppStore } from '@/store/app-store';
import { ARGENTINA_PROVINCES, getCitiesByProvince, isCaba } from '@/lib/argentina-locations';

export function SplashScreen() {
  const { setView } = useAppStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      setView('web-landing');
    }, 2000);
    return () => clearTimeout(timer);
  }, [setView]);

  return (
    <div className="min-h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 px-8">
      <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-xl mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      </div>
      <h1 className="text-4xl font-bold text-white mb-2">Resolvé</h1>
      <p className="text-blue-100 text-center text-base">
        Lo que necesitás, cuando lo necesitás.
      </p>
      <div className="mt-8 flex gap-1">
        <div className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}

export function OnboardingScreen() {
  const { setView, setCurrentUser } = useAppStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [dniNumber, setDniNumber] = useState('');
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [neighborhoodSearch, setNeighborhoodSearch] = useState('');
  const [showNeighborhoodDropdown, setShowNeighborhoodDropdown] = useState(false);
  const [role, setRole] = useState<'client' | 'provider'>('client');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const phoneRef = useRef<HTMLInputElement>(null);
  const neighborhoodRef = useRef<HTMLDivElement>(null);

  const cities = useMemo(() => {
    if (!province) return [];
    return getCitiesByProvince(province);
  }, [province]);

  // For CABA, city IS the barrio - no separate neighborhood field needed
  const showNeighborhoodField = useMemo(() => {
    return !isCaba(province);
  }, [province]);

  // Neighborhoods only for non-CABA provinces
  const neighborhoods = useMemo(() => {
    if (!city || !province || isCaba(province)) return [];
    const prov = ARGENTINA_PROVINCES.find(p => p.id === province);
    if (!prov) return [];
    if (prov.workZones && prov.workZones.length > 0) {
      return [...prov.workZones].sort((a, b) => a.localeCompare(b, 'es'));
    }
    return [];
  }, [city, province]);

  const filteredNeighborhoods = useMemo(() => {
    if (!neighborhoodSearch) return neighborhoods;
    const q = neighborhoodSearch.toLowerCase();
    return neighborhoods.filter(n => n.toLowerCase().includes(q));
  }, [neighborhoods, neighborhoodSearch]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    setPhone(raw);
    requestAnimationFrame(() => {
      if (phoneRef.current) {
        const pos = Math.min(raw.length, e.target.selectionStart || raw.length);
        phoneRef.current.setSelectionRange(pos, pos);
      }
    });
  };

  // Close neighborhood dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (neighborhoodRef.current && !neighborhoodRef.current.contains(e.target as Node)) {
        setShowNeighborhoodDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async () => {
    if (!name.trim() || !phone.trim() || !email.trim() || !password.trim()) return;
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    if (!dniNumber.trim() || dniNumber.trim().length < 6) {
      setError('Ingresá un DNI válido');
      return;
    }
    if (!province) {
      setError('Seleccioná una provincia');
      return;
    }
    if (!city) {
      setError(isCaba(province) ? 'Seleccioná un barrio' : 'Seleccioná una ciudad');
      return;
    }
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password: password,
          phone: phone.trim(),
          role: role,
          dniNumber: dniNumber.trim(),
          province: province,
          city: city,
          neighborhood: neighborhood.trim() || undefined,
        }),
      });

      if (res.ok) {
        const user = await res.json();
        setCurrentUser(user);
        if (role === 'provider') {
          setView('register-pro');
        } else {
          setView('home');
        }
      } else {
        const data = await res.json();
        setError(data.error || 'Error al crear cuenta');
      }
    } catch (err) {
      console.error(err);
      setError('Error de conexión. Intentá de nuevo.');
    }
    setIsSubmitting(false);
  };

  const handleDemoLogin = async () => {
    try {
      const res = await fetch('/api/users');
      const users = await res.json();
      if (users.length > 0) {
        setCurrentUser(users[0]);
        setView('home');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const inputClass = "w-full p-3.5 rounded-xl border border-gray-200 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all";
  const selectClass = "w-full p-3.5 rounded-xl border border-gray-200 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%239ca3af%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat pr-10 text-gray-700";

  const isFormValid = name.trim() && phone.trim() && email.trim() && password.trim() && confirmPassword.trim() && dniNumber.trim() && province && city;

  return (
    <div className="min-h-full flex flex-col bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 px-6 pt-12 pb-10 rounded-b-[2rem]">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <span className="text-2xl font-bold text-white">Resolvé</span>
        </div>
        <p className="text-blue-100 text-center text-sm">
          Conectamos personas que necesitan con personas que pueden ayudar.
        </p>
      </div>

      {/* Form */}
      <div className="flex-1 px-6 pt-8 pb-6">
        <h2 className="text-xl font-bold mb-1">Creá tu perfil</h2>
        <p className="text-muted-foreground text-sm mb-5">Solo toma 30 segundos</p>

        {/* Step indicators */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex items-center gap-1.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-[11px] font-bold text-white">1</div>
            <span className="text-xs font-medium text-blue-600">Cuenta</span>
          </div>
          <div className="h-px flex-1 bg-gray-200" />
          <div className="flex items-center gap-1.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-[11px] font-bold text-gray-500">2</div>
            <span className="text-xs font-medium text-gray-400">Ubicación</span>
          </div>
        </div>

        {/* Account type selector */}
        <div className="mb-6">
          <label className="text-sm font-medium mb-2.5 block">¿Cómo querés usar Resolvé?</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole('client')}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                role === 'client'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors ${
                role === 'client' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div className="text-center">
                <div className={`text-sm font-semibold ${role === 'client' ? 'text-blue-700' : 'text-gray-700'}`}>
                  Cliente
                </div>
                <div className="text-[11px] text-gray-500 mt-0.5">
                  Busco servicios
                </div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setRole('provider')}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                role === 'provider'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors ${
                role === 'provider' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                </svg>
              </div>
              <div className="text-center">
                <div className={`text-sm font-semibold ${role === 'provider' ? 'text-blue-700' : 'text-gray-700'}`}>
                  Profesional
                </div>
                <div className="text-[11px] text-gray-500 mt-0.5">
                  Ofrezco servicios
                </div>
              </div>
            </button>
          </div>
          {role === 'provider' && (
            <p className="text-[11px] text-blue-600 mt-2 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
              Como profesional, también podrás solicitar servicios como cliente
            </p>
          )}
        </div>

        {/* Section: Datos personales */}
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Datos personales</p>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Nombre *</label>
            <input
              type="text"
              placeholder="Ej: Maria Garcia"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Email *</label>
            <input
              type="email"
              placeholder="Ej: maria@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Contraseña *</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputClass} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Confirmar contraseña *</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Repetí tu contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`${inputClass} pr-11 ${confirmPassword && confirmPassword !== password ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {confirmPassword && confirmPassword !== password && (
              <p className="text-red-500 text-[11px] mt-1">Las contraseñas no coinciden</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Teléfono *</label>
            <input
              ref={phoneRef}
              type="tel"
              placeholder="Ej: 11 12345678"
              value={phone}
              onChange={handlePhoneChange}
              inputMode="numeric"
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">DNI *</label>
            <input
              type="text"
              placeholder="Ej: 35123456"
              value={dniNumber}
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, '');
                setDniNumber(raw);
              }}
              inputMode="numeric"
              maxLength={10}
              className={inputClass}
            />
          </div>
        </div>

        {/* Section: Ubicación */}
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 mt-6">Ubicación</p>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Provincia *</label>
            <select
              value={province}
              onChange={(e) => {
                setProvince(e.target.value);
                setCity('');
                setNeighborhood('');
                setNeighborhoodSearch('');
              }}
              className={selectClass}
            >
              <option value="">Seleccioná una provincia</option>
              {ARGENTINA_PROVINCES.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">{isCaba(province) ? 'Barrio *' : 'Ciudad *'}</label>
            <select
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setNeighborhood('');
                setNeighborhoodSearch('');
              }}
              className={selectClass}
              disabled={!province}
            >
              <option value="">{province ? (isCaba(province) ? 'Seleccioná tu barrio' : 'Seleccioná una ciudad') : 'Primero elegí una provincia'}</option>
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          {showNeighborhoodField && city && (
            <div ref={neighborhoodRef} className="relative">
              <label className="text-sm font-medium mb-1.5 block">Barrio</label>
              <input
                type="text"
                placeholder={neighborhoods.length > 0 ? "Buscá o seleccioná tu barrio..." : "No hay barrios disponibles"}
                value={neighborhood ? neighborhood : neighborhoodSearch}
                onChange={(e) => {
                  setNeighborhoodSearch(e.target.value);
                  if (neighborhood) setNeighborhood('');
                  setShowNeighborhoodDropdown(true);
                }}
                onFocus={() => {
                  if (!neighborhood) setShowNeighborhoodDropdown(true);
                }}
                disabled={neighborhoods.length === 0}
                className={inputClass}
              />
              {showNeighborhoodDropdown && filteredNeighborhoods.length > 0 && (
                <div className="absolute z-20 mt-1 w-full max-h-40 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg">
                  {filteredNeighborhoods.map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => {
                        setNeighborhood(n);
                        setNeighborhoodSearch('');
                        setShowNeighborhoodDropdown(false);
                      }}
                      className="w-full text-left px-3.5 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors first:rounded-t-xl last:rounded-b-xl"
                    >
                      {n}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!isFormValid || isSubmitting}
          className="w-full mt-8 bg-blue-500 text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
        >
          {isSubmitting ? 'Creando cuenta...' : 'Creá tu cuenta'}
        </button>

        {error && (
          <p className="text-red-500 text-xs text-center mt-3">{error}</p>
        )}

        <button
          onClick={handleDemoLogin}
          className="w-full mt-3 py-3.5 rounded-xl font-semibold text-sm text-blue-600 hover:bg-blue-50 transition-all"
        >
          Entrar como demo (ver datos de ejemplo)
        </button>
      </div>
    </div>
  );
}
