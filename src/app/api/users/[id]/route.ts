import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
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
        dniNumber: true,
        ratingAvg: true,
        ratingCount: true,
        completedJobs: true,
        createdAt: true,
        needs: {
          where: { status: { in: ['active', 'in_progress', 'completed'] } },
          orderBy: { createdAt: 'desc' },
          take: 10,
          select: {
            id: true,
            title: true,
            category: true,
            status: true,
            createdAt: true,
          }
        },
        ratingsReceived: {
          include: {
            rater: { select: { id: true, name: true, avatar: true } }
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const user = await db.user.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.bio !== undefined && { bio: body.bio }),
        ...(body.location !== undefined && { location: body.location }),
        ...(body.neighborhood !== undefined && { neighborhood: body.neighborhood }),
        ...(body.avatar !== undefined && { avatar: body.avatar }),
        ...(body.profession !== undefined && { profession: body.profession }),
        ...(body.skills !== undefined && { skills: body.skills }),
        ...(body.experience !== undefined && { experience: body.experience }),
        ...(body.hourlyRate !== undefined && { hourlyRate: body.hourlyRate }),
        ...(body.available !== undefined && { available: body.available }),
        ...(body.verified !== undefined && { verified: body.verified }),
        ...(body.dniVerified !== undefined && { dniVerified: body.dniVerified }),
        ...(body.dniNumber !== undefined && { dniNumber: body.dniNumber }),
        ...(body.dniPhotoUrl !== undefined && { dniPhotoUrl: body.dniPhotoUrl }),
        ...(body.selfieDniUrl !== undefined && { selfieDniUrl: body.selfieDniUrl }),
        ...(body.phone !== undefined && { phone: body.phone }),
        ...(body.province !== undefined && { province: body.province }),
        ...(body.city !== undefined && { city: body.city }),
        ...(body.workZone !== undefined && { workZone: body.workZone }),
      }
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
