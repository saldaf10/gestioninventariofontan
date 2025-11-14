import { prisma } from '@/lib/prisma'
import AppLayout from '@/components/AppLayout'
import ResponsibleForm from '@/components/ResponsibleForm'
import { notFound } from 'next/navigation'

async function getResponsible(id: string) {
  return await prisma.responsible.findUnique({
    where: { id },
  })
}

export default async function EditarResponsiblePage({ params }: { params: { id: string } }) {
  const responsible = await getResponsible(params.id)

  if (!responsible) {
    notFound()
  }

  return (
    <AppLayout title={`Editar Responsable: ${responsible.name}`}>
      <div className="max-w-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Editar Responsable</h2>
        <ResponsibleForm responsible={responsible} />
      </div>
    </AppLayout>
  )
}

