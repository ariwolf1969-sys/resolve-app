'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/app-store';
import { SplashScreen, OnboardingScreen } from '@/components/app/splash-screen';
import { HomeScreen } from '@/components/app/home-screen';
import { NeedDetailScreen } from '@/components/app/need-detail-screen';
import { CreateNeedScreen } from '@/components/app/create-need-screen';
import { ChatListScreen, ChatScreen } from '@/components/app/chat-list-screen';
import { ProfileScreen } from '@/components/app/profile-screen';
import { ProfessionalProfileScreen } from '@/components/app/pro-profile-screen';
import { RegisterProfessionalScreen } from '@/components/app/register-pro-screen';
import { BottomNav } from '@/components/app/bottom-nav';
import { SearchOverlay } from '@/components/app/search-overlay';
import { UserRatingDialog } from '@/components/app/user-rating-dialog';
import { WebLandingScreen } from '@/components/app/web-landing-screen';
import { ProductsScreen } from '@/components/app/products-screen';
import { QuotesScreen } from '@/components/app/quotes-screen';
import { CreateQuoteScreen } from '@/components/app/create-quote-screen';
import { QuoteDetailScreen } from '@/components/app/quote-detail-screen';
import { PaymentsScreen } from '@/components/app/payments-screen';
import { CheckInScreen } from '@/components/app/check-in-screen';
import { DisputeScreen } from '@/components/app/dispute-screen';
import { AnimatePresence, motion } from 'framer-motion';
import { buildAffiliateUrl } from '@/lib/affiliate';

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

// Views that show the full-page layout (web landing, no max-width constraint)
const fullWidthViews = ['web-landing'];

// Views that show the bottom navigation
const navViews = ['home', 'chat-list', 'profile', 'search', 'products', 'quotes', 'payments'];

export default function AppContainer() {
  const { currentView } = useAppStore();
  const isFullWidth = fullWidthViews.includes(currentView);
  const showNav = navViews.includes(currentView);

  return (
    <div className={`flex flex-col ${isFullWidth ? 'min-h-screen' : 'h-[100dvh]'} ${isFullWidth ? '' : 'max-w-lg mx-auto'} bg-background relative overflow-hidden`}>
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            variants={isFullWidth ? {} : pageVariants}
            initial={isFullWidth ? undefined : 'initial'}
            animate={isFullWidth ? undefined : 'animate'}
            exit={isFullWidth ? undefined : 'exit'}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className={isFullWidth ? '' : 'absolute inset-0 overflow-y-auto'}
          >
            {currentView === 'splash' && <SplashScreen />}
            {currentView === 'onboarding' && <OnboardingScreen />}
            {currentView === 'web-landing' && <WebLandingScreen />}
            {currentView === 'home' && <HomeScreen />}
            {currentView === 'need-detail' && <NeedDetailScreen />}
            {currentView === 'create-need' && <CreateNeedScreen />}
            {currentView === 'chat-list' && <ChatListScreen />}
            {currentView === 'chat' && <ChatScreen />}
            {currentView === 'profile' && <ProfileScreen />}
            {currentView === 'edit-profile' && <EditProfileScreen />}
            {currentView === 'search' && <SearchOverlay />}
            {currentView === 'pro-profile' && <ProfessionalProfileScreen />}
            {currentView === 'register-pro' && <RegisterProfessionalScreen />}
            {currentView === 'products' && <ProductsScreen />}
            {currentView === 'product-detail' && <ProductDetailScreen />}
            {currentView === 'quotes' && <QuotesScreen />}
            {currentView === 'create-quote' && <CreateQuoteScreen />}
            {currentView === 'quote-detail' && <QuoteDetailScreen />}
            {currentView === 'payments' && <PaymentsScreen />}
            {currentView === 'check-in' && <CheckInScreen />}
            {currentView === 'dispute' && <DisputeScreen />}
          </motion.div>
        </AnimatePresence>
      </div>

      {showNav && (
        <div className="border-t bg-background pb-[env(safe-area-inset-bottom)]">
          <BottomNav />
        </div>
      )}

      <UserRatingDialog />
    </div>
  );
}

function EditProfileScreen() {
  const { setView, currentUser, setCurrentUser } = useAppStore();
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone ? currentUser.phone.replace('+54', '') : '');
  const [neighborhood, setNeighborhood] = useState(currentUser?.neighborhood || currentUser?.city || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      const phoneDigits = phone.replace(/\D/g, '');
      const updates: Record<string, unknown> = { name: name.trim(), neighborhood: neighborhood.trim() || null, bio: bio.trim() || null };
      if (phoneDigits.length >= 8) {
        updates.phone = '+54' + phoneDigits;
      }
      const res = await fetch(`/api/users/${currentUser?.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setCurrentUser({ ...currentUser!, ...updatedUser });
        setSaved(true);
        setTimeout(() => setView('profile'), 800);
      }
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  const handlePhotoClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen no puede superar los 5MB');
        return;
      }
      setUploadingPhoto(true);
      const formData = new FormData();
      formData.append('avatar', file);
      try {
        const res = await fetch(`/api/users/${currentUser?.id}/avatar`, {
          method: 'POST',
          body: formData,
        });
        if (res.ok) {
          const data = await res.json();
          setCurrentUser({ ...currentUser!, avatar: data.avatarUrl });
        }
      } catch (err) {
        console.error(err);
      }
      setUploadingPhoto(false);
    };
    input.click();
  };

  return (
    <div className="min-h-full p-4">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => setView('profile')} className="p-2 -ml-2 rounded-lg hover:bg-muted">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold">Editar perfil</h1>
      </div>

      {/* Avatar upload */}
      <div className="flex items-center gap-4 mb-6">
        {currentUser?.avatar ? (
          <div className="w-20 h-20 rounded-2xl overflow-hidden relative">
            <img src={currentUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
            {uploadingPhoto && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" /></div>}
          </div>
        ) : (
          <div className="w-20 h-20 rounded-2xl bg-blue-100 flex items-center justify-center relative">
            <span className="text-3xl font-bold text-blue-500">{currentUser?.name?.charAt(0)}</span>
            {uploadingPhoto && <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center"><div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" /></div>}
          </div>
        )}
        <div>
          <button
            onClick={handlePhotoClick}
            disabled={uploadingPhoto}
            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors disabled:opacity-50"
          >
            {uploadingPhoto ? 'Subiendo...' : 'Cambiar foto'}
          </button>
          <p className="text-[10px] text-muted-foreground mt-1">JPG o PNG, máximo 5MB</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-1 block">Nombre</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 rounded-lg border bg-background text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-1 block">Teléfono</label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">+54</span>
            <input
              type="tel"
              inputMode="numeric"
              value={phone}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, '');
                if (digits.length <= 11) setPhone(digits);
              }}
              className="flex-1 p-3 rounded-lg border bg-background text-sm"
              placeholder="11 12345678"
            />
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">Código de área + número (sin 0 ni 15)</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-1 block">Barrio / Ciudad</label>
          <input type="text" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} className="w-full p-3 rounded-lg border bg-background text-sm" placeholder="Ej: Palermo" />
        </div>
        {currentUser?.profession && (
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1 block">Sobre mí</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full p-3 rounded-lg border bg-background text-sm min-h-[100px]" rows={3} placeholder="Contá sobre tu experiencia..." />
          </div>
        )}
      </div>

      {saved && (
        <p className="text-green-600 text-sm text-center mt-4 font-medium">Cambios guardados correctamente</p>
      )}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full mt-6 bg-blue-500 text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-600 disabled:opacity-50 transition-colors"
      >
        {saving ? 'Guardando...' : 'Guardar cambios'}
      </button>
    </div>
  );
}

function ProductDetailScreen() {
  const { goBack, selectedProduct } = useAppStore();
  if (!selectedProduct) {
    return (
      <div className="min-h-full p-4 flex flex-col items-center justify-center">
        <p className="text-muted-foreground">Producto no encontrado</p>
        <button onClick={() => goBack()} className="mt-4 text-blue-500 font-medium">Volver</button>
      </div>
    );
  }

  const discount = selectedProduct.originalPrice
    ? Math.round((1 - selectedProduct.price / selectedProduct.originalPrice) * 100)
    : 0;

  const sourceColors: Record<string, string> = {
    amazon: 'bg-blue-100 text-blue-700 border-blue-200',
    ebay: 'bg-blue-100 text-blue-700 border-blue-200',
    mercadolibre: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    aliexpress: 'bg-red-100 text-red-700 border-red-200',
    temu: 'bg-purple-100 text-purple-700 border-purple-200',
    shein: 'bg-pink-100 text-pink-700 border-pink-200',
  };

  const sourceLabels: Record<string, string> = {
    amazon: 'Amazon',
    ebay: 'eBay',
    mercadolibre: 'MercadoLibre',
    aliexpress: 'AliExpress',
    temu: 'Temu',
    shein: 'SHEIN',
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(price);

  return (
    <div className="min-h-full bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b px-4 py-3 flex items-center gap-3">
        <button onClick={() => goBack()} className="p-2 -ml-2 rounded-lg hover:bg-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold truncate flex-1">Detalle del producto</h1>
      </div>

      {/* Product Image */}
      <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
        {selectedProduct.imageUrl ? (
          <img
            src={selectedProduct.imageUrl}
            alt={selectedProduct.title}
            className="h-full w-full object-contain"
          />
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <rect x="2" y="2" width="20" height="20" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="m21 15-5-5L5 21" />
          </svg>
        )}
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-sm font-bold">
            -{discount}%
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-4">
        {/* Source Badge */}
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium px-2 py-1 rounded-full border ${sourceColors[selectedProduct.source] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
            {sourceLabels[selectedProduct.source] || selectedProduct.source}
          </span>
          {selectedProduct.brand && (
            <span className="text-xs text-muted-foreground">{selectedProduct.brand}</span>
          )}
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900">{selectedProduct.title}</h2>

        {/* Rating */}
        {selectedProduct.rating && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${star <= Math.round(selectedProduct.rating!) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {selectedProduct.rating} ({selectedProduct.reviewCount} reseñas)
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-end gap-3">
          <span className="text-3xl font-bold text-gray-900">{formatPrice(selectedProduct.price)}</span>
          {selectedProduct.originalPrice && (
            <span className="text-lg text-muted-foreground line-through">{formatPrice(selectedProduct.originalPrice)}</span>
          )}
        </div>

        {/* Description */}
        {selectedProduct.description && (
          <div className="pt-2 border-t">
            <h3 className="font-semibold mb-2">Descripción</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{selectedProduct.description}</p>
          </div>
        )}

        {/* Commission Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
            <span className="text-sm font-medium text-blue-700">Precio de afiliado</span>
          </div>
          <p className="text-xs text-blue-600">Este precio incluye una comisión de {selectedProduct.commission}% por la derivación de ventas.</p>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3 pt-2">
          <a
            href={buildAffiliateUrl(selectedProduct.sourceUrl, selectedProduct.source)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-blue-500 text-white py-3.5 rounded-xl font-semibold text-center flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" x2="21" y1="14" y2="3" />
            </svg>
            Ver en {sourceLabels[selectedProduct.source]}
          </a>
          <button className="w-full bg-gray-100 text-gray-700 py-3.5 rounded-xl font-medium hover:bg-gray-200 transition-colors">
            Compartir producto
          </button>
        </div>
      </div>
    </div>
  );
}
