import { prisma } from '@/lib/prisma'
import AppLayout from '@/components/AppLayout'
import DeviceForm from '@/components/DeviceForm'

async function getResponsibles() {
  return await prisma.responsible.findMany({
    orderBy: {
      name: 'asc',
    },
  })
}

export default async function NuevoDispositivoPage() {
  const responsibles = await getResponsibles()

  return (
    <AppLayout title="Nuevo Dispositivo">
      <div className="max-w-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Registrar Nuevo Dispositivo</h2>
        <DeviceForm responsibles={responsibles} />
      </div>
    </AppLayout>
  )
}

