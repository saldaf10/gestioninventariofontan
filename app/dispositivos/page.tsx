import { prisma } from '@/lib/prisma'
import AppLayout from '@/components/AppLayout'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import DeviceListGrouped from '@/components/DeviceListGrouped'

export const dynamic = 'force-dynamic'

async function getDevices() {
  return await prisma.device.findMany({
    include: {
      responsible: true,
    },
    orderBy: {
      code: 'asc',
    },
  })
}

export default async function DispositivosPage() {
  const devices = await getDevices()

  return (
    <AppLayout title="Dispositivos">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Lista de Dispositivos</h2>
          <Link href="/dispositivos/nuevo" className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            Nuevo Dispositivo
          </Link>
        </div>

        <DeviceListGrouped devices={devices} />
      </div>
    </AppLayout>
  )
}

