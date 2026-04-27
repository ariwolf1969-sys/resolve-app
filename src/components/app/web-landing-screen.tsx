'use client';

import { useAppStore } from '@/store/app-store';
import {
  Shield,
  MapPin,
  Camera,
  Scale,
  Star,
  ArrowRight,
  Store,
  ChevronRight,
  Play,
  CheckCircle,
  Lock,
  Users,
  Zap,
  Search,
  FileText,
  Smartphone,
  Instagram,
  Facebook,
  Twitter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

// ── Inline demo product data ──────────────────────────────────────
const DEMO_PRODUCTS = [
  {
    id: 'p1',
    title: 'Taladro percutor inalámbrico 20V',
    price: 89900,
    originalPrice: 129900,
    source: 'MercadoLibre',
    image: 'https://placehold.co/400x300/3b82f6/ffffff?text=Taladro+20V',
    rating: 4.7,
    reviews: 342,
  },
  {
    id: 'p2',
    title: 'Kit de herramientas profesionales 150 piezas',
    price: 45900,
    originalPrice: 59900,
    source: 'Amazon',
    image: 'https://placehold.co/400x300/2563eb/ffffff?text=Kit+Herramientas',
    rating: 4.5,
    reviews: 189,
  },
  {
    id: 'p3',
    title: 'Cámara de seguridad WiFi 1080p',
    price: 25900,
    originalPrice: 38900,
    source: 'AliExpress',
    image: 'https://placehold.co/400x300/f59e0b/ffffff?text=Cámara+WiFi',
    rating: 4.3,
    reviews: 567,
  },
  {
    id: 'p4',
    title: 'Lámpara LED de escritorio regulable',
    price: 15900,
    originalPrice: 21900,
    source: 'Temu',
    image: 'https://placehold.co/400x300/d97706/ffffff?text=Lámpara+LED',
    rating: 4.6,
    reviews: 213,
  },
];

const SOURCE_BADGES = [
  { name: 'Amazon', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  { name: 'eBay', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { name: 'MercadoLibre', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  { name: 'AliExpress', color: 'bg-red-50 text-red-700 border-red-200' },
  { name: 'Temu', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { name: 'SHEIN', color: 'bg-pink-50 text-pink-700 border-pink-200' },
];

// ── Helper ────────────────────────────────────────────────────────
function formatPrice(price: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(price);
}

function getSourceBadgeColor(source: string) {
  return SOURCE_BADGES.find((b) => b.name === source)?.color ?? 'bg-gray-100 text-gray-700 border-gray-200';
}

// ── Main Component ────────────────────────────────────────────────
export function WebLandingScreen() {
  const { setView } = useAppStore();

  return (
    <div className="min-h-screen bg-white">
      {/* ──────────────── 1. HERO SECTION ──────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-500 to-cyan-500">
        {/* Decorative blobs */}
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-blue-400/30 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full bg-cyan-400/30 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-6 sm:pb-24 sm:pt-28 lg:px-8 lg:pb-32 lg:pt-36">
          {/* Nav bar */}
          <nav className="mb-16 flex items-center justify-between sm:mb-20">
            <div className="flex items-center gap-4">
              {/* Login / Register buttons */}
              <div className="hidden items-center gap-3 sm:flex">
                <button
                  onClick={() => setView('onboarding')}
                  className="text-sm font-medium text-white/90 hover:text-white transition-colors"
                >
                  Iniciar sesión
                </button>
                <button
                  onClick={() => setView('onboarding')}
                  className="px-4 py-2 bg-white/20 backdrop-blur-sm text-sm font-semibold text-white rounded-lg hover:bg-white/30 transition-colors"
                >
                  Creá tu cuenta
                </button>
              </div>
              {/* Divider */}
              <div className="hidden sm:block h-6 w-px bg-white/30" />
              {/* Logo */}
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Resolvé</span>
              </div>
            </div>
            <div className="hidden items-center gap-6 sm:flex">
              <button onClick={() => setView('home')} className="text-sm font-medium text-white/90 hover:text-white transition-colors">
                Inicio
              </button>
              <button onClick={() => setView('products')} className="text-sm font-medium text-white/90 hover:text-white transition-colors">
                Productos
              </button>
              <button className="text-sm font-medium text-white/90 hover:text-white transition-colors">
                Seguridad
              </button>
            </div>
          </nav>

          {/* Hero content */}
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Resolvé
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-blue-100 sm:mt-6 sm:text-xl lg:text-2xl">
              La plataforma que conecta lo que necesitás con quien puede hacerlo
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-4">
              <Button
                size="lg"
                className="h-12 w-full bg-white px-8 text-base font-semibold text-blue-600 shadow-lg hover:bg-blue-50 sm:w-auto"
                onClick={() => setView('onboarding')}
              >
                Comenzar gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 w-full border-2 border-white/40 bg-transparent px-8 text-base font-semibold text-white hover:bg-white/10 sm:w-auto"
                onClick={() => setView('products')}
              >
                <Store className="mr-2 h-5 w-5" />
                Ver Productos
              </Button>
            </div>
          </div>

          {/* Stats bar */}
          <div className="mt-16 flex flex-col items-center justify-center gap-4 rounded-2xl bg-white/10 p-4 backdrop-blur-sm sm:flex-row sm:gap-8 sm:px-8 sm:py-5">
            <div className="flex items-center gap-2 text-white">
              <Users className="h-5 w-5 text-blue-200" />
              <span className="text-sm font-semibold sm:text-base">+500 Profesionales</span>
            </div>
            <div className="hidden h-4 w-px bg-white/30 sm:block" />
            <div className="flex items-center gap-2 text-white">
              <Zap className="h-5 w-5 text-blue-200" />
              <span className="text-sm font-semibold sm:text-base">+10.000 Servicios</span>
            </div>
            <div className="hidden h-4 w-px bg-white/30 sm:block" />
            <div className="flex items-center gap-2 text-white">
              <MapPin className="h-5 w-5 text-blue-200" />
              <span className="text-sm font-semibold sm:text-base">24 Provincias</span>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────── 2. HOW IT WORKS ──────────────── */}
      <section className="bg-gray-50 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              ¿Cómo funciona?
            </h2>
            <p className="mt-3 text-base text-gray-500 sm:text-lg">
              En tres simples pasos conectamos tu necesidad con el profesional ideal
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 sm:mt-16">
            {/* Step 1 */}
            <div className="group relative rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200/60 transition-all hover:shadow-md sm:p-8">
              <div className="mb-5 flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-600">
                  1
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-500 transition-colors group-hover:bg-blue-500 group-hover:text-white">
                  <Search className="h-5 w-5" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Buscá</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                Encontrá al profesional ideal cerca tuyo. Filtrá por profesión, zona y calificación.
              </p>
            </div>

            {/* Step 2 */}
            <div className="group relative rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200/60 transition-all hover:shadow-md sm:p-8">
              <div className="mb-5 flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-600">
                  2
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-500 transition-colors group-hover:bg-blue-500 group-hover:text-white">
                  <FileText className="h-5 w-5" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Presupuestá</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                Recibí presupuestos detallados. Aceptá el que mejor se adapte a tu necesidad.
              </p>
            </div>

            {/* Step 3 */}
            <div className="group relative rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200/60 transition-all hover:shadow-md sm:p-8 sm:col-span-2 lg:col-span-1">
              <div className="mb-5 flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-600">
                  3
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-500 transition-colors group-hover:bg-blue-500 group-hover:text-white">
                  <Lock className="h-5 w-5" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Pagá seguro</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                El pago se retiene de forma segura. Confirmá la llegada y liberá cuando el trabajo esté listo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────── 3. PRODUCTS SECTION ──────────────── */}
      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Productos recomendados
            </h2>
            <p className="mt-3 text-base text-gray-500 sm:text-lg">
              Los mejores productos de las principales tiendas online con los mejores precios
            </p>
          </div>

          {/* Source badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {SOURCE_BADGES.map((badge) => (
              <Badge
                key={badge.name}
                variant="outline"
                className={`text-xs ${badge.color} border`}
              >
                {badge.name}
              </Badge>
            ))}
          </div>

          {/* Product grid */}
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {DEMO_PRODUCTS.map((product) => (
              <Card
                key={product.id}
                className="group overflow-hidden rounded-2xl border border-gray-200/80 p-0 transition-all hover:shadow-lg hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <Badge
                    variant="outline"
                    className={`absolute left-3 top-3 text-[10px] font-medium ${getSourceBadgeColor(product.source)} border`}
                  >
                    {product.source}
                  </Badge>
                  {product.originalPrice && (
                    <Badge className="absolute right-3 top-3 bg-red-500 text-white text-[10px]">
                      {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                    </Badge>
                  )}
                </div>

                <CardContent className="p-4">
                  <h3 className="text-sm font-semibold leading-snug text-gray-900 line-clamp-2 min-h-[2.5rem]">
                    {product.title}
                  </h3>

                  {/* Rating */}
                  <div className="mt-2 flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-medium text-gray-700">{product.rating}</span>
                    <span className="text-xs text-gray-400">({product.reviews})</span>
                  </div>

                  {/* Price */}
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-lg font-bold text-blue-600">{formatPrice(product.price)}</span>
                    {product.originalPrice && (
                      <span className="text-xs text-gray-400 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>

                  <Button
                    className="mt-4 h-9 w-full bg-blue-500 text-xs font-semibold text-white hover:bg-blue-600"
                    onClick={() => setView('products')}
                  >
                    Ver oferta
                    <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-10 text-center">
            <Button
              variant="ghost"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              onClick={() => setView('products')}
            >
              Ver todos los productos
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* ──────────────── 4. TRUST & SECURITY ──────────────── */}
      <section className="group bg-gray-50 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 transition-colors group-hover:bg-blue-500">
              <Shield className="h-7 w-7 text-blue-500 transition-colors group-hover:text-white" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Pagos 100% seguros
            </h2>
            <p className="mt-3 text-base text-gray-500 sm:text-lg">
              Tu dinero está protegido en cada transacción
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 sm:mt-16">
            {/* Pillar 1 */}
            <div className="group rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-gray-200/60 transition-all hover:shadow-md sm:p-8">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 transition-colors group-hover:bg-blue-500">
                <Lock className="h-7 w-7 text-blue-500 transition-colors group-hover:text-white" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-gray-900">Escrow digital</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                El dinero se retiene hasta que confirmes que el trabajo fue realizado correctamente
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="group rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-gray-200/60 transition-all hover:shadow-md sm:p-8">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 transition-colors group-hover:bg-blue-500">
                <MapPin className="h-7 w-7 text-blue-500 transition-colors group-hover:text-white" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-gray-900">Verificación GPS</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                El profesional registra su llegada con ubicación en tiempo real
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="group rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-gray-200/60 transition-all hover:shadow-md sm:p-8">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 transition-colors group-hover:bg-blue-500">
                <Camera className="h-7 w-7 text-blue-500 transition-colors group-hover:text-white" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-gray-900">Evidencia fotográfica</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                Fotos con marca de tiempo como comprobante del trabajo realizado
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="group rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-gray-200/60 transition-all hover:shadow-md sm:p-8">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 transition-colors group-hover:bg-blue-500">
                <Scale className="h-7 w-7 text-blue-500 transition-colors group-hover:text-white" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-gray-900">Sistema de disputas</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                Si hay algún problema, nuestro equipo de mediación resuelve la situación
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────── 5. DOWNLOAD APP ──────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 py-16 sm:py-20 lg:py-24">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-cyan-500/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Text content */}
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Llevá Resolvé en tu celular
              </h2>
              <p className="mt-4 text-base leading-relaxed text-gray-400 sm:text-lg">
                Descargá la app y encontrá profesionales, compará presupuestos y realizá pagos seguros
                desde cualquier lugar. Disponible para iOS y Android.
              </p>

              {/* Feature bullets */}
              <ul className="mt-6 space-y-3 text-left sm:mt-8">
                {[
                  'Buscá servicios por categoría y ubicación',
                  'Chateá en tiempo real con profesionales',
                  'Pagá de forma segura con escrow digital',
                  'Seguí el estado de cada trabajo en vivo',
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-gray-300">
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Store buttons */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <button className="flex h-12 items-center gap-3 rounded-xl bg-white px-6 transition-colors hover:bg-gray-100">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  <div className="text-left">
                    <div className="text-[10px] leading-none text-gray-500">Disponible en</div>
                    <div className="text-sm font-semibold text-gray-900">App Store</div>
                  </div>
                </button>
                <button className="flex h-12 items-center gap-3 rounded-xl bg-white px-6 transition-colors hover:bg-gray-100">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.302 2.302a1 1 0 0 1 0 1.38l-2.302 2.302L15.395 13l2.303-2.492zM5.864 2.658L16.8 9.002l-2.302 2.302L5.864 2.658z" />
                  </svg>
                  <div className="text-left">
                    <div className="text-[10px] leading-none text-gray-500">Disponible en</div>
                    <div className="text-sm font-semibold text-gray-900">Google Play</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Phone mockup */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                {/* Phone frame */}
                <div className="relative h-[520px] w-[260px] rounded-[2.5rem] border-4 border-gray-700 bg-gray-800 p-2 shadow-2xl sm:h-[580px] sm:w-[280px]">
                  {/* Notch */}
                  <div className="absolute left-1/2 top-2 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-gray-900" />
                  {/* Screen */}
                  <div className="h-full w-full overflow-hidden rounded-[2rem] bg-gradient-to-b from-blue-500 to-cyan-500">
                    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                        <Zap className="h-9 w-9 text-white" />
                      </div>
                      <h3 className="mt-4 text-xl font-bold text-white">Resolvé</h3>
                      <p className="mt-2 text-xs text-blue-100">
                        Servicios &amp; Productos
                      </p>

                      {/* Mini feature cards */}
                      <div className="mt-8 w-full space-y-2.5">
                        {[
                          { icon: <Search className="h-4 w-4" />, label: 'Buscar servicio' },
                          { icon: <Store className="h-4 w-4" />, label: 'Ver productos' },
                          { icon: <Shield className="h-4 w-4" />, label: 'Pagos seguros' },
                        ].map((item) => (
                          <div
                            key={item.label}
                            className="flex items-center gap-3 rounded-xl bg-white/15 px-4 py-2.5 backdrop-blur-sm"
                          >
                            <div className="text-white">{item.icon}</div>
                            <span className="text-xs font-medium text-white">{item.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Glow behind phone */}
                <div className="absolute -inset-8 -z-10 rounded-full bg-blue-500/20 blur-3xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────── 6. FOOTER ──────────────── */}
      <footer className="bg-gray-900 pt-12 pb-8 sm:pt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-bold text-white">Resolvé</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-gray-400">
                Conectamos lo que necesitás con quien puede hacerlo. Servicios y productos de
                confianza en toda la Argentina.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-sm font-semibold text-white">Plataforma</h4>
              <ul className="mt-3 space-y-2.5">
                {['Cómo funciona', 'Profesionales', 'Productos', 'Seguridad'].map((link) => (
                  <li key={link}>
                    <button className="text-sm text-gray-400 transition-colors hover:text-blue-400">
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white">Legal</h4>
              <ul className="mt-3 space-y-2.5">
                {[
                  'Términos y condiciones',
                  'Política de privacidad',
                  'Contacto',
                  'Preguntas frecuentes',
                ].map((link) => (
                  <li key={link}>
                    <button className="text-sm text-gray-400 transition-colors hover:text-blue-400">
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4 className="text-sm font-semibold text-white">Seguinos</h4>
              <div className="mt-3 flex gap-3">
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-800 text-gray-400 transition-colors hover:bg-blue-500 hover:text-white"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </button>
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-800 text-gray-400 transition-colors hover:bg-blue-500 hover:text-white"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </button>
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-800 text-gray-400 transition-colors hover:bg-blue-500 hover:text-white"
                  aria-label="Twitter / X"
                >
                  <Twitter className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-12 border-t border-gray-800 pt-6 text-center">
            <p className="text-xs text-gray-500">
              &copy; 2025 Resolvé. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
