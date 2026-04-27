'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAppStore, type User } from '@/store/app-store';
import { renderStars, formatBudget } from './home-screen';
import { getProvinceName } from '@/lib/argentina-locations';

export function ProfessionalProfileScreen() {
  const { selectedUserProfile: pro, currentUser, goBack, setView, setSelectedThread } = useAppStore();
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    if (!pro) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/users/${pro.id}`);
      if (res.ok) {
        const user = await res.json();
        setReviews(user.ratingsReceived || []);
      }
    } catch (err) { console.error(err); }
    setIsLoading(false);
  }, [pro]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const handleContact = async () => {
    if (!pro || !currentUser) return;
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participant1Id: currentUser.id,
          participant2Id: pro.id,
        }),
      });
      if (res.ok) {
        const thread = await res.json();
        setSelectedThread(thread);
        setView('chat');
      }
    } catch (err) { console.error(err); }
  };

  if (!pro) { goBack(); return null; }

  return (
    <div className="min-h-full bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b">
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={goBack} className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold flex-1 truncate">Perfil profesional</h1>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Profile Header with Hourly Rate */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white relative overflow-hidden">
          {/* Decorative */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="flex items-start gap-4 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold">{pro.name.charAt(0)}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold">{pro.name}</h2>
                {pro.dniVerified && (
                  <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-semibold flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25z" clipRule="evenodd" /></svg>
                    Verificado
                  </span>
                )}
              </div>
              <p className="text-blue-100 text-sm font-medium">{pro.profession || 'Profesional'}</p>
              <p className="text-blue-100/70 text-xs mt-0.5 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                {pro.city ? `${pro.city}${pro.province ? `, ${getProvinceName(pro.province)}` : ''}` : pro.province ? getProvinceName(pro.province) : pro.location || pro.neighborhood || 'Argentina'}
              </p>
              {pro.available && (
                <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full bg-green-500/20 text-green-100 text-[10px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  Disponible ahora
                </span>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/20 relative z-10">
            <div className="text-center">
              <p className="text-xl font-bold">{pro.completedJobs}</p>
              <p className="text-[10px] text-blue-100">Trabajos</p>
            </div>
            <div className="text-center border-x border-white/20">
              <div className="flex items-center justify-center gap-1">
                <div className="flex">{renderStars(pro.ratingAvg)}</div>
              </div>
              <p className="text-[10px] text-blue-100 mt-0.5">{pro.ratingAvg} ({pro.ratingCount})</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold">{pro.experience || '-'}</p>
              <p className="text-[10px] text-blue-100">Experiencia</p>
            </div>
          </div>
        </div>

        {/* Hourly Rate - VERY PROMINENT TaskRabbit Style */}
        {pro.hourlyRate ? (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <circle cx="12" cy="12" r="10" /><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" /><path d="M12 18V6" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-green-600 font-semibold uppercase tracking-wide">Tarifa por hora</p>
                <p className="text-3xl font-bold text-green-700">{formatBudget(pro.hourlyRate)}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-green-600 font-medium">ARS</p>
              <p className="text-[10px] text-green-500">por hora de trabajo</p>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-center">
            <p className="text-sm text-muted-foreground">Este profesional a&#xFA;n no configur&#xF3; su tarifa por hora</p>
            <p className="text-xs text-muted-foreground mt-1">Contactalo para consultar precio</p>
          </div>
        )}

        {/* Location Card */}
        {(pro.city || pro.province || pro.workZone) && (
          <div className="bg-white border border-gray-100 rounded-2xl p-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Ubicación y zona de trabajo</h3>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
              </div>
              <div>
                <p className="text-sm font-semibold">{pro.city ? `${pro.city}` : ''}{pro.province ? `${pro.city ? ', ' : ''}${getProvinceName(pro.province)}` : ''}</p>
                {pro.workZone && <p className="text-[10px] text-muted-foreground">Zona: {pro.workZone}</p>}
                {pro.neighborhood && <p className="text-[10px] text-muted-foreground">Barrio: {pro.neighborhood}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Bio */}
        {pro.bio && (
          <div className="bg-white border border-gray-100 rounded-2xl p-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Sobre m&#xED;</h3>
            <p className="text-sm leading-relaxed">{pro.bio}</p>
          </div>
        )}

        {/* Skills */}
        {pro.skills && (
          <div className="bg-white border border-gray-100 rounded-2xl p-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Servicios y habilidades</h3>
            <div className="flex flex-wrap gap-1.5">
              {pro.skills.split(',').map((skill, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-blue-50 text-xs text-blue-700 font-medium">{skill.trim()}</span>
              ))}
            </div>
          </div>
        )}

        {/* DNI Verification Badge */}
        {pro.dniVerified && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-900">Identidad verificada</p>
                <p className="text-[10px] text-blue-600">DNI {pro.dniNumber?.replace(/(\d{2})(\d{3})(\d{4})/, '$1.$2.$3') || 'verificado'} &#x2014; Foto del DNI y selfie comprobados</p>
              </div>
            </div>
          </div>
        )}

        {/* Reviews */}
        <div>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            Rese&#xF1;as ({reviews.length})
            {reviews.length > 0 && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground font-normal">
                {renderStars(pro.ratingAvg)} {pro.ratingAvg}
              </span>
            )}
          </h3>
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2].map(i => <div key={i} className="bg-muted rounded-xl p-3 animate-pulse h-20" />)}
            </div>
          ) : reviews.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-6 text-center">
              <p className="text-sm text-muted-foreground">A&#xFA;n no tiene rese&#xF1;as</p>
            </div>
          ) : (
            <div className="space-y-2">
              {reviews.map((review: any) => (
                <div key={review.id} className="bg-white border border-gray-100 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-gray-600">{review.rater.name.charAt(0)}</span>
                    </div>
                    <span className="text-xs font-semibold">{review.rater.name}</span>
                    <div className="flex ml-auto">{renderStars(review.score)}</div>
                  </div>
                  {review.comment && <p className="text-xs text-muted-foreground leading-relaxed">{review.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Contact Button with price */}
      {currentUser && currentUser.id !== pro.id && (
        <div className="sticky bottom-0 bg-background border-t px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="flex items-center gap-3 mb-2">
            {pro.hourlyRate && (
              <div className="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" /><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" /><path d="M12 18V6" /></svg>
                <span className="text-sm font-bold text-green-700">{formatBudget(pro.hourlyRate)}/hs</span>
              </div>
            )}
            <span className="text-xs text-muted-foreground flex-1">Chate&#xE1; directamente sin intermediarios</span>
          </div>
          <button
            onClick={handleContact}
            className="w-full bg-blue-500 text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-blue-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-[0.98]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Contactar a {pro.name.split(' ')[0]}
          </button>
          <button
            onClick={() => {
              setView('create-quote');
            }}
            className="w-full mt-2 bg-white border-2 border-blue-500 text-blue-600 py-3 rounded-xl font-semibold text-sm hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
              <path d="M14 2v6h6" />
              <path d="M16 13H8" />
              <path d="M16 17H8" />
            </svg>
            Solicitar presupuesto
          </button>
        </div>
      )}
    </div>
  );
}
