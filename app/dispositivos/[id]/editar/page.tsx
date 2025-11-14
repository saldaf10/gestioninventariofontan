import { prisma } from '@/lib/prisma'
import AppLayout from '@/components/AppLayout'
import DeviceForm from '@/components/DeviceForm'
import { notFound } from 'next/navigation'

async function getDevice(id: string) {
  return await prisma.device.findUnique({
    where: { id },
    include: {
      responsible: true,
    },
  })
}

async function getResponsibles() {
  return await prisma.responsible.findMany({
    orderBy: {
      name: 'asc',
    },
  })
}

export default async function EditarDispositivoPage({ params }: { params: { id: string } }) {
  const [device, responsibles] = await Promise.all([
    getDevice(params.id),
    getResponsibles(),
  ])

  if (!device) {
    notFound()
  }

  return (
    <AppLayout title={`Editar Dispositivo ${device.code}`}>
      <div className="max-w-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Editar Dispositivo</h2>
        <DeviceForm device={device} responsibles={responsibles} />
      </div>
    </AppLayout>
  )
}

