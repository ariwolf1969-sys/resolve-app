'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '@/store/app-store';
import { getProvinceName, isCaba } from '@/lib/argentina-locations';
import { formatBudget, getCategoryName, getCategoryColor, timeAgo } from './home-screen';

export function ProfileScreen() {
  const { currentUser, setView, setSelectedUserProfile, setSelectedNeed } = useAppStore();
  const [needs, setNeeds] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserNeeds = useCallback(async () => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/users/${currentUser.id}`);
      if (res.ok) {
        const user = await res.json();
        setNeeds(user.needs || []);
      }
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  }, [currentUser]);

  useEffect(() => {
    fetchUserNeeds();
  }, [fetchUserNeeds]);

  if (!currentUser) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <p className="text-muted-foreground">No hay usuario</p>
      </div>
    );
  }

  // Build location display
  const locationDisplay = (() => {
    // For CABA: show barrio (stored in city) + province name
    if (currentUser.province && isCaba(currentUser.province)) {
      if (currentUser.city) return `${currentUser.city}, CABA`;
      return 'CABA';
    }
    // For other provinces: neighborhood + city + province
    const parts: string[] = [];
    if (currentUser.neighborhood) parts.push(currentUser.neighborhood);
    if (currentUser.city) parts.push(currentUser.city);
    if (currentUser.province) parts.push(getProvinceName(currentUser.province));
    return parts.length > 0 ? parts.join(', ') : 'Argentina';
  })();

  return (
    <div className="min-h-full bg-background">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 px-5 pt-10 pb-8 rounded-b-[2rem]">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-white">Mi perfil</h1>
            <p className="text-blue-100 text-xs mt-0.5">
              {currentUser.profession ? 'Panel de profesional' : 'Gestioná tu cuenta'}
            </p>
          </div>
          <button
            onClick={() => setView('edit-profile')}
            className="px-3 py-1.5 bg-white/20 text-white rounded-lg text-xs font-medium hover:bg-white/30 transition-colors"
          >
            Editar
          </button>
        </div>

        <div className="flex items-center gap-4">
          {/* Avatar */}
          {currentUser.avatar ? (
            <div className="w-16 h-16 rounded-2xl overflow-hidden relative shadow-lg">
              <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
              {currentUser.dniVerified && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              )}
            </div>
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center relative">
              <span className="text-2xl font-bold text-white">{currentUser.name.charAt(0)}</span>
              {currentUser.dniVerified && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              )}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">{currentUser.name}</h2>
              {currentUser.verified && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <p className="text-blue-100 text-sm">{locationDisplay}</p>
          </div>
        </div>
      </div>

      {/* Stats - properly spaced */}
      <div className="px-5 -mt-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="grid grid-cols-4 divide-x divide-gray-100">
            <div className="text-center px-1">
              <p className="text-xl font-bold text-blue-500">{currentUser.completedJobs}</p>
              <p className="text-[9px] text-muted-foreground font-medium mt-0.5">Trabajos</p>
            </div>
            <div className="text-center px-1">
              <div className="flex items-center justify-center gap-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                </svg>
                <p className="text-xl font-bold">{currentUser.ratingAvg}</p>
              </div>
              <p className="text-[9px] text-muted-foreground font-medium mt-0.5">Puntaje</p>
            </div>
            <div className="text-center px-1">
              <p className="text-xl font-bold">{currentUser.ratingCount}</p>
              <p className="text-[9px] text-muted-foreground font-medium mt-0.5">Reseñas</p>
            </div>
            <div className="text-center px-1">
              <p className="text-base font-bold text-green-600">
                {currentUser.hourlyRate ? formatBudget(currentUser.hourlyRate) : '-'}
              </p>
              <p className="text-[9px] text-muted-foreground font-medium mt-0.5">Precio/hs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Professional info - only show if user is a professional */}
      {currentUser.profession && (
        <div className="px-5 mt-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-600 text-xs font-semibold">{currentUser.profession}</span>
              {currentUser.dniVerified && (
                <span className="px-2 py-0.5 rounded-lg bg-blue-100 text-blue-600 text-[10px] font-bold flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25z" clipRule="evenodd" /></svg>
                  DNI verificado
                </span>
              )}
              {currentUser.hourlyRate && (
                <span className="px-2 py-0.5 rounded-lg bg-green-100 text-green-600 text-[10px] font-bold">
                  {formatBudget(currentUser.hourlyRate)}/hs
                </span>
              )}
            </div>
            {currentUser.bio && (
              <>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Sobre mí</h3>
                <p className="text-sm leading-relaxed">{currentUser.bio}</p>
              </>
            )}
            {currentUser.skills && (
              <div className="flex flex-wrap gap-1 mt-2.5 pt-2.5 border-t border-gray-50">
                {currentUser.skills.split(',').map((skill, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md bg-blue-50 text-[9px] text-blue-600 font-medium">{skill.trim()}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Register as Professional - only for clients */}
      {!currentUser.profession && (
        <div className="px-5 mt-4">
          <button
            onClick={() => setView('register-pro')}
            className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl text-white hover:shadow-lg transition-all active:scale-[0.99]"
          >
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" x2="19" y1="8" y2="14" /><line x1="22" x2="16" y1="11" y2="11" />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold">Registrarme como profesional</p>
              <p className="text-[10px] text-blue-200">Aparecé en el buscador, poné tu precio por hora y conseguí más trabajo</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      )}

      {/* Edit Professional Profile (if already registered) */}
      {currentUser.profession && (
        <div className="px-5 mt-4">
          <button
            onClick={() => setView('register-pro')}
            className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl text-white hover:shadow-lg transition-all active:scale-[0.99]"
          >
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" /><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" /><path d="M12 18V6" />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold">Editar mi perfil profesional</p>
              <p className="text-[10px] text-green-200">
                {currentUser.hourlyRate
                  ? `Precio actual: ${formatBudget(currentUser.hourlyRate)}/hs`
                  : 'Configurá tu precio por hora'
                }
              </p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      )}

      {/* My Needs */}
      <div className="px-5 mt-4 pb-4">
        <h3 className="text-sm font-semibold mb-3">Mis publicaciones</h3>

        {isLoading ? (
          <div className="space-y-2">
            {[1, 2].map(i => (
              <div key={i} className="bg-muted rounded-xl p-3 animate-pulse h-16" />
            ))}
          </div>
        ) : needs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
            <p className="text-sm text-muted-foreground">Aún no publicaste nada</p>
            <button
              onClick={() => setView('create-need')}
              className="mt-3 text-blue-500 text-sm font-medium hover:underline"
            >
              Crear primera publicación
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {needs.map((need: any) => (
              <button
                key={need.id}
                onClick={async () => {
                  const res = await fetch(`/api/needs/${need.id}`);
                  if (res.ok) {
                    const fullNeed = await res.json();
                    setSelectedNeed(fullNeed);
                    setView('need-detail');
                  }
                }}
                className="w-full text-left bg-white border border-gray-100 rounded-xl p-3 hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className="px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase"
                        style={{ backgroundColor: getCategoryColor(need.category) + '18', color: getCategoryColor(need.category) }}
                      >
                        {getCategoryName(need.category)}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${
                        need.status === 'active' ? 'bg-green-100 text-green-700' :
                        need.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {need.status === 'active' ? 'Activa' : need.status === 'completed' ? 'Completada' : need.status}
                      </span>
                    </div>
                    <p className="text-sm font-medium truncate">{need.title}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{timeAgo(need.createdAt)}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="px-5 pb-6">
        <div className="space-y-2">
          <button onClick={() => setView('quotes')} className="w-full flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 hover:shadow-sm transition-all text-left">
            <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6" /><path d="M16 13H8" /><path d="M16 17H8" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium">Mis presupuestos</p>
              <p className="text-[10px] text-muted-foreground">Cotizaciones enviadas y recibidas</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground ml-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
          <button onClick={() => setView('payments')} className="w-full flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 hover:shadow-sm transition-all text-left">
            <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium">Mis pagos</p>
              <p className="text-[10px] text-muted-foreground">Historial y estado de pagos</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground ml-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
          <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 hover:shadow-sm transition-all text-left">
            <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium">Seguridad</p>
              <p className="text-[10px] text-muted-foreground">Verificación y configuración</p>
            </div>
          </button>
          <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 hover:shadow-sm transition-all text-left">
            <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium">Ayuda</p>
              <p className="text-[10px] text-muted-foreground">Preguntas frecuentes y soporte</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
