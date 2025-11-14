import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateDeviceCode, getOwnerTypeFromCode } from '@/lib/utils'

export async function GET() {
  try {
    const devices = await prisma.device.findMany({
      include: {
        responsible: true,
      },
      orderBy: {
        code: 'asc',
      },
    })
    return NextResponse.json(devices)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener dispositivos' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, responsibleId, observations, isExternalRenting, rentingCompany, returnDueDate } = body

    if (!code) {
      return NextResponse.json(
        { error: 'El código es requerido' },
        { status: 400 }
      )
    }

    if (!validateDeviceCode(code)) {
      return NextResponse.json(
        { error: 'El código debe tener el formato CF-XXX, RF-XXX o AF-XXX' },
        { status: 400 }
      )
    }

    const ownerType = getOwnerTypeFromCode(code)

    // Check if code already exists
    const existing = await prisma.device.findUnique({
      where: { code: code.toUpperCase() },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Ya existe un dispositivo con este código' },
        { status: 400 }
      )
    }

    const device = await prisma.device.create({
      data: {
        code: code.toUpperCase(),
        ownerType,
        responsibleId: responsibleId || null,
        observations: observations || null,
        isExternalRenting: isExternalRenting || false,
        rentingCompany: rentingCompany || null,
        returnDueDate: returnDueDate ? new Date(returnDueDate) : null,
      },
    })

    return NextResponse.json(device, { status: 201 })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Ya existe un dispositivo con este código' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Error al crear dispositivo' },
      { status: 500 }
    )
  }
}

