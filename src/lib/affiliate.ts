/**
 * Affiliate Configuration for Resolvé
 * 
 * Marketplace affiliate link management
 * Supports MercadoLibre affiliate program
 */

// ====== AFFILIATE CONFIG ======

export const AFFILIATE_CONFIG = {
  // MercadoLibre Argentina - Your affiliate info
  mercadolibre: {
    affiliateId: process.env.NEXT_PUBLIC_AFFILIATE_ID || 'WH221V-GYCG',
    sampleLink: process.env.NEXT_PUBLIC_AFFILIATE_LINK || 'https://meli.la/2PH8gKL',
    programName: 'Programa de Afiliados y Creadores',
    commissionRange: '2% a 15%',
    currency: 'ARS',
    baseUrl: 'https://www.mercadolibre.com.ar',
    apiBaseUrl: 'https://api.mercadolibre.com/sites/MLA',
  },
};

/**
 * Build an affiliate URL for a MercadoLibre product.
 * 
 * Strategy: Since MercadoLibre affiliate links are generated through 
 * their portal (meli.la short links), we use UTM parameters to track 
 * referrals through our platform. The admin can also manually set 
 * meli.la affiliate links for featured products via the sync endpoint.
 * 
 * When a user clicks a product, we:
 * 1. Track the click in our database
 * 2. Redirect to the product's source URL (with UTM params)
 * 3. The admin generates meli.la links separately via ML portal
 */
export function buildAffiliateUrl(sourceUrl: string, source: string): string {
  const config = AFFILIATE_CONFIG[source as keyof typeof AFFILIATE_CONFIG];
  
  if (!config) {
    return sourceUrl;
  }

  try {
    const url = new URL(sourceUrl);
    // Add UTM parameters for tracking
    url.searchParams.set('utm_source', 'resolve');
    url.searchParams.set('utm_medium', 'affiliate');
    url.searchParams.set('utm_campaign', config.affiliateId);
    return url.toString();
  } catch {
    return sourceUrl;
  }
}

/**
 * Generate a shareable affiliate message for WhatsApp/Social
 */
export function generateShareText(productTitle: string, productUrl: string): string {
  const shortTitle = productTitle.length > 60 
    ? productTitle.substring(0, 57) + '...' 
    : productTitle;
  
  return `🛒 ${shortTitle}\n\nMirá esta oferta que encontré en Resolvé:\n${productUrl}`;
}

/**
 * Get affiliate disclosure text (required by law)
 */
export function getAffiliateDisclosure(): string {
  return 'Al comprar desde estos enlaces, Resolvé puede recibir una comisión. El precio para vos es exactamente el mismo.';
}

/**
 * Calculate potential commission for a product
 */
export function calculateCommission(price: number, commissionRate: number): number {
  return Math.round(price * commissionRate / 100);
}
