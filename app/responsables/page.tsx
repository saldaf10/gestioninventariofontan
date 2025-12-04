import { prisma } from '@/lib/prisma'
import AppLayout from '@/components/AppLayout'
import Link from 'next/link'
import { Plus, FileText } from 'lucide-react'
import ResponsibleActions from '@/components/ResponsibleActions'

export const dynamic = 'force-dynamic'

async function getResponsibles() {
  return await prisma.responsible.findMany({
    include: {
      _count: {
        select: { devices: true },
      },
    },
    orderBy: {
      name: 'asc',
    },
  })
}

export default async function ResponsablesPage() {
  const responsibles = await getResponsibles()

  return (
    <AppLayout title="Responsables">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Lista de Responsables</h2>
          <Link href="/responsables/nuevo" className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            Nuevo Responsable
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Taller
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dispositivos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Documento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {responsibles.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No hay responsables registrados
                    </td>
                  </tr>
                ) : (
                  responsibles.map((responsible) => (
                    <tr key={responsible.id} className="table-row">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-medium text-gray-900">{responsible.name}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-700">{responsible.taller}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-700">{responsible._count.devices}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {responsible.associatedDocumentUrl ? (
                          <a
                            href={responsible.associatedDocumentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-accent hover:underline"
                          >
                            <FileText size={16} />
                            Ver PDF
                          </a>
                        ) : (
                          <span className="text-gray-400">Sin documento</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <ResponsibleActions responsibleId={responsible.id} />
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

