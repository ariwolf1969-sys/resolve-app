import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { fetchMLProducts, ML_CATEGORIES, getCommissionRate } from '@/lib/product-sync';
import { AFFILIATE_CONFIG, buildAffiliateUrl } from '@/lib/affiliate';

interface SyncRequestBody {
  categories?: string[];
  affiliateId?: string;
}

// Allow GET to trigger sync from browser
export async function GET() {
  return handleSync(undefined);
}

export async function POST(request: NextRequest) {
  try {
    const body: SyncRequestBody = await request.json().catch(() => ({}));
    return handleSync(body);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

async function handleSync(body: SyncRequestBody | undefined) {
  try {
    const requestedCategories = body?.categories;
    const affiliateId = body?.affiliateId;

    // Use provided affiliate ID or default from config
    const activeAffiliateId = affiliateId || AFFILIATE_CONFIG.mercadolibre.affiliateId;

    // Determine which categories to sync
    const categoriesToSync = requestedCategories
      ? ML_CATEGORIES.filter((cat) => requestedCategories.includes(cat.slug))
      : ML_CATEGORIES;

    let totalSynced = 0;

    for (const category of categoriesToSync) {
      const products = await fetchMLProducts(category.query, 50);

      for (const product of products) {
        // Find existing product by externalId + source
        const existing = await db.affiliateProduct.findFirst({
          where: {
            externalId: product.id,
            source: 'mercadolibre',
          },
        });

        // Build image URL (use highest quality picture if available)
        // ML thumbnails are low quality (600x600), pictures are higher (1200x1200)
        // Convert thumbnail URL to full size: replace -O with -I for original size
        let imageUrl = product.pictures?.[0]?.secure_url || null;
        if (!imageUrl && product.thumbnail) {
          // Upgrade thumbnail to original quality
          imageUrl = product.thumbnail.replace(/-O\\.jpg$/i, '-I.jpg') || product.thumbnail.replace(/-O\\.png$/i, '-I.png') || product.thumbnail;
        }

        // Build affiliate URL with UTM tracking
        const affiliateUrl = buildAffiliateUrl(product.permalink, 'mercadolibre');

        const productData = {
          title: product.title,
          description: product.title,
          price: product.price,
          originalPrice: product.original_price,
          currency: product.currency_id,
          imageUrl,
          sourceUrl: product.permalink,
          affiliateUrl,
          source: 'mercadolibre',
          externalId: product.id,
          category: category.slug,
          categoryPath: category.name,
          brand: product.brand?.name || null,
          seller: product.seller.nickname,
          rating: product.ratings.positive / (product.ratings.positive + product.ratings.negative + product.ratings.neutral) * 5 || null,
          reviewCount: product.reviews.total,
          soldQuantity: product.sold_quantity,
          commission: getCommissionRate(category.slug),
          active: true,
          featured: product.sold_quantity > 100,
          syncedAt: new Date(),
        };

        if (existing) {
          await db.affiliateProduct.update({
            where: { id: existing.id },
            data: productData,
          });
        } else {
          await db.affiliateProduct.create({
            data: productData,
          });
        }

        totalSynced++;
      }
    }

    const totalInDb = await db.affiliateProduct.count();

    return NextResponse.json({
      success: true,
      synced: totalSynced,
      affiliateId: activeAffiliateId,
      categories: categoriesToSync.map((c) => c.slug),
      totalInDb,
    });
  } catch (error) {
    console.error('Error syncing products:', error);
    return NextResponse.json(
      { error: 'Internal server error while syncing products' },
      { status: 500 }
    );
  }
}
