import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import fs from 'fs/promises'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const form = await prisma.deliveryReturnForm.findUnique({
      where: { id: params.id },
    })

    if (!form) {
      return NextResponse.json(
        { error: 'Formulario no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(form)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener formulario' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const form = await prisma.deliveryReturnForm.findUnique({
      where: { id: params.id },
    })

    if (!form) {
      return NextResponse.json(
        { error: 'Formulario no encontrado' },
        { status: 404 }
      )
    }

    // Delete file if it exists
    if (form.fileUrl) {
      try {
        const filePath = path.join(process.cwd(), 'public', form.fileUrl)
        await fs.unlink(filePath)
      } catch (error) {
        // File might not exist, continue with deletion
        console.error('Error deleting file:', error)
      }
    }

    await prisma.deliveryReturnForm.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al eliminar formulario' },
      { status: 500 }
    )
  }
}

