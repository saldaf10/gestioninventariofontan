import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const responsible = await prisma.responsible.findUnique({
      where: { id: params.id },
      include: {
        devices: true,
      },
    })

    if (!responsible) {
      return NextResponse.json(
        { error: 'Responsable no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(responsible)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener responsable' },
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
    const { name, taller, associatedDocumentUrl } = body

    if (!name || !taller) {
      return NextResponse.json(
        { error: 'Nombre y taller son requeridos' },
        { status: 400 }
      )
    }

    const existing = await prisma.responsible.findUnique({
      where: { id: params.id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Responsable no encontrado' },
        { status: 404 }
      )
    }

    const responsible = await prisma.responsible.update({
      where: { id: params.id },
      data: {
        name,
        taller,
        associatedDocumentUrl: associatedDocumentUrl || null,
      },
    })

    return NextResponse.json(responsible)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al actualizar responsable' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Devices will have their responsibleId set to null automatically due to onDelete: SetNull
    await prisma.responsible.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al eliminar responsable' },
      { status: 500 }
    )
  }
}

