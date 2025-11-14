import AppLayout from '@/components/AppLayout'
import ResponsibleForm from '@/components/ResponsibleForm'

export default function NuevoResponsablePage() {
  return (
    <AppLayout title="Nuevo Responsable">
      <div className="max-w-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Registrar Nuevo Responsable</h2>
        <ResponsibleForm />
      </div>
    </AppLayout>
  )
}

