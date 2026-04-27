'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAppStore, type User } from '@/store/app-store';
import { formatBudget, renderStars } from './home-screen';
import { PROFESSIONS } from './home-screen';
import { ARGENTINA_PROVINCES, getCitiesByProvince, getWorkZonesByProvince, getProvinceName } from '@/lib/argentina-locations';

export function SearchOverlay() {
  const {
    setView,
    setSelectedUserProfile,
    setSelectedNeed,
    selectedProvince,
    setSelectedProvince,
    selectedCity,
    setSelectedCity,
    selectedWorkZone,
    setSelectedWorkZone,
  } = useAppStore();
  const [query, setQuery] = useState('');
  const [professionals, setProfessionals] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'price_asc' | 'price_desc' | 'distance'>('rating');

  const clearLocationFilters = () => {
    setSelectedProvince('');
    setSelectedCity('');
    setSelectedWorkZone('');
  };

  const searchProfessionals = useCallback(async (q: string) => {
    if (q.length < 2) { setProfessionals([]); return; }
    setIsSearching(true);
    try {
      const params = new URLSearchParams();
      params.set('q', q);
      params.set('sort', sortBy);
      params.set('limit', '50');
      if (selectedProvince) params.set('province', selectedProvince);
      if (selectedCity) params.set('city', selectedCity);
      if (selectedWorkZone) params.set('workZone', selectedWorkZone);
      const res = await fetch(`/api/professionals?${params}`);
      if (res.ok) setProfessionals(await res.json());
    } catch (err) { console.error(err); }
    setIsSearching(false);
  }, [sortBy, selectedProvince, selectedCity, selectedWorkZone]);

  useEffect(() => {
    if (query.length >= 2) searchProfessionals(query);
    else setProfessionals([]);
  }, [query, sortBy, searchProfessionals]);

  const handleProfessionClick = async (profession: string) => {
    setQuery(profession);
  };

  const sortedProfessionals = [...professionals];
  if (sortBy === 'price_asc') {
    sortedProfessionals.sort((a, b) => (a.hourlyRate || 0) - (b.hourlyRate || 0));
  } else if (sortBy === 'price_desc') {
    sortedProfessionals.sort((a, b) => (b.hourlyRate || 0) - (a.hourlyRate || 0));
  }

  return (
    <div className="min-h-full bg-background">
      {/* Search Bar */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-lg border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => setView('home')} className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <div className="flex-1 relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              placeholder="Ej: electricistas, plomeros, albañiles..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              autoFocus
            />
          </div>
        </div>

        {/* Sort options - only show when there are results */}
        {professionals.length > 0 && (
          <div className="flex gap-1.5 mt-3 overflow-x-auto pb-1">
            {[
              { key: 'rating' as const, label: '⭐ Mejor valorados' },
              { key: 'price_asc' as const, label: '💰 Menor precio' },
              { key: 'price_desc' as const, label: '💎 Mayor precio' },
            ].map(opt => (
              <button
                key={opt.key}
                onClick={() => setSortBy(opt.key)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold whitespace-nowrap transition-all ${
                  sortBy === opt.key
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'bg-muted text-muted-foreground hover:bg-gray-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {/* Location Filter - Always visible */}
        <div className="mt-3 bg-white border border-gray-200 rounded-xl p-3 space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
            <span className="text-xs font-semibold text-foreground">Filtrar por ubicación</span>
            {(selectedProvince || selectedCity || selectedWorkZone) && (
              <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-600 text-[9px]">Activo</span>
            )}
          </div>
          {/* Province select */}
          <select
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
            className="w-full p-2.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            <option value="">Todas las provincias</option>
            {ARGENTINA_PROVINCES.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          {/* City select - always visible when province selected */}
          {selectedProvince && (
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="">
                {selectedProvince === 'caba' ? 'Todos los barrios' : 'Todas las ciudades'}
              </option>
              {getCitiesByProvince(selectedProvince).map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          )}

          {/* Work zone buttons for CABA and Buenos Aires */}
          {selectedProvince && ['caba', 'buenos_aires'].includes(selectedProvince) && (
            <div className="flex gap-1.5 flex-wrap">
              {getWorkZonesByProvince(selectedProvince).map(zone => (
                <button
                  key={zone}
                  onClick={() => setSelectedWorkZone(selectedWorkZone === zone ? '' : zone)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all ${
                    selectedWorkZone === zone
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'bg-muted text-muted-foreground hover:bg-gray-200'
                  }`}
                >
                  {zone}
                </button>
              ))}
            </div>
          )}

          {/* Clear filter button */}
          {(selectedProvince || selectedCity || selectedWorkZone) && (
            <button onClick={clearLocationFilters} className="text-xs text-red-500 font-medium hover:text-red-600 transition-colors">
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      <div className="px-4 py-3">
        {query.length < 2 ? (
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Busc&#xE1; por profesi&#xF3;n</h3>
            <div className="grid grid-cols-3 gap-2">
              {PROFESSIONS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleProfessionClick(p.name)}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-gray-100 bg-white hover:shadow-sm hover:border-blue-200 transition-all active:scale-95"
                >
                  <span className="text-2xl">{p.icon}</span>
                  <span className="text-[10px] font-medium text-center leading-tight">{p.name}</span>
                </button>
              ))}
            </div>
          </div>
        ) : isSearching ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : sortedProfessionals.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            </div>
            <h3 className="font-semibold mb-1">Sin resultados</h3>
            <p className="text-sm text-muted-foreground">No encontramos profesionales para &quot;{query}&quot;</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-muted-foreground">{sortedProfessionals.length} profesionales encontrados</p>
              <p className="text-[10px] text-green-600 font-semibold">&#x1F4B0; Precios por hora visibles</p>
            </div>
            <div className="space-y-2.5">
              {sortedProfessionals.map(pro => (
                <ProfessionalCard key={pro.id} pro={pro} onClick={() => { setSelectedUserProfile(pro); setView('pro-profile'); }} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ProfessionalCard({ pro, onClick }: { pro: User; onClick: () => void }) {
  const locationLabel = pro.province
    ? pro.city
      ? `${pro.city}, ${getProvinceName(pro.province)}`
      : getProvinceName(pro.province)
    : pro.neighborhood || 'Sin ubicación';

  return (
    <button onClick={onClick} className="w-full text-left bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-md transition-all shadow-sm">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-md">
            <span className="text-xl font-bold text-white">{pro.name.charAt(0)}</span>
          </div>
          {pro.available && (
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
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

          {/* Location */}
          <div className="flex items-center gap-3 mt-2 pt-2 border-t border-gray-50">
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
              {locationLabel}
            </span>
            {pro.experience && (
              <span className="text-[10px] text-muted-foreground">{pro.experience}</span>
            )}
          </div>
        </div>

        {/* Hourly Rate - PROMINENT TaskRabbit style */}
        <div className="text-right shrink-0">
          <div className="bg-green-50 border border-green-200 rounded-xl px-3 py-2">
            <p className="text-sm font-bold text-green-700">{pro.hourlyRate ? formatBudget(pro.hourlyRate) : 'Consultar'}</p>
            <p className="text-[9px] text-green-600 font-medium">por hora</p>
          </div>
        </div>
      </div>

      {/* Skills preview */}
      {pro.skills && (
        <div className="flex flex-wrap gap-1 mt-3 pt-2 border-t border-gray-50">
          {pro.skills.split(',').slice(0, 4).map((skill, i) => (
            <span key={i} className="px-2 py-0.5 rounded-md bg-gray-50 text-[9px] text-muted-foreground font-medium">{skill.trim()}</span>
          ))}
          {pro.skills.split(',').length > 4 && (
            <span className="px-2 py-0.5 rounded-md bg-blue-50 text-[9px] text-blue-500 font-medium">+{pro.skills.split(',').length - 4}</span>
          )}
        </div>
      )}
    </button>
  );
}
