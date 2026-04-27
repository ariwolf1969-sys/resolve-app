import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const profession = searchParams.get('q');
    const neighborhood = searchParams.get('neighborhood');
    const province = searchParams.get('province');
    const city = searchParams.get('city');
    const workZone = searchParams.get('workZone');
    const lat = searchParams.get('lat') ? parseFloat(searchParams.get('lat')!) : null;
    const lng = searchParams.get('lng') ? parseFloat(searchParams.get('lng')!) : null;
    const maxDistance = searchParams.get('maxDistance') ? parseFloat(searchParams.get('maxDistance')!) : 50;
    const verified = searchParams.get('verified');
    const sort = searchParams.get('sort') || 'rating';
    const limit = parseInt(searchParams.get('limit') || '50');

    const where: Record<string, unknown> = {
      available: true,
    };

    if (profession && profession.trim()) {
      where.OR = [
        { profession: { contains: profession.trim(), mode: 'insensitive' } },
        { skills: { contains: profession.trim(), mode: 'insensitive' } },
        { bio: { contains: profession.trim(), mode: 'insensitive' } },
        { name: { contains: profession.trim(), mode: 'insensitive' } },
      ];
    }

    if (neighborhood) {
      where.neighborhood = { contains: neighborhood };
    }

    if (province) {
      where.province = { equals: province };
    }

    if (city) {
      where.city = { contains: city };
    }

    if (workZone) {
      where.workZone = { equals: workZone };
    }

    if (verified === 'true') {
      where.dniVerified = true;
    }

    // Note: SQLite doesn't support 'insensitive' mode, handle manually
    let professionals = await db.user.findMany({
      where: profession ? {
        available: true,
        ...(verified === 'true' ? { dniVerified: true } : {}),
        ...(neighborhood ? { neighborhood: { contains: neighborhood } } : {}),
        ...(province ? { province: { equals: province } } : {}),
        ...(city ? { city: { contains: city } } : {}),
        ...(workZone ? { workZone: { equals: workZone } } : {}),
      } : {
        available: true,
        ...(verified === 'true' ? { dniVerified: true } : {}),
        ...(neighborhood ? { neighborhood: { contains: neighborhood } } : {}),
        ...(province ? { province: { equals: province } } : {}),
        ...(city ? { city: { contains: city } } : {}),
        ...(workZone ? { workZone: { equals: workZone } } : {}),
      },
      select: {
        id: true,
        name: true,
        phone: true,
        avatar: true,
        bio: true,
        location: true,
        neighborhood: true,
        province: true,
        city: true,
        workZone: true,
        lat: true,
        lng: true,
        profession: true,
        skills: true,
        experience: true,
        hourlyRate: true,
        available: true,
        verified: true,
        dniVerified: true,
        ratingAvg: true,
        ratingCount: true,
        completedJobs: true,
      },
      orderBy: sort === 'rating' ? { ratingAvg: 'desc' } : sort === 'jobs' ? { completedJobs: 'desc' } : sort === 'price_asc' ? { hourlyRate: 'asc' } : sort === 'price_desc' ? { hourlyRate: 'desc' } : { createdAt: 'desc' },
      take: limit,
    });

    // Manual filter for profession search (SQLite case-insensitive workaround)
    if (profession && profession.trim()) {
      const q = profession.trim().toLowerCase();
      professionals = professionals.filter(p =>
        (p.profession && p.profession.toLowerCase().includes(q)) ||
        (p.skills && p.skills.toLowerCase().includes(q)) ||
        (p.bio && p.bio.toLowerCase().includes(q)) ||
        (p.name && p.name.toLowerCase().includes(q))
      );
    }

    // Calculate distances
    if (lat !== null && lng !== null) {
      professionals = professionals.map(pro => {
        if (pro.lat !== null && pro.lng !== null) {
          const distance = haversineDistance(lat, lng, pro.lat, pro.lng);
          return { ...pro, distanceKm: Math.round(distance * 10) / 10 };
        }
        return { ...pro, distanceKm: null as number | null };
      });
    }

    // Sort by distance if coordinates provided
    if (lat !== null && lng !== null) {
      professionals.sort((a, b) => ((a as any).distanceKm || 999) - ((b as any).distanceKm || 999));
      professionals = professionals.filter(pro => ((pro as any).distanceKm || 999) <= maxDistance);
    }

    return NextResponse.json(professionals);
  } catch (error) {
    console.error('Error fetching professionals:', error);
    return NextResponse.json({ error: 'Failed to fetch professionals' }, { status: 500 });
  }
}

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
