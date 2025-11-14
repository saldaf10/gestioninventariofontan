import { prisma } from '@/lib/prisma'
import AppLayout from '@/components/AppLayout'
import Link from 'next/link'
import { ArrowLeft, FileText, Smartphone } from 'lucide-react'
import ResponsibleActions from '@/components/ResponsibleActions'

async function getResponsible(id: string) {
  return await prisma.responsible.findUnique({
    where: { id },
    include: {
      devices: {
        orderBy: {
          code: 'asc',
        },
      },
    },
  })
}

export default async function ResponsibleDetailPage({ params }: { params: { id: string } }) {
  const responsible = await getResponsible(params.id)

  if (!responsible) {
    return (
      <AppLayout title="Responsable no encontrado">
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Responsable no encontrado</p>
          <Link href="/responsables" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft size={18} />
            Volver a la lista
          </Link>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout title={`Responsable: ${responsible.name}`}>
      <div className="max-w-4xl space-y-6">
        <Link
          href="/responsables"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
        >
          <ArrowLeft size={18} />
          Volver a la lista
        </Link>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Detalle del Responsable</h2>
            <ResponsibleActions responsibleId={responsible.id} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Nombre</label>
              <p className="text-lg font-semibold text-gray-800">{responsible.name}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Taller</label>
              <p className="text-lg font-semibold text-gray-800">{responsible.taller}</p>
            </div>

            {responsible.associatedDocumentUrl && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Documento Asociado
                </label>
                <a
                  href={responsible.associatedDocumentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-accent hover:underline"
                >
                  <FileText size={18} />
                  Ver/Descargar PDF
                </a>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Smartphone size={20} />
              Dispositivos Asignados ({responsible.devices.length})
            </h3>

            {responsible.devices.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No hay dispositivos asignados</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Código
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Propietario
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Acción
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {responsible.devices.map((device) => (
                      <tr key={device.id} className="table-row">
                        <td className="px-4 py-3">
                          <span className="font-medium text-primary">{device.code}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-700">{device.ownerType}</span>
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            href={`/dispositivos/${device.id}`}
                            className="text-accent hover:underline text-sm"
                          >
                            Ver detalle
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

