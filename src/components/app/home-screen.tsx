'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAppStore, type Need, type Category, type User } from '@/store/app-store';
import { getProvinceName, isCaba } from '@/lib/argentina-locations';

// Legacy categories for needs (still supported)
const CATEGORIES: Category[] = [
  { id: 'all', name: 'Todas', icon: 'grid', color: '#6B7280' },
  { id: 'trabajo', name: 'Trabajo', icon: 'briefcase', color: '#F59E0B' },
  { id: 'servicios', name: 'Servicios', icon: 'wrench', color: '#3B82F6' },
  { id: 'mandados', name: 'Mandados', icon: 'package', color: '#10B981' },
  { id: 'ayuda', name: 'Ayuda', icon: 'hand', color: '#8B5CF6' },
  { id: 'ofertas', name: 'Ofertas', icon: 'megaphone', color: '#EF4444' },
];

function getCategoryName(id: string) {
  return CATEGORIES.find(c => c.id === id)?.name || id;
}

function getCategoryColor(id: string) {
  return CATEGORIES.find(c => c.id === id)?.color || '#6B7280';
}

function getCategoryIcon(icon: string) {
  switch (icon) {
    case 'briefcase':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="14" x="2" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      );
    case 'wrench':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      );
    case 'package':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
        </svg>
      );
    case 'hand':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" /><path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" /><path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" /><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
        </svg>
      );
    case 'megaphone':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 11 18-5v12L3 14v-3z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
        </svg>
      );
    default:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" />
        </svg>
      );
  }
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Ahora';
  if (diffMins < 60) return `Hace ${diffMins}min`;
  if (diffHours < 24) return `Hace ${diffHours}h`;
  if (diffDays < 7) return `Hace ${diffDays}d`;
  return date.toLocaleDateString('es-AR');
}

const PROFESSIONS: Category[] = [
  { id: 'electricista', name: 'Electricista', icon: '⚡', color: '#F59E0B' },
  { id: 'plomero', name: 'Plomero', icon: '🔧', color: '#3B82F6' },
  { id: 'albanil', name: 'Albañil', icon: '🧱', color: '#94A3B8' },
  { id: 'carpintero', name: 'Carpintero', icon: '🪚', color: '#92400E' },
  { id: 'mecanico', name: 'Mecánico', icon: '🔩', color: '#6B7280' },
  { id: 'pintor', name: 'Pintor', icon: '🎨', color: '#EC4899' },
  { id: 'gasista', name: 'Gasista', icon: '🔥', color: '#EF4444' },
  { id: 'aire-acondicionado', name: 'Aire acondicionado', icon: '❄️', color: '#06B6D4' },
  { id: 'computadoras', name: 'Computadoras', icon: '💻', color: '#8B5CF6' },
  { id: 'limpieza', name: 'Limpieza', icon: '✨', color: '#10B981' },
  { id: 'cerrajero', name: 'Cerrajero', icon: '🔑', color: '#3B82F6' },
  { id: 'jardinero', name: 'Jardinero', icon: '🌿', color: '#22C55E' },
  { id: 'cocinero', name: 'Chef', icon: '👨‍🍳', color: '#DC2626' },
  { id: 'ninniera', name: 'Niñera/o', icon: '👶', color: '#A855F7' },
  { id: 'profesor', name: 'Profesor', icon: '📚', color: '#2563EB' },
  { id: 'vidriero', name: 'Vidriero', icon: '🪟', color: '#60A5FA' },
  { id: 'mueblero', name: 'Mueblero', icon: '🛋️', color: '#78350F' },
  { id: 'electricista-auto', name: 'Electricista auto', icon: '🚗', color: '#D97706' },
  { id: 'peluquero', name: 'Peluquero', icon: '💇', color: '#EC4899' },
  { id: 'chofer', name: 'Chofer', icon: '🚐', color: '#6B7280' },
  { id: 'manicura', name: 'Manicura', icon: '💅', color: '#F43F5E' },
  { id: 'apoyo-escolar', name: 'Apoyo escolar', icon: '📖', color: '#8B5CF6' },
];

function formatBudget(amount: number): string {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(amount);
}

function renderStars(rating: number) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars.push(
        <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
        </svg>
      );
    } else {
      stars.push(
        <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-200" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
        </svg>
      );
    }
  }
  return stars;
}

const DEMO_ADS = [
  {
    id: 1,
    business: 'Ferretería El Rápido',
    tagline: 'Todo en ferretería y construcción. Envíos a todo el país.',
    gradient: 'from-blue-500 to-blue-700',
    icon: '🔧',
  },
  {
    id: 2,
    business: 'Casa de Sanitarios',
    tagline: 'Baños y cocinas de diseño. 20% off en mostrador.',
    gradient: 'from-purple-500 to-purple-700',
    icon: '🚿',
  },
  {
    id: 3,
    business: 'Pinturerías del Centro',
    tagline: 'Pinturas, revestimientos y herramientas. Presupuestos sin cargo.',
    gradient: 'from-green-500 to-green-700',
    icon: '🎨',
  },
  {
    id: 4,
    business: 'Depósito Don Juan',
    tagline: 'Materiales eléctricos y plomería. Mayorista y minorista.',
    gradient: 'from-red-500 to-red-700',
    icon: '⚡',
  },
];

function AdCarousel() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % DEMO_ADS.length);
    }, 4000);
  }, []);

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [startTimer]);

  const goTo = (index: number) => {
    setCurrent(index);
    startTimer();
  };

  return (
    <div className="mb-5">
      <div className="relative overflow-hidden rounded-2xl">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {DEMO_ADS.map((ad) => (
            <div key={ad.id} className="w-full shrink-0">
              <div className={`bg-gradient-to-br ${ad.gradient} rounded-2xl p-5 relative overflow-hidden`}>
                {/* Decorative circles */}
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full" />
                <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/10 rounded-full" />
                {/* Publicidad label */}
                <span className="absolute top-2 right-2 text-[8px] bg-white/20 text-white/80 px-2 py-0.5 rounded-full font-medium">
                  Publicidad
                </span>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{ad.icon}</span>
                    <h3 className="text-base font-bold text-white">{ad.business}</h3>
                  </div>
                  <p className="text-xs text-white/80 mb-3 leading-relaxed">{ad.tagline}</p>
                  <button className="bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors">
                    Ver más
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Dots indicator */}
        <div className="flex justify-center gap-1.5 mt-3">
          {DEMO_ADS.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${i === current ? 'bg-blue-500 w-5' : 'bg-gray-300'}`}
              aria-label={`Ir al anuncio ${i + 1}`}
            />
          ))}
        </div>
      </div>
      <button className="block mx-auto mt-2 text-[10px] text-muted-foreground hover:text-blue-500 transition-colors font-medium">
        Publicá tu negocio →
      </button>
    </div>
  );
}

export { formatBudget, renderStars, PROFESSIONS, getCategoryName, getCategoryColor, getCategoryIcon, timeAgo };

export function HomeScreen() {
  const {
    setView, setSelectedUserProfile,
    currentUser, setIsLoading,
  } = useAppStore();

  const [topProfessionals, setTopProfessionals] = useState<User[]>([]);
  const [isLoadingPro, setIsLoadingPro] = useState(true);

  const fetchTopProfessionals = useCallback(async () => {
    setIsLoadingPro(true);
    try {
      const res = await fetch('/api/professionals?sort=rating&limit=6');
      if (res.ok) {
        const data = await res.json();
        setTopProfessionals(data);
      }
    } catch (err) {
      console.error(err);
    }
    setIsLoadingPro(false);
  }, []);

  useEffect(() => {
    fetchTopProfessionals();
  }, [fetchTopProfessionals]);

  const handleSeed = async () => {
    setIsLoading(true);
    try {
      await fetch('/api/seed', { method: 'POST' });
      await fetchTopProfessionals();
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  };

  const handleProfessionClick = async (profession: string) => {
    setView('search');
    // The search overlay will handle the actual search
  };

  return (
    <div className="min-h-full pb-4">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 px-5 pt-10 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-white">Resolvé</h1>
            {currentUser ? (
              <p className="text-blue-100 text-xs mt-0.5">
                {currentUser.province && isCaba(currentUser.province)
                  ? (currentUser.city ? `${currentUser.city}, CABA` : 'CABA')
                  : currentUser.city && currentUser.province
                    ? `${currentUser.city}, ${getProvinceName(currentUser.province)}`
                    : currentUser.province
                      ? getProvinceName(currentUser.province)
                      : currentUser.neighborhood
                        ? currentUser.neighborhood
                        : 'Argentina'
                }
              </p>
            ) : (
              <p className="text-blue-100 text-xs mt-0.5">Encontrá profesionales en toda Argentina</p>
            )}
          </div>
          <button onClick={handleSeed} className="text-xs bg-white/20 text-white px-3 py-1.5 rounded-lg hover:bg-white/30 transition-colors">
            {topProfessionals.length === 0 ? 'Cargar demo' : 'Actualizar'}
          </button>
        </div>

        {/* Search Bar */}
        <button
          onClick={() => setView('search')}
          className="w-full flex items-center gap-3 px-4 py-3.5 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow active:scale-[0.99]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
          </svg>
          <span className="text-sm text-gray-400 flex-1 text-left">&#xBF;Qu&#xE9; profesional busc&#xE1;s?</span>
          <span className="text-[10px] bg-blue-100 text-blue-600 px-2.5 py-1 rounded-lg font-semibold">Buscar</span>
        </button>
      </div>

      <div className="px-4 mt-4">
        {/* Popular Categories */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-foreground">&#x1F525; Populares</h2>
            <button onClick={() => setView('search')} className="text-xs text-blue-500 font-semibold hover:underline">
              Ver todos
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {PROFESSIONS.slice(0, 9).map((p) => (
              <button
                key={p.id}
                onClick={() => handleProfessionClick(p.name)}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-gray-100 bg-white hover:shadow-md hover:border-blue-200 transition-all active:scale-95 shadow-sm"
              >
                <span className="text-2xl">{p.icon}</span>
                <span className="text-[10px] font-semibold text-center leading-tight text-foreground">{p.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 rounded-2xl p-4 mb-5">
          <h3 className="text-xs font-bold text-blue-800 mb-3">&#x1F4D6; &#xBF;C&#xF3;mo funciona?</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="w-10 h-10 bg-blue-200 rounded-xl flex items-center justify-center mx-auto mb-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
              </div>
              <p className="text-[9px] font-semibold text-blue-800">Busc&#xE1;</p>
              <p className="text-[8px] text-blue-600">Encontr&#xE1; el profesional que necesit&#xE1;s en tu zona</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-blue-200 rounded-xl flex items-center justify-center mx-auto mb-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
              </div>
              <p className="text-[9px] font-semibold text-blue-800">Contact&#xE1;</p>
              <p className="text-[8px] text-blue-600">Chate&#xE1; directamente con ellos</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-blue-200 rounded-xl flex items-center justify-center mx-auto mb-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
              </div>
              <p className="text-[9px] font-semibold text-blue-800">Resolv&#xE9;</p>
              <p className="text-[8px] text-blue-600">&#xA1;Trabajo hecho!</p>
            </div>
          </div>
        </div>

        {/* Ad Carousel */}
        <AdCarousel />

        {/* Top Rated Professionals */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-foreground">&#x2B50; Mejor calificados</h2>
            <span className="text-[10px] text-muted-foreground">con precios por hora</span>
          </div>

          {isLoadingPro ? (
            <div className="space-y-2.5">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-2xl p-4 animate-pulse shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-gray-200 rounded-2xl" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
                      <div className="h-3 bg-gray-100 rounded w-32" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : topProfessionals.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1">&#xA1;A&#xFAn; no hay profesionales!</h3>
              <p className="text-muted-foreground text-sm mb-4">Carg&#xE1; datos de ejemplo para ver c&#xF3;mo funciona</p>
              <button
                onClick={handleSeed}
                className="bg-blue-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors"
              >
                Cargar demo
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {topProfessionals.map((pro, index) => (
                <ProfessionalCard
                  key={pro.id}
                  pro={pro}
                  rank={index + 1}
                  onClick={() => {
                    setSelectedUserProfile(pro);
                    setView('pro-profile');
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* More Categories */}
        {PROFESSIONS.length > 9 && (
          <div className="mb-4">
            <h2 className="text-sm font-bold text-foreground mb-3">&#x1F50D; M&#xE1;s profesionales</h2>
            <div className="grid grid-cols-3 gap-2">
              {PROFESSIONS.slice(9).map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleProfessionClick(p.name)}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-gray-100 bg-white hover:shadow-md hover:border-blue-200 transition-all active:scale-95 shadow-sm"
                >
                  <span className="text-2xl">{p.icon}</span>
                  <span className="text-[10px] font-semibold text-center leading-tight text-foreground">{p.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Trust indicators */}
        <div className="bg-gray-50 rounded-2xl p-4 mt-2">
          <h3 className="text-xs font-bold text-foreground mb-2.5">&#x1F512; Confianza y seguridad</h3>
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] font-semibold">DNI verificado</p>
                <p className="text-[10px] text-muted-foreground">Todos los profesionales verificados con documento</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-600" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] font-semibold">Calificaciones reales</p>
                <p className="text-[10px] text-muted-foreground">Rese&#xF1;as verificadas de clientes reales</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm.53 5.47a.75.75 0 01-1.06 0l-3 3a.75.75 0 101.06 1.06l1.72-1.72v5.69a.75.75 0 011.5 0v-5.69l1.72 1.72a.75.75 0 101.06-1.06l-3-3z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] font-semibold">Precios transparentes</p>
                <p className="text-[10px] text-muted-foreground">Cada profesional muestra su tarifa por hora</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
              </div>
              <div>
                <p className="text-[11px] font-semibold">Cobertura nacional</p>
                <p className="text-[10px] text-muted-foreground">Profesionales en todas las provincias de Argentina</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfessionalCard({ pro, rank, onClick }: { pro: User; rank?: number; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full text-left bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-md transition-all shadow-sm">
      <div className="flex items-start gap-3">
        {/* Avatar with rank */}
        <div className="relative shrink-0">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-md">
            <span className="text-xl font-bold text-white">{pro.name.charAt(0)}</span>
          </div>
          {pro.available && (
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
          )}
          {rank && rank <= 3 && (
            <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
              <span className="text-[8px] font-bold text-yellow-900">{rank}</span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* Name + badges */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="font-bold text-sm">{pro.name}</h3>
            {pro.dniVerified && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-600 text-[9px] font-semibold">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25z" clipRule="evenodd" /></svg>
                Verificado
              </span>
            )}
          </div>

          {/* Profession */}
          <p className="text-xs font-medium text-blue-600 mt-0.5">{pro.profession}</p>

          {/* Rating + jobs */}
          <div className="flex items-center gap-3 mt-1.5">
            <div className="flex items-center gap-1">
              <div className="flex">{renderStars(pro.ratingAvg)}</div>
              <span className="text-[10px] text-muted-foreground">{pro.ratingAvg} ({pro.ratingCount})</span>
            </div>
            <span className="text-[10px] text-muted-foreground">{pro.completedJobs} trabajos</span>
          </div>
        </div>

        {/* Hourly Rate - PROMINENT like TaskRabbit */}
        <div className="text-right shrink-0">
          <div className="bg-green-50 border border-green-200 rounded-xl px-3 py-2">
            <p className="text-xs font-bold text-green-700">{pro.hourlyRate ? formatBudget(pro.hourlyRate) : 'Consultar'}</p>
            <p className="text-[9px] text-green-600 font-medium">por hora</p>
          </div>
        </div>
      </div>

      {/* Location + Skills preview */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
          {pro.city && pro.province
            ? `${pro.city}, ${getProvinceName(pro.province)}`
            : pro.city
              ? pro.city
              : pro.province
                ? getProvinceName(pro.province)
                : pro.neighborhood
                  ? pro.neighborhood
                  : 'Sin ubicación'
          }
          {pro.experience && <span className="ml-1.5">· {pro.experience}</span>}
        </span>
        {pro.skills && (
          <div className="flex gap-0.5">
            {pro.skills.split(',').slice(0, 3).map((skill, i) => (
              <span key={i} className="px-1.5 py-0.5 rounded bg-gray-50 text-[8px] text-muted-foreground font-medium">{skill.trim()}</span>
            ))}
          </div>
        )}
      </div>
    </button>
  );
}
