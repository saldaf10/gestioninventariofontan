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
  let stats;
  let error = false;

  try {
    stats = await getStats()
  } catch (e) {
    console.error('Error fetching dashboard stats:', e)
    error = true;
    stats = {
      totalDevices: 0,
      totalResponsibles: 0,
      cfCount: 0,
      rfCount: 0,
      afCount: 0,
    }
  }

  return (
    <AppLayout title="Dashboard">
      <div className="space-y-6">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  Error al cargar los datos. Es posible que la base de datos esté fuera de línea o haya alcanzado su límite de almacenamiento.
                </p>
              </div>
            </div>
          </div>
        )}
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

