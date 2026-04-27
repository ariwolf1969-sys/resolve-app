import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, password, role, dniNumber, province, city, neighborhood } = await req.json()

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'El nombre es requerido' }, { status: 400 })
    }

    if (!email || !password) {
      return NextResponse.json({ error: 'Email y contraseña son requeridos' }, { status: 400 })
    }

    if (!phone) {
      return NextResponse.json({ error: 'El teléfono es requerido' }, { status: 400 })
    }

    const digits = phone.replace(/\D/g, '')
    if (digits.length < 8 || digits.length > 11) {
      return NextResponse.json(
        { error: 'El teléfono debe tener entre 8 y 11 dígitos' },
        { status: 400 }
      )
    }

    const existing = await db.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'El email ya está registrado' }, { status: 409 })
    }

    const fullPhone = '+54' + digits
    const existingPhone = await db.user.findUnique({ where: { phone: fullPhone } })
    if (existingPhone) {
      return NextResponse.json({ error: 'El teléfono ya está registrado' }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await db.user.create({
      data: {
        name: name.trim(),
        email,
        phone: fullPhone,
        password: hashedPassword,
        role: role || 'client',
        dniNumber: dniNumber || undefined,
        province: province || undefined,
        city: city || undefined,
        neighborhood: neighborhood ? neighborhood.trim() : undefined,
      },
    })

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      province: user.province,
      city: user.city,
      neighborhood: user.neighborhood,
      avatar: user.avatar,
      profession: user.profession,
      bio: user.bio,
      skills: user.skills,
      experience: user.experience,
      hourlyRate: user.hourlyRate,
      available: user.available,
      verified: user.verified,
      dniVerified: user.dniVerified,
      dniNumber: user.dniNumber,
      ratingAvg: user.ratingAvg,
      ratingCount: user.ratingCount,
      completedJobs: user.completedJobs,
      createdAt: user.createdAt,
    })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json({ error: 'Error al registrar usuario' }, { status: 500 })
  }
}
