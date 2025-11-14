import { prisma } from '@/lib/prisma'
import AppLayout from '@/components/AppLayout'
import Link from 'next/link'
import { Plus, Eye, Edit, Trash2 } from 'lucide-react'
import DeviceActions from '@/components/DeviceActions'

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

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Propietario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Responsable
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Renting
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {devices.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No hay dispositivos registrados
                    </td>
                  </tr>
                ) : (
                  devices.map((device) => (
                    <tr key={device.id} className="table-row">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-medium text-primary">{device.code}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-700">{device.ownerType}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {device.responsible ? (
                          <Link
                            href={`/responsables/${device.responsible.id}`}
                            className="text-accent hover:underline"
                          >
                            {device.responsible.name}
                          </Link>
                        ) : (
                          <span className="text-gray-400">Sin asignar</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {device.isExternalRenting ? (
                          <div className="text-sm">
                            <span className="text-accent font-medium">{device.rentingCompany}</span>
                            {device.returnDueDate && (
                              <div className="text-gray-500 text-xs">
                                {new Date(device.returnDueDate).toLocaleDateString('es-ES')}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <DeviceActions deviceId={device.id} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

