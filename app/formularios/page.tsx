import { prisma } from '@/lib/prisma'
import AppLayout from '@/components/AppLayout'
import Link from 'next/link'
import { Plus, FileText, Eye, Trash2 } from 'lucide-react'
import FormActions from '@/components/FormActions'

async function getForms() {
  return await prisma.deliveryReturnForm.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export default async function FormulariosPage() {
  const forms = await getForms()

  return (
    <AppLayout title="Formularios">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Formularios de Entrega y Devolución</h2>
          <Link href="/formularios/nuevo" className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            Nuevo Formulario
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
                    Fecha de creación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {forms.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                      No hay formularios registrados
                    </td>
                  </tr>
                ) : (
                  forms.map((form) => (
                    <tr key={form.id} className="table-row">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <FileText className="text-primary" size={18} />
                          <span className="font-medium text-gray-900">{form.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-700">
                          {new Date(form.createdAt).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <FormActions formId={form.id} fileUrl={form.fileUrl} />
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

