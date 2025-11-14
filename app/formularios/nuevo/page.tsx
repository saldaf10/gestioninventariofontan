import AppLayout from '@/components/AppLayout'
import FormForm from '@/components/FormForm'

export default function NuevoFormularioPage() {
  return (
    <AppLayout title="Nuevo Formulario">
      <div className="max-w-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Subir Nuevo Formulario</h2>
        <FormForm />
      </div>
    </AppLayout>
  )
}

