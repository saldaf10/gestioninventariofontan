import { prisma } from '@/lib/prisma'
import AppLayout from '@/components/AppLayout'
import Link from 'next/link'
import { Smartphone, Users, Plus } from 'lucide-react'

async function getStats() {
  const [devices, responsibles, cfCount, rfCount, afCount] = await Promise.all([
    prisma.device.count(),
    prisma.responsible.count(),
    prisma.device.count({ where: { ownerType: 'Colegio Fontán' } }),
    prisma.device.count({ where: { ownerType: 'Renting Fontán' } }),
    prisma.device.count({ where: { ownerType: 'Asofontán' } }),
  ])

  return {
    totalDevices: devices,
    totalResponsibles: responsibles,
    cfCount,
    rfCount,
    afCount,
  }
}

export default async function DashboardPage() {
  const stats = await getStats()

  return (
    <AppLayout title="Dashboard">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Dispositivos</p>
                <p className="text-3xl font-bold text-primary">{stats.totalDevices}</p>
              </div>
              <div className="bg-primary/10 p-3 rounded-lg">
                <Smartphone className="text-primary" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Responsables</p>
                <p className="text-3xl font-bold text-primary">{stats.totalResponsibles}</p>
              </div>
              <div className="bg-primary/10 p-3 rounded-lg">
                <Users className="text-primary" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Colegio Fontán (CF)</p>
                <p className="text-3xl font-bold text-accent">{stats.cfCount}</p>
              </div>
              <div className="bg-accent/10 p-3 rounded-lg">
                <Smartphone className="text-accent" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Renting Fontán (RF)</p>
                <p className="text-3xl font-bold text-accent">{stats.rfCount}</p>
              </div>
              <div className="bg-accent/10 p-3 rounded-lg">
                <Smartphone className="text-accent" size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Distribución por Tipo</h2>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <p className="text-2xl font-bold text-primary">{stats.cfCount}</p>
              <p className="text-sm text-gray-600 mt-1">CF</p>
            </div>
            <div className="text-center p-4 bg-accent/5 rounded-lg">
              <p className="text-2xl font-bold text-accent">{stats.rfCount}</p>
              <p className="text-sm text-gray-600 mt-1">RF</p>
            </div>
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <p className="text-2xl font-bold text-primary">{stats.afCount}</p>
              <p className="text-sm text-gray-600 mt-1">AF</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/dispositivos/nuevo"
            className="bg-white p-6 rounded-lg shadow-sm border-2 border-dashed border-primary hover:border-solid hover:bg-primary/5 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                <Plus className="text-primary group-hover:text-white" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800 group-hover:text-primary transition-colors">
                  Agregar Dispositivo
                </h3>
                <p className="text-sm text-gray-600">Registrar un nuevo dispositivo en el inventario</p>
              </div>
            </div>
          </Link>

          <Link
            href="/responsables/nuevo"
            className="bg-white p-6 rounded-lg shadow-sm border-2 border-dashed border-accent hover:border-solid hover:bg-accent/5 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="bg-accent/10 p-3 rounded-lg group-hover:bg-accent group-hover:text-white transition-colors">
                <Plus className="text-accent group-hover:text-white" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800 group-hover:text-accent transition-colors">
                  Agregar Responsable
                </h3>
                <p className="text-sm text-gray-600">Registrar un nuevo responsable</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </AppLayout>
  )
}

