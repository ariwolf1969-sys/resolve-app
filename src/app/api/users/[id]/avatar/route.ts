import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const formData = await request.formData();
    const avatarFile = formData.get('avatar') as File | null;

    if (!avatarFile) {
      return NextResponse.json({ error: 'No se proporcionó imagen' }, { status: 400 });
    }

    // Validate file type
    if (!avatarFile.type.startsWith('image/')) {
      return NextResponse.json({ error: 'El archivo debe ser una imagen' }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (avatarFile.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'La imagen no puede superar los 5MB' }, { status: 400 });
    }

    // Convert to base64 data URL
    const bytes = await avatarFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const avatarUrl = `data:${avatarFile.type};base64,${base64}`;

    // Update user in database
    const user = await db.user.update({
      where: { id },
      data: { avatar: avatarUrl },
      select: {
        id: true, name: true, phone: true, email: true, avatar: true,
        role: true, profession: true, bio: true, neighborhood: true,
        province: true, city: true, skills: true, experience: true,
        hourlyRate: true, available: true, verified: true, dniVerified: true,
        dniNumber: true, ratingAvg: true, ratingCount: true, completedJobs: true,
      },
    });

    return NextResponse.json({ avatarUrl: user.avatar, user });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    return NextResponse.json({ error: 'Error al subir imagen' }, { status: 500 });
  }
}
