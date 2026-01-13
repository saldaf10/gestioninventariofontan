import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { deviceIds, responsibleId } = body

    if (!deviceIds || !Array.isArray(deviceIds) || deviceIds.length === 0) {
      return NextResponse.json(
        { error: 'Se requieren IDs de dispositivos' },
        { status: 400 }
      )
    }

    if (!responsibleId) {
      return NextResponse.json(
        { error: 'El ID del responsable es requerido' },
        { status: 400 }
      )
    }

    // Verify responsible exists
    const responsible = await prisma.responsible.findUnique({
      where: { id: responsibleId },
    })

    if (!responsible) {
      return NextResponse.json(
        { error: 'Responsable no encontrado' },
        { status: 404 }
      )
    }

    // Update devices
    const result = await prisma.device.updateMany({
      where: {
        id: {
          in: deviceIds,
        },
      },
      data: {
        responsibleId: responsibleId,
      },
    })

    return NextResponse.json({
      message: `Se han asignado ${result.count} dispositivos correctamente`,
      count: result.count,
    })
  } catch (error) {
    console.error('Error in bulk assignment:', error)
    return NextResponse.json(
      { error: 'Error al realizar la asignación masiva' },
      { status: 500 }
    )
  }
}
