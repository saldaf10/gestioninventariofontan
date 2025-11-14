import Link from 'next/link'
import AppLayout from '@/components/AppLayout'

export default function NotFound() {
  return (
    <AppLayout title="Página no encontrada">
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-gray-600 mb-6">La página que buscas no existe</p>
        <Link href="/dashboard" className="btn-primary">
          Volver al Dashboard
        </Link>
      </div>
    </AppLayout>
  )
}

