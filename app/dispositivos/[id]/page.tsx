import { prisma } from '@/lib/prisma'
import AppLayout from '@/components/AppLayout'
import Link from 'next/link'
import { Edit, Trash2, ArrowLeft } from 'lucide-react'
import DeviceActions from '@/components/DeviceActions'

async function getDevice(id: string) {
  return await prisma.device.findUnique({
    where: { id },
    include: {
      responsible: true,
    },
  })
}

export default async function DeviceDetailPage({ params }: { params: { id: string } }) {
  const device = await getDevice(params.id)

  if (!device) {
    return (
      <AppLayout title="Dispositivo no encontrado">
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Dispositivo no encontrado</p>
          <Link href="/dispositivos" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft size={18} />
            Volver a la lista
          </Link>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout title={`Dispositivo ${device.code}`}>
      <div className="max-w-3xl space-y-6">
        <Link
          href="/dispositivos"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
        >
          <ArrowLeft size={18} />
          Volver a la lista
        </Link>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Detalle del Dispositivo</h2>
            <DeviceActions deviceId={device.id} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Código</label>
              <p className="text-lg font-semibold text-primary">{device.code}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Propietario</label>
              <p className="text-lg font-semibold text-gray-800">{device.ownerType}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Responsable</label>
              {device.responsible ? (
                <Link
                  href={`/responsables/${device.responsible.id}`}
                  className="text-lg font-semibold text-accent hover:underline"
                >
                  {device.responsible.name}
                </Link>
              ) : (
                <p className="text-lg text-gray-400">Sin asignar</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Renting Externo</label>
              <p className="text-lg font-semibold text-gray-800">
                {device.isExternalRenting ? 'Sí' : 'No'}
              </p>
            </div>

            {device.isExternalRenting && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Empresa que lo rentó
                  </label>
                  <p className="text-lg font-semibold text-gray-800">
                    {device.rentingCompany || 'No especificada'}
                  </p>
                </div>

                {device.returnDueDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Fecha de devolución
                    </label>
                    <p className="text-lg font-semibold text-gray-800">
                      {new Date(device.returnDueDate).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                )}
              </>
            )}

            {device.observations && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-500 mb-1">Observaciones</label>
                <p className="text-gray-800 whitespace-pre-wrap">{device.observations}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Fecha de creación</label>
              <p className="text-gray-600">
                {new Date(device.createdAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Última actualización</label>
              <p className="text-gray-600">
                {new Date(device.updatedAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

