/**
 * MercadoLibre Product Sync Utilities
 * Fetches products from MercadoLibre Argentina API
 */

export interface MLProduct {
  id: string;
  title: string;
  permalink: string;
  thumbnail: string;
  price: number;
  original_price?: number;
  currency_id: string;
  seller: {
    id: number;
    nickname: string;
  };
  category_id: string;
  domain_id?: string;
  brand?: {
    name: string;
  };
  tags: string[];
  shipping: {
    free_shipping: boolean;
  };
  ratings: {
    positive: number;
    negative: number;
    neutral: number;
  };
  reviews: {
    total: number;
  };
  sold_quantity: number;
  installments?: {
    quantity: number;
    amount: number;
    currency_id: string;
  };
  pictures?: Array<{
    id: string;
    url: string;
    secure_url: string;
    size: string;
  }>;
  attributes?: Array<{
    id: string;
    name: string;
    value_name: string;
  }>;
}

export interface MLCategories {
  query: string;
  name: string;
  slug: string;
}

export const ML_CATEGORIES: MLCategories[] = [
  { query: 'celulares smartphones', name: 'Celulares y Smartphones', slug: 'celulares' },
  { query: 'computadoras portátiles notebooks', name: 'Notebooks', slug: 'notebooks' },
  { query: 'televisores smart tv', name: 'Televisores', slug: 'televisores' },
  { query: 'zapatillas deportivas running', name: 'Zapatillas', slug: 'zapatillas' },
  { query: 'auriculares bluetooth inalambricos', name: 'Auriculares', slug: 'auriculares' },
  { query: 'consolas videojuegos playstation', name: 'Videojuegos', slug: 'videojuegos' },
  { query: 'electrodomésticos cocinas heladeras', name: 'Electrodomésticos', slug: 'electrodomesticos' },
  { query: 'herramientas eléctricas taladro', name: 'Herramientas', slug: 'herramientas' },
  { query: 'ropa deportiva hombre mujer', name: 'Ropa Deportiva', slug: 'ropa-deportiva' },
  { query: 'accesorios technology cargadores', name: 'Accesorios Tech', slug: 'accesorios-tech' },
  { query: 'ropa mujer moda tendencia', name: 'Ropa Mujer', slug: 'ropa-mujer' },
  { query: 'ropa hombre moda casual', name: 'Ropa Hombre', slug: 'ropa-hombre' },
];

// ML Afiliados comisiones reales (Argentina, 2024-2025)
// Rango tipico: 2-8% dependiendo de la categoria
export const ML_COMMISSION_RATES: Record<string, number> = {
  celulares: 0.06,
  notebooks: 0.05,
  televisores: 0.04,
  zapatillas: 0.07,
  auriculares: 0.06,
  videojuegos: 0.06,
  electrodomesticos: 0.04,
  herramientas: 0.05,
  'ropa-deportiva': 0.07,
  'accesorios-tech': 0.05,
  'ropa-mujer': 0.07,
  'ropa-hombre': 0.07,
};

/**
 * Fetch products from MercadoLibre Argentina public search API
 */
export async function fetchMLProducts(
  query: string,
  limit: number = 50
): Promise<MLProduct[]> {
  try {
    const params = new URLSearchParams({
      q: query,
      limit: String(limit),
      condition: 'new',
      shipping: 'free',
    });

    const url = `https://api.mercadolibre.com/sites/MLA/search?${params}`;

    const response = await fetch(url, {
      next: { revalidate: 3600 },
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ProductSync/1.0)',
      },
    });

    if (!response.ok) {
      console.error(`ML API error: ${response.status} ${response.statusText}`);
      return [];
    }

    const data = await response.json();

    return (data.results || []).map((item: Record<string, unknown>) => ({
      id: String(item.id),
      title: String(item.title || ''),
      permalink: String(item.permalink || ''),
      thumbnail: String(item.thumbnail || ''),
      price: Number(item.price) || 0,
      original_price: item.original_price ? Number(item.original_price) : null,
      currency_id: String(item.currency_id || 'ARS'),
      seller: {
        id: Number(item.seller?.id) || 0,
        nickname: String(item.seller?.nickname || ''),
      },
      category_id: String(item.category_id || ''),
      domain_id: item.domain_id ? String(item.domain_id) : null,
      brand: item.attributes
        ? {
            name: String(
              (item.attributes as Array<Record<string, unknown>>).find(
                (a: Record<string, unknown>) => a.id === 'BRAND'
              )?.value_name || ''
            ),
          }
        : undefined,
      tags: Array.isArray(item.tags) ? item.tags : [],
      shipping: {
        free_shipping: Boolean(item.shipping?.free_shipping),
      },
      ratings: {
        positive: Number(item.ratings?.positive) || 0,
        negative: Number(item.ratings?.negative) || 0,
        neutral: Number(item.ratings?.neutral) || 0,
      },
      reviews: {
        total: Number(item.reviews?.total) || 0,
      },
      sold_quantity: Number(item.sold_quantity) || 0,
      installments: item.installments
        ? {
            quantity: Number(item.installments.quantity) || 1,
            amount: Number(item.installments.amount) || 0,
            currency_id: String(item.installments.currency_id || 'ARS'),
          }
        : undefined,
      pictures: Array.isArray(item.pictures)
        ? item.pictures.slice(0, 3).map((p: Record<string, unknown>) => ({
            id: String(p.id),
            url: String(p.url || ''),
            secure_url: String(p.secure_url || ''),
            size: String(p.size || ''),
          }))
        : undefined,
      attributes: Array.isArray(item.attributes)
        ? item.attributes.slice(0, 10).map((a: Record<string, unknown>) => ({
            id: String(a.id),
            name: String(a.name),
            value_name: String(a.value_name || ''),
          }))
        : undefined,
    }));
  } catch (error) {
    console.error(`Error fetching ML products for "${query}":`, error);
    return [];
  }
}

/**
 * Get commission rate for a category slug
 */
export function getCommissionRate(slug: string): number {
  return ML_COMMISSION_RATES[slug] || 0.05;
}
