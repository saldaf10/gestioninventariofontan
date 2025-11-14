import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const responsibles = await prisma.responsible.findMany({
      include: {
        _count: {
          select: { devices: true },
        },
      },
      orderBy: {
        name: 'asc',
      },
    })
    return NextResponse.json(responsibles)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener responsables' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, taller, associatedDocumentUrl } = body

    if (!name || !taller) {
      return NextResponse.json(
        { error: 'Nombre y taller son requeridos' },
        { status: 400 }
      )
    }

    const responsible = await prisma.responsible.create({
      data: {
        name,
        taller,
        associatedDocumentUrl: associatedDocumentUrl || null,
      },
    })

    return NextResponse.json(responsible, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al crear responsable' },
      { status: 500 }
    )
  }
}

