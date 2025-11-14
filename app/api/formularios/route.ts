import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const forms = await prisma.deliveryReturnForm.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
    return NextResponse.json(forms)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener formularios' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, fileUrl } = body

    if (!name || !fileUrl) {
      return NextResponse.json(
        { error: 'Nombre y archivo son requeridos' },
        { status: 400 }
      )
    }

    const form = await prisma.deliveryReturnForm.create({
      data: {
        name,
        fileUrl,
      },
    })

    return NextResponse.json(form, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al crear formulario' },
      { status: 500 }
    )
  }
}

