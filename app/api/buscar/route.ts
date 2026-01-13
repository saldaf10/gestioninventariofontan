import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type')
    const query = searchParams.get('q')

    if (!type || !query) {
      return NextResponse.json(
        { error: 'Tipo de búsqueda y consulta son requeridos' },
        { status: 400 }
      )
    }

    if (type === 'code') {
      const devices = await prisma.device.findMany({
        where: {
          code: {
            contains: query,
            mode: 'insensitive',
          },
        },
        include: {
          responsible: true,
        },
        orderBy: {
          code: 'asc',
        },
      })

      return NextResponse.json({ devices })
    } else if (type === 'responsible') {
      const responsibles = await prisma.responsible.findMany({
        where: {
          name: {
            contains: query,
            mode: 'insensitive',
          },
        },
        include: {
          devices: {
            orderBy: {
              code: 'asc',
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      })

      return NextResponse.json({ responsibles })
    } else {
      return NextResponse.json(
        { error: 'Tipo de búsqueda inválido' },
        { status: 400 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Error en la búsqueda' },
      { status: 500 }
    )
  }
}
