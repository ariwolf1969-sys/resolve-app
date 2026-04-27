import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    try {
      const decoded = Buffer.from(token, 'base64').toString()
      const userId = decoded.split(':')[0]
      const timestamp = parseInt(decoded.split(':')[1])

      // Token expires after 7 days
      if (Date.now() - timestamp > 7 * 24 * 60 * 60 * 1000) {
        return NextResponse.json({ error: 'Token expirado' }, { status: 401 })
      }

      const user = await db.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          avatar: true,
          role: true,
          profession: true,
          bio: true,
          neighborhood: true,
          city: true,
          province: true,
          location: true,
          hourlyRate: true,
          verified: true,
          dniVerified: true,
          skills: true,
          experience: true,
          ratingAvg: true,
          ratingCount: true,
          completedJobs: true,
          balance: true,
          createdAt: true,
        },
      })

      if (!user) {
        return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
      }

      return NextResponse.json({
        ...user,
        skills: user.skills ? JSON.parse(user.skills) : null,
      })
    } catch {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }
  } catch (error) {
    console.error('Me error:', error)
    return NextResponse.json({ error: 'Error al obtener usuario' }, { status: 500 })
  }
}
