import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getOwnerTypeFromCode } from '@/lib/utils'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const device = await prisma.device.findUnique({
      where: { id: params.id },
      include: {
        responsible: true,
      },
    })

    if (!device) {
      return NextResponse.json(
        { error: 'Dispositivo no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(device)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener dispositivo' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { code, responsibleId, observations, isExternalRenting, rentingCompany, returnDueDate } = body

    const existing = await prisma.device.findUnique({
      where: { id: params.id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Dispositivo no encontrado' },
        { status: 404 }
      )
    }

    const ownerType = code ? getOwnerTypeFromCode(code) : existing.ownerType

    const device = await prisma.device.update({
      where: { id: params.id },
      data: {
        ownerType,
        responsibleId: responsibleId || null,
        observations: observations || null,
        isExternalRenting: isExternalRenting || false,
        rentingCompany: rentingCompany || null,
        returnDueDate: returnDueDate ? new Date(returnDueDate) : null,
      },
    })

    return NextResponse.json(device)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al actualizar dispositivo' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.device.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al eliminar dispositivo' },
      { status: 500 }
    )
  }
}

