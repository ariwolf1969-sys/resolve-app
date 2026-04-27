'use client';

import { useAppStore } from '@/store/app-store';
import type { AffiliateProduct } from '@/store/app-store';
import {
  Shield,
  MapPin,
  Camera,
  Scale,
  ArrowRight,
  Store,
  ChevronRight,
  CheckCircle,
  Lock,
  Users,
  Zap,
  Search,
  FileText,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { PROFESSIONS } from '@/components/app/home-screen';
import { useState, useEffect, useRef, useCallback } from 'react';

const SOURCE_BADGES = [
  { name: 'Amazon', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  { name: 'eBay', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { name: 'MercadoLibre', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  { name: 'AliExpress', color: 'bg-red-50 text-red-700 border-red-200' },
  { name: 'Temu', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { name: 'SHEIN', color: 'bg-pink-50 text-pink-700 border-pink-200' },
];

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

function getSourceLabel(source: string): string {
  const map: Record<string, string> = {
    mercadolibre: 'MercadoLibre',
    amazon: 'Amazon',
    aliexpress: 'AliExpress',
    temu: 'Temu',
    shein: 'SHEIN',
    ebay: 'eBay',
  };
  return map[source] || source;
}

function ProductCard({ product, setView, setSelectedProduct }: {
  product: AffiliateProduct;
  setView: (v: any) => void;
  setSelectedProduct: (p: AffiliateProduct) => void;
}) {
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <div className="shrink-0 w-[180px] sm:w-[195px] lg:w-[210px] group">
      <Card className="overflow-hidden rounded-xl border border-gray-200/80 p-0 transition-all hover:shadow-lg">
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-50">
              <Store className="h-8 w-8 text-gray-300" />
            </div>
          )}
          <Badge
            variant="outline"
            className={`absolute left-2 top-2 text-[9px] font-medium ${getSourceBadgeColor(getSourceLabel(product.source))} border`}
          >
            {getSourceLabel(product.source)}
          </Badge>
          {discount > 0 && (
            <Badge className="absolute right-2 top-2 bg-red-500 text-white text-[9px]">
              -{discount}%
            </Badge>
          )}
        </div>
        <CardContent className="p-3">
          <h3 className="text-xs font-semibold leading-snug text-gray-900 line-clamp-2 min-h-[2rem]">
            {product.title}
          </h3>
          {product.rating && (
            <div className="mt-1 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 fill-amber-400 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
              </svg>
              <span className="text-[10px] font-medium text-gray-700">{product.rating.toFixed(1)}</span>
              {product.reviewCount > 0 && (
                <span className="text-[10px] text-gray-400">({product.reviewCount})</span>
              )}
            </div>
          )}
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className="text-sm font-bold text-blue-600">{formatPrice(product.price)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[10px] text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
          <Button
            className="mt-2 h-7 w-full bg-blue-500 text-[10px] font-semibold text-white hover:bg-blue-600 px-0"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProduct(product);
              setView('product-detail');
            }}
          >
            Ver oferta
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export function WebLandingScreen() {
  const { setView, setSelectedProduct } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [products, setProducts] = useState<AffiliateProduct[]>([]);
  const [productsLoaded, setProductsLoaded] = useState(false);

  useEffect(() => {
    async function loadProducts() {
      try {
        // Try to fetch real products from the database
        const res = await fetch('/api/products?pageSize=20&featured=true');
        if (res.ok) {
          const data = await res.json();
          if (data.data && data.data.length > 0) {
            setProducts(data.data);
            setProductsLoaded(true);
            return;
          }
        }
        // If no featured products, try any active products
        const res2 = await fetch('/api/products?pageSize=20');
        if (res2.ok) {
          const data2 = await res2.json();
          if (data2.data && data2.data.length > 0) {
            setProducts(data2.data);
            setProductsLoaded(true);
            return;
          }
        }
        // Trigger a sync in the background
        fetch('/api/products/sync', { method: 'GET' }).catch(() => {});
        setProductsLoaded(false);
      } catch (err) {
        console.error('Error loading products:', err);
        setProductsLoaded(false);
      }
    }
    loadProducts();
  }, []);

  // Row 1: first half, Row 2: second half (reversed for visual variety)
  const mid = Math.ceil(products.length / 2);
  const row1Products = products.slice(0, mid);
  const row2Products = products.slice(mid).reverse();

  // If no products yet, use placeholder message
  const showProducts = products.length > 0;

  return (
    <div className="min-h-screen bg-white">
      {/* ──────────────── 1. HERO SECTION ──────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-500 to-cyan-500">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-blue-400/30 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full bg-cyan-400/30 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 sm:pb-24 sm:pt-28 lg:px-8 lg:pb-32 lg:pt-36">
          {/* Nav bar */}
          <nav className="mb-10 sm:mb-20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Resolvé</span>
              </div>

              {/* Desktop auth buttons */}
              <div className="hidden sm:flex items-center gap-3 ml-auto">
                <button
                  onClick={() => setView('onboarding')}
                  className="px-4 py-2 text-sm font-medium text-white/90 hover:text-white transition-colors"
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

              {/* Mobile auth buttons */}
              <div className="flex items-center gap-2 sm:hidden">
                <button
                  onClick={() => setView('onboarding')}
                  className="px-3 py-2 text-xs font-medium text-white/90 hover:text-white bg-white/10 backdrop-blur-sm rounded-lg transition-colors"
                >
                  Ingresar
                </button>
                <button
                  onClick={() => setView('onboarding')}
                  className="px-3 py-2 text-xs font-semibold text-blue-600 bg-white rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Creá tu cuenta
                </button>
              </div>
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

      {/* ──────────────── 2. SERVICE CATEGORIES (OFICIOS) ──────────────── */}
      <section className="bg-white py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
              Profesionales en tu zona
            </h2>
            <p className="mt-3 text-base text-gray-500 sm:text-lg">
              Encontrá el profesional ideal para lo que necesitás
            </p>
          </div>
          <div className="mt-8 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 sm:gap-4">
            {PROFESSIONS.map((p) => (
              <button
                key={p.id}
                onClick={() => setView('home')}
                className="flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl border border-gray-100 bg-white hover:shadow-md hover:border-blue-200 active:bg-blue-50 transition-all"
              >
                <span className="text-2xl sm:text-3xl">{p.icon}</span>
                <span className="text-[11px] sm:text-xs font-semibold text-center leading-tight text-gray-700">{p.name}</span>
              </button>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button
              variant="ghost"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              onClick={() => setView('home')}
            >
              Ver todos los profesionales
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* ──────────────── 3. HOW IT WORKS ──────────────── */}
      <section className="bg-gray-50 py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
              ¿Cómo funciona?
            </h2>
            <p className="mt-3 text-base text-gray-500 sm:text-lg">
              En tres simples pasos conectamos tu necesidad con el profesional ideal
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:mt-12 sm:gap-8">
            <div className="group relative rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200/60 transition-all hover:shadow-md sm:p-8">
              <div className="mb-5 flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-600">1</div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-500 transition-colors group-hover:bg-blue-500 group-hover:text-white">
                  <Search className="h-5 w-5" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Buscá</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">Encontrá al profesional ideal cerca tuyo. Filtrá por profesión, zona y calificación.</p>
            </div>

            <div className="group relative rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200/60 transition-all hover:shadow-md sm:p-8">
              <div className="mb-5 flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-600">2</div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-500 transition-colors group-hover:bg-blue-500 group-hover:text-white">
                  <FileText className="h-5 w-5" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Presupuestá</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">Recibí presupuestos detallados. Aceptá el que mejor se adapte a tu necesidad.</p>
            </div>

            <div className="group relative rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200/60 transition-all hover:shadow-md sm:p-8 sm:col-span-2 lg:col-span-1">
              <div className="mb-5 flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-600">3</div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-500 transition-colors group-hover:bg-blue-500 group-hover:text-white">
                  <Lock className="h-5 w-5" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Pagá seguro</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">El pago se retiene de forma segura. Confirmá la llegada y liberá cuando el trabajo esté listo.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────── 4. TRUST & SECURITY ──────────────── */}
      <section className="bg-white py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">Confianza y seguridad</h2>
            <p className="mt-3 text-base text-gray-500 sm:text-lg">Tu dinero y tus datos están protegidos en cada transacción</p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5 sm:mt-12 sm:gap-6">
            {[
              { icon: Shield, title: 'Pagos 100% seguros', desc: 'Dinero protegido hasta que confirmes que todo está bien' },
              { icon: Lock, title: 'Escrow digital', desc: 'El dinero se retiene hasta que confirmes que el trabajo fue realizado correctamente' },
              { icon: MapPin, title: 'Verificación GPS', desc: 'El profesional registra su llegada con ubicación en tiempo real' },
              { icon: Camera, title: 'Evidencia fotográfica', desc: 'Fotos con marca de tiempo como comprobante del trabajo realizado' },
              { icon: Scale, title: 'Sistema de disputas', desc: 'Si hay algún problema, nuestro equipo de mediación resuelve la situación' },
            ].map((item, idx) => (
              <div key={idx} className="group rounded-2xl bg-white p-5 sm:p-6 text-center shadow-sm ring-1 ring-gray-200/60 transition-all hover:shadow-md sm:text-left">
                <div className="mx-auto flex h-12 w-12 sm:mx-0 items-center justify-center rounded-xl bg-blue-50 transition-colors group-hover:bg-blue-500">
                  <item.icon className="h-6 w-6 text-blue-500 transition-colors group-hover:text-white" />
                </div>
                <h3 className="mt-4 text-sm font-bold text-gray-900 sm:text-base">{item.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-gray-500 sm:text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────── 5. PRODUCTS CAROUSEL ──────────────── */}
      <section className="bg-gray-50 py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">Productos recomendados</h2>
            <p className="mt-3 text-base text-gray-500 sm:text-lg">Los mejores productos de las principales tiendas online</p>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {SOURCE_BADGES.map((badge) => (
              <Badge key={badge.name} variant="outline" className={`text-xs ${badge.color} border`}>
                {badge.name}
              </Badge>
            ))}
          </div>

          {showProducts ? (
            <>
              {/* Row 1 */}
              <div className="mt-8 overflow-hidden">
                <div className="flex gap-4 animate-scroll">
                  {[...row1Products, ...row1Products].map((product, i) => (
                    <ProductCard key={`${product.id}-${i}`} product={product} setView={setView} setSelectedProduct={setSelectedProduct} />
                  ))}
                </div>
              </div>

              {/* Row 2 */}
              <div className="mt-4 overflow-hidden">
                <div className="flex gap-4 animate-scroll-reverse">
                  {[...row2Products, ...row2Products].map((product, i) => (
                    <ProductCard key={`${product.id}-r-${i}`} product={product} setView={setView} setSelectedProduct={setSelectedProduct} />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="mt-8 text-center py-12 bg-white rounded-2xl border border-gray-100">
              <Store className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Cargando productos de MercadoLibre...</p>
              <p className="text-gray-400 text-xs mt-1">Los productos aparecerán automáticamente</p>
            </div>
          )}

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

      {/* ──────────────── 6. DOWNLOAD APP ──────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 py-14 sm:py-16 lg:py-20">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-cyan-500/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="text-center lg:text-left">
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">Llevá Resolvé en tu celular</h2>
              <p className="mt-4 text-base leading-relaxed text-gray-400 sm:text-lg">
                Descargá la app y encontrá profesionales, compará presupuestos y realizá pagos seguros desde cualquier lugar. Disponible para iOS y Android.
              </p>
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

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <button className="flex h-12 items-center gap-3 rounded-xl bg-white px-6 transition-colors hover:bg-gray-100">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" /></svg>
                  <div className="text-left"><div className="text-[10px] leading-none text-gray-500">Disponible en</div><div className="text-sm font-semibold text-gray-900">App Store</div></div>
                </button>
                <button className="flex h-12 items-center gap-3 rounded-xl bg-white px-6 transition-colors hover:bg-gray-100">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.302 2.302a1 1 0 0 1 0 1.38l-2.302 2.302L15.395 13l2.303-2.492zM5.864 2.658L16.8 9.002l-2.302 2.302L5.864 2.658z" /></svg>
                  <div className="text-left"><div className="text-[10px] leading-none text-gray-500">Disponible en</div><div className="text-sm font-semibold text-gray-900">Google Play</div></div>
                </button>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="relative h-[520px] w-[260px] rounded-[2.5rem] border-4 border-gray-700 bg-gray-800 p-2 shadow-2xl sm:h-[580px] sm:w-[280px]">
                  <div className="absolute left-1/2 top-2 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-gray-900" />
                  <div className="h-full w-full overflow-hidden rounded-[2rem] bg-gradient-to-b from-blue-500 to-cyan-500">
                    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                        <Zap className="h-9 w-9 text-white" />
                      </div>
                      <h3 className="mt-4 text-xl font-bold text-white">Resolvé</h3>
                      <p className="mt-2 text-xs text-blue-100">Servicios &amp; Productos</p>
                      <div className="mt-8 w-full space-y-2.5">
                        {[
                          { icon: <Search className="h-4 w-4" />, label: 'Buscar servicio' },
                          { icon: <Store className="h-4 w-4" />, label: 'Ver productos' },
                          { icon: <Shield className="h-4 w-4" />, label: 'Pagos seguros' },
                        ].map((item) => (
                          <div key={item.label} className="flex items-center gap-3 rounded-xl bg-white/15 px-4 py-2.5 backdrop-blur-sm">
                            <div className="text-white">{item.icon}</div>
                            <span className="text-xs font-medium text-white">{item.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -inset-8 -z-10 rounded-full bg-blue-500/20 blur-3xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────── 7. FOOTER ──────────────── */}
      <footer className="bg-gray-900 pt-12 pb-8 sm:pt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500"><Zap className="h-4 w-4 text-white" /></div>
                <span className="text-lg font-bold text-white">Resolvé</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-gray-400">Conectamos lo que necesitás con quien puede hacerlo. Servicios y productos de confianza en toda la Argentina.</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Plataforma</h4>
              <ul className="mt-3 space-y-2.5">
                {['Cómo funciona', 'Profesionales', 'Productos', 'Seguridad'].map((link) => (
                  <li key={link}><button className="text-sm text-gray-400 transition-colors hover:text-blue-400">{link}</button></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Legal</h4>
              <ul className="mt-3 space-y-2.5">
                {['Términos y condiciones', 'Política de privacidad', 'Contacto', 'Preguntas frecuentes'].map((link) => (
                  <li key={link}><button className="text-sm text-gray-400 transition-colors hover:text-blue-400">{link}</button></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Seguinos</h4>
              <div className="mt-3 flex gap-3">
                {['Instagram', 'Facebook', 'Twitter'].map((social) => (
                  <button key={social} className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-800 text-gray-400 transition-colors hover:bg-blue-500 hover:text-white" aria-label={social}>
                    <span className="text-xs font-bold">{social[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-800 pt-6 text-center">
            <p className="text-xs text-gray-500">&copy; 2025 Resolvé. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      {/* ──────────────── FLOATING MOBILE CTA ──────────────── */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 sm:hidden w-[calc(100%-2rem)] max-w-sm">
        <button
          onClick={() => setView('onboarding')}
          className="w-full bg-blue-500 text-white py-3.5 rounded-2xl font-semibold text-sm shadow-lg shadow-blue-500/30 hover:bg-blue-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" />
          </svg>
          Creá tu cuenta gratis
        </button>
      </div>
      <div className="h-20 sm:hidden" />
    </div>
  );
}
