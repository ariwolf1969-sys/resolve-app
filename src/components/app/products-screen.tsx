'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useAppStore, type AffiliateProduct } from '@/store/app-store';
import {
  Search,
  ArrowLeft,
  Star,
  ExternalLink,
  Filter,
  ShoppingBag,
  ChevronRight,
  Heart,
  RefreshCw,
  WifiOff,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// ====== Source Configuration ======
const SOURCES = [
  { id: 'all', name: 'Todos', color: '#6B7280' },
  { id: 'mercadolibre', name: 'MercadoLibre', color: '#FFE600' },
  { id: 'Amazon', name: 'Amazon', color: '#FF9900' },
  { id: 'eBay', name: 'eBay', color: '#0064D2' },
  { id: 'AliExpress', name: 'AliExpress', color: '#FF4747' },
  { id: 'Temu', name: 'Temu', color: '#FB6F20' },
  { id: 'SHEIN', name: 'SHEIN', color: '#E11B1B' },
];

const CATEGORIES = [
  { id: 'all', name: 'Todos' },
  { id: 'celulares', name: 'Celulares' },
  { id: 'notebooks', name: 'Notebooks' },
  { id: 'televisores', name: 'Televisores' },
  { id: 'zapatillas', name: 'Zapatillas' },
  { id: 'auriculares', name: 'Auriculares' },
  { id: 'videojuegos', name: 'Videojuegos' },
  { id: 'electrodomesticos', name: 'Electrodomésticos' },
  { id: 'herramientas', name: 'Herramientas' },
  { id: 'ropa-deportiva', name: 'Ropa Deportiva' },
  { id: 'accesorios-tech', name: 'Accesorios Tech' },
  { id: 'ropa-mujer', name: 'Ropa Mujer' },
  { id: 'ropa-hombre', name: 'Ropa Hombre' },
];

function getSourceConfig(source: string) {
  return SOURCES.find((s) => s.id === source) || SOURCES[0];
}

// ====== Fallback Demo Products ======
const FALLBACK_PRODUCTS: AffiliateProduct[] = [
  {
    id: 'demo-1', title: 'Auriculares Bluetooth Inalámbricos con Cancelación de Ruido Pro',
    description: 'Auriculares over-ear premium con ANC, 40hs de batería y sonido Hi-Res',
    price: 85900, originalPrice: 129900, currency: 'ARS', imageUrl: '',
    sourceUrl: 'https://mercadolibre.com.ar', source: 'mercadolibre',
    category: 'auriculares', brand: 'Sony', rating: 4.7, reviewCount: 2340,
    commission: 9, active: true, featured: true, createdAt: '2025-01-10T10:00:00Z', updatedAt: '2025-01-15T10:00:00Z',
  },
  {
    id: 'demo-2', title: 'Taladro Percutor Inalámbrico 20V con Kit de Accesorios',
    description: 'Taladro compacto con 2 baterías de litio, maletín y 50 accesorios',
    price: 125000, originalPrice: 178000, currency: 'ARS', imageUrl: '',
    sourceUrl: 'https://mercadolibre.com.ar', source: 'mercadolibre',
    category: 'herramientas', brand: 'Bosch', rating: 4.5, reviewCount: 876,
    commission: 7, active: true, featured: true, createdAt: '2025-01-08T10:00:00Z', updatedAt: '2025-01-14T10:00:00Z',
  },
  {
    id: 'demo-3', title: 'Smart TV 55" 4K UHD con WebOS y Chromecast Integrado',
    description: 'Television LED 55 pulgadas con resolución 4K, HDR10 y WiFi integrado',
    price: 398000, originalPrice: 520000, currency: 'ARS', imageUrl: '',
    sourceUrl: 'https://mercadolibre.com.ar', source: 'mercadolibre',
    category: 'televisores', brand: 'LG', rating: 4.3, reviewCount: 1520,
    commission: 6, active: true, featured: false, createdAt: '2025-01-05T10:00:00Z', updatedAt: '2025-01-12T10:00:00Z',
  },
  {
    id: 'demo-4', title: 'Zapatillas Running Ultralivianas para Entrenamiento Diario',
    description: 'Zapatillas deportivas con suela gel, transpirables y amortiguación superior',
    price: 48900, originalPrice: 68500, currency: 'ARS', imageUrl: '',
    sourceUrl: 'https://mercadolibre.com.ar', source: 'mercadolibre',
    category: 'zapatillas', brand: 'Nike', rating: 4.1, reviewCount: 3200,
    commission: 10, active: true, featured: false, createdAt: '2025-01-06T10:00:00Z', updatedAt: '2025-01-11T10:00:00Z',
  },
  {
    id: 'demo-5', title: 'Cargador Inalámbrico Rápido 15W para iPhone y Android',
    description: 'Base de carga Qi con indicador LED, compatible con todos los dispositivos',
    price: 12800, originalPrice: 19500, currency: 'ARS', imageUrl: '',
    sourceUrl: 'https://mercadolibre.com.ar', source: 'mercadolibre',
    category: 'electrodomesticos', brand: 'Anker', rating: 4.6, reviewCount: 4120,
    commission: 5, active: true, featured: false, createdAt: '2025-01-04T10:00:00Z', updatedAt: '2025-01-09T10:00:00Z',
  },
  {
    id: 'demo-6', title: 'Robot Aspiradora con Mapeo Láser y Estación de Vaciado',
    description: 'Aspiradora inteligente con navegación LiDAR, succión 4000Pa y app WiFi',
    price: 285000, originalPrice: 380000, currency: 'ARS', imageUrl: '',
    sourceUrl: 'https://mercadolibre.com.ar', source: 'mercadolibre',
    category: 'electrodomesticos', brand: 'Roborock', rating: 4.8, reviewCount: 320,
    commission: 5, active: true, featured: true, createdAt: '2025-01-03T10:00:00Z', updatedAt: '2025-01-08T10:00:00Z',
  },
  {
    id: 'demo-7', title: 'Notebook Gaming 15.6" Intel i7 RTX 4060 16GB RAM',
    description: 'Laptop para gamers con pantalla FHD 144Hz, SSD 512GB y teclado RGB',
    price: 685000, originalPrice: 820000, currency: 'ARS', imageUrl: '',
    sourceUrl: 'https://mercadolibre.com.ar', source: 'mercadolibre',
    category: 'notebooks', brand: 'Lenovo', rating: 4.4, reviewCount: 560,
    commission: 7, active: true, featured: false, createdAt: '2025-01-02T10:00:00Z', updatedAt: '2025-01-07T10:00:00Z',
  },
  {
    id: 'demo-8', title: 'iPhone 15 128GB Negro Tela Titanio Libre',
    description: 'Apple iPhone 15 con chip A16 Bionic, cámara 48MP y USB-C',
    price: 1250000, originalPrice: 1380000, currency: 'ARS', imageUrl: '',
    sourceUrl: 'https://mercadolibre.com.ar', source: 'mercadolibre',
    category: 'celulares', brand: 'Apple', rating: 4.9, reviewCount: 8900,
    commission: 8, active: true, featured: true, createdAt: '2025-01-01T10:00:00Z', updatedAt: '2025-01-06T10:00:00Z',
  },
];

// ====== Helper Functions ======
function formatPrice(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(amount);
}

function getDiscountPercent(price: number, originalPrice?: number): number | null {
  if (!originalPrice || originalPrice <= price) return null;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

function getSourceBadgeStyles(source: string): string {
  const s = source.toLowerCase();
  if (s.includes('mercadolibre') || s.includes('ml')) return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
  if (s.includes('amazon')) return 'bg-blue-500/10 text-blue-700 border-blue-200';
  if (s.includes('ebay')) return 'bg-blue-500/10 text-blue-700 border-blue-200';
  if (s.includes('aliexpress') || s.includes('ali')) return 'bg-red-500/10 text-red-700 border-red-200';
  if (s.includes('temu')) return 'bg-purple-500/10 text-purple-700 border-purple-200';
  if (s.includes('shein')) return 'bg-pink-500/10 text-pink-700 border-pink-200';
  return 'bg-gray-500/10 text-gray-700 border-gray-200';
}

function getSourceDotColor(source: string): string {
  const s = source.toLowerCase();
  if (s.includes('mercadolibre') || s.includes('ml')) return 'bg-yellow-500';
  if (s.includes('amazon')) return 'bg-blue-500';
  if (s.includes('ebay')) return 'bg-blue-600';
  if (s.includes('aliexpress') || s.includes('ali')) return 'bg-red-500';
  if (s.includes('temu')) return 'bg-purple-600';
  if (s.includes('shein')) return 'bg-pink-500';
  return 'bg-gray-500';
}

function getSourceLabel(source: string): string {
  const s = source.toLowerCase();
  if (s.includes('mercadolibre') || s.includes('ml')) return 'MercadoLibre';
  if (s.includes('amazon')) return 'Amazon';
  if (s.includes('ebay')) return 'eBay';
  if (s.includes('aliexpress') || s.includes('ali')) return 'AliExpress';
  if (s.includes('temu')) return 'Temu';
  if (s.includes('shein')) return 'SHEIN';
  return source;
}

function getSourceIconChar(source: string): string {
  const s = source.toLowerCase();
  if (s.includes('mercadolibre') || s.includes('ml')) return 'M';
  if (s.includes('amazon')) return 'A';
  if (s.includes('ebay')) return 'e';
  if (s.includes('aliexpress') || s.includes('ali')) return 'Ali';
  if (s.includes('temu')) return 'T';
  if (s.includes('shein')) return 'S';
  return '📦';
}

function getSourceBtnColor(sourceId: string): string {
  const s = sourceId.toLowerCase();
  if (s === 'all') return undefined;
  if (s.includes('mercadolibre') || s.includes('ml')) return '#BFA000';
  if (s.includes('amazon')) return '#FF9900';
  if (s.includes('ebay')) return '#0064D2';
  if (s.includes('aliexpress') || s.includes('ali')) return '#FF4747';
  if (s.includes('temu')) return '#7C3AED';
  if (s.includes('shein')) return '#E11B1B';
  return '#6B7280';
}

function renderStars(rating: number) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars.push(<Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />);
    } else if (i - 0.5 <= rating) {
      stars.push(<Star key={i} className="h-3 w-3 fill-yellow-400/50 text-yellow-400" />);
    } else {
      stars.push(<Star key={i} className="h-3 w-3 text-gray-200" />);
    }
  }
  return stars;
}

// ====== API Types ======
interface APIProduct {
  id: string;
  title: string;
  description?: string;
  price: number;
  originalPrice?: number;
  currency: string;
  imageUrl?: string;
  sourceUrl: string;
  affiliateUrl?: string;
  source: string;
  externalId?: string;
  category: string;
  categoryPath?: string;
  brand?: string;
  seller?: string;
  rating?: number;
  reviewCount: number;
  soldQuantity: number;
  commission: number;
  active: boolean;
  featured: boolean;
  syncedAt?: string;
  createdAt: string;
  updatedAt: string;
  _count?: { clicks: number };
}

function apiToStoreProduct(p: APIProduct): AffiliateProduct {
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    price: p.price,
    originalPrice: p.originalPrice,
    currency: p.currency,
    imageUrl: p.imageUrl,
    sourceUrl: p.sourceUrl,
    source: p.source,
    category: p.category,
    brand: p.brand,
    rating: p.rating,
    reviewCount: p.reviewCount,
    commission: p.commission,
    active: p.active,
    featured: p.featured,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

// ====== Sub-Components ======

function LoadingSkeleton() {
  return (
    <div className="space-y-4 px-4 pb-6">
      <div className="flex gap-2 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-20 shrink-0 rounded-full" />
        ))}
      </div>
      <div className="flex gap-2 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-7 w-16 shrink-0 rounded-full" />
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-gray-100 bg-white overflow-hidden">
            <Skeleton className="w-full aspect-square rounded-none" />
            <div className="p-3 space-y-2">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-2/3 rounded" />
              <Skeleton className="h-5 w-1/2 rounded" />
              <Skeleton className="h-8 w-full rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-5">
        <ShoppingBag className="h-10 w-10 text-gray-300" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1.5">
        {hasFilters ? 'Sin resultados' : 'No hay productos'}
      </h3>
      <p className="text-sm text-muted-foreground text-center max-w-xs">
        {hasFilters
          ? 'Probá con otros filtros o términos de búsqueda para encontrar lo que buscás.'
          : 'No encontramos productos disponibles en este momento. Volvé más tarde.'}
      </p>
    </div>
  );
}

function OfflineBanner({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="mx-4 mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <WifiOff className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-amber-800">Modo sin conexión</p>
          <p className="text-xs text-amber-600 mt-0.5">
            Mostrando productos de demostración. Para ver productos reales de MercadoLibre, sincronizá desde el Panel de Admin.
          </p>
          <button
            onClick={onRetry}
            className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-800"
          >
            <RefreshCw className="h-3 w-3" />
            Reintentar conexión
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductCard({
  product,
  onClick,
}: {
  product: AffiliateProduct;
  onClick: (product: AffiliateProduct) => void;
}) {
  const [liked, setLiked] = useState(false);
  const discount = getDiscountPercent(product.price, product.originalPrice);
  const sourceLabel = getSourceLabel(product.source);
  const sourceColor = getSourceBtnColor(product.source);
  const hasImage = !!product.imageUrl;

  return (
    <div className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 flex flex-col">
      {/* Image */}
      <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={`flex flex-col items-center gap-2 ${product.imageUrl ? 'hidden' : ''}`}>
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm"
            style={{ backgroundColor: sourceColor || '#6B7280' }}
          >
            {getSourceIconChar(product.source)}
          </div>
          <span className="text-[10px] text-gray-400 font-medium">{product.brand || sourceLabel}</span>
        </div>

        {discount && (
          <div className="absolute top-2 left-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
            -{discount}%
          </div>
        )}

        {product.featured && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">
            ★ TOP
          </div>
        )}

        <button
          onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
          className="absolute bottom-2 right-2 w-7 h-7 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm"
          aria-label={liked ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          <Heart className={`h-3.5 w-3.5 transition-colors ${liked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
        </button>
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col flex-1">
        {/* Source badge */}
        <div className="flex items-center gap-1 mb-1.5">
          <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md border ${getSourceBadgeStyles(product.source)}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${getSourceDotColor(product.source)}`} />
            {sourceLabel}
          </span>
          {product.soldQuantity > 0 && (
            <span className="text-[9px] text-emerald-600 font-medium bg-emerald-50 px-1.5 py-0.5 rounded">
              +{product.soldQuantity} vendidos
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xs font-semibold text-foreground leading-snug line-clamp-2 mb-2 min-h-[2rem]">
          {product.title}
        </h3>

        {/* Rating */}
        {product.rating && product.rating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center gap-px">{renderStars(product.rating)}</div>
            <span className="text-[10px] text-muted-foreground">{product.rating.toFixed(1)}</span>
            <span className="text-[10px] text-muted-foreground">
              ({product.reviewCount > 999 ? `${(product.reviewCount / 1000).toFixed(1)}k` : product.reviewCount})
            </span>
          </div>
        )}

        <div className="flex-1" />

        {/* Price */}
        <div className="mt-auto">
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-[11px] text-muted-foreground line-through block">{formatPrice(product.originalPrice)}</span>
          )}
          <p className="text-base font-bold text-foreground">{formatPrice(product.price)}</p>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => onClick(product)}
          className="mt-2.5 w-full flex items-center justify-center gap-1.5 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-xs font-semibold py-2 rounded-lg transition-colors"
        >
          Ver oferta
          <ExternalLink className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

// ====== Main Component ======
export function ProductsScreen() {
  const {
    setView,
    setSelectedProduct,
    selectedProductSource,
    setSelectedProductSource,
    selectedProductCategory,
    setSelectedProductCategory,
    productSearchQuery,
    setProductSearchQuery,
  } = useAppStore();

  const [allProducts, setAllProducts] = useState<AffiliateProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const showFiltersRef = useRef(false);
  const [, setShowFiltersState] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Fetch real products from API
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ limit: '100' });
      const res = await fetch(`/api/products/real?${params}`);
      if (res.ok) {
        const data = await res.json();
        const products: AffiliateProduct[] = (data.products || []).map(apiToStoreProduct);
        setAllProducts(products);
        setTotalProducts(data.total || products.length);
        setIsOnline(true);
      } else {
        throw new Error('API error');
      }
    } catch {
      // Fallback to demo products
      setAllProducts(FALLBACK_PRODUCTS);
      setTotalProducts(FALLBACK_PRODUCTS.length);
      setIsOnline(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Filter products (client-side)
  const filteredProducts = useMemo(() => {
    let products = allProducts;

    if (productSearchQuery.trim()) {
      const query = productSearchQuery.toLowerCase().trim();
      products = products.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.brand?.toLowerCase().includes(query)
      );
    }

    if (selectedProductSource !== 'all') {
      products = products.filter((p) => p.source.toLowerCase() === selectedProductSource.toLowerCase());
    }

    if (selectedProductCategory !== 'all') {
      products = products.filter((p) => p.category === selectedProductCategory);
    }

    return products;
  }, [allProducts, productSearchQuery, selectedProductSource, selectedProductCategory]);

  const hasActiveFilters = selectedProductSource !== 'all' || selectedProductCategory !== 'all' || productSearchQuery.trim() !== '';

  const handleProductClick = useCallback((product: AffiliateProduct) => {
    setSelectedProduct(product);
    setView('product-detail');
  }, [setSelectedProduct, setView]);

  const handleClearAllFilters = useCallback(() => {
    setProductSearchQuery('');
    setSelectedProductSource('all');
    setSelectedProductCategory('all');
  }, [setProductSearchQuery, setSelectedProductSource, setSelectedProductCategory]);

  const toggleFilters = useCallback(() => {
    showFiltersRef.current = !showFiltersRef.current;
    setShowFiltersState(showFiltersRef.current);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-full bg-gray-50/50">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 pt-10 pb-3 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-6 w-32 rounded" />
          </div>
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gray-50/50">
      {/* ====== Sticky Header ====== */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="px-4 pt-10 pb-2">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => setView('home')}
              className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              aria-label="Volver"
            >
              <ArrowLeft className="h-4 w-4 text-gray-600" />
            </button>
            <h1 className="text-lg font-bold text-foreground flex-1">Productos</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setView('admin')}
                className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                aria-label="Admin"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
              <button
                onClick={toggleFilters}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${showFiltersRef.current ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                aria-label="Filtros"
              >
                <Filter className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              value={productSearchQuery}
              onChange={(e) => setProductSearchQuery(e.target.value)}
              placeholder="Buscar productos, marcas..."
              className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-gray-100 border-none text-sm text-foreground placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white transition-all"
            />
            {productSearchQuery && (
              <button
                onClick={() => { setProductSearchQuery(''); searchInputRef.current?.focus(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-gray-300 hover:bg-gray-400 rounded-full flex items-center justify-center transition-colors"
                aria-label="Limpiar búsqueda"
              >
                <span className="text-white text-xs leading-none font-bold">×</span>
              </button>
            )}
          </div>
        </div>

        {/* Source tabs */}
        <div className="border-b border-gray-100">
          <div className="flex gap-1.5 overflow-x-auto px-4 py-2.5" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {SOURCES.map((source) => (
              <button
                key={source.id}
                onClick={() => setSelectedProductSource(source.id)}
                className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedProductSource === source.id ? 'text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                style={selectedProductSource === source.id ? { backgroundColor: getSourceBtnColor(source.id) || '#6B7280' } : undefined}
              >
                {source.id !== 'all' && (
                  <span className={`w-1.5 h-1.5 rounded-full ${getSourceDotColor(source.id)}`} />
                )}
                {source.name}
              </button>
            ))}
          </div>
        </div>

        {/* Category pills */}
        {showFiltersRef.current && (
          <div className="px-4 py-2.5 border-b border-gray-100">
            <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedProductCategory(cat.id)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    selectedProductCategory === cat.id ? 'bg-foreground text-background shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Offline banner */}
      {!isOnline && <OfflineBanner onRetry={fetchProducts} />}

      {/* Results info */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-gray-50">
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">{filteredProducts.length}</span>{' '}
            {filteredProducts.length === 1 ? 'resultado' : 'resultados'}
            {isOnline && <span className="ml-1">de {totalProducts}</span>}
          </p>
          <button onClick={handleClearAllFilters} className="flex items-center gap-1 text-xs text-blue-500 font-semibold hover:text-blue-600 transition-colors">
            Limpiar filtros <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="px-3 py-4 pb-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onClick={handleProductClick} />
            ))}
          </div>
        </div>
      ) : (
        <EmptyState hasFilters={hasActiveFilters} />
      )}
    </div>
  );
}
