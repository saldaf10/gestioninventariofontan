'use client'

import { Eye, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function FormActions({ formId, fileUrl }: { formId: string; fileUrl: string }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('¿Está seguro de que desea eliminar este formulario?')) {
      return
    }

    setDeleting(true)
    try {
      const response = await fetch(`/api/formularios/${formId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Formulario eliminado correctamente')
        router.refresh()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Error al eliminar formulario')
      }
    } catch (error) {
      toast.error('Error al eliminar formulario')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <a
        href={fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 text-accent hover:bg-accent/10 rounded transition-colors"
        title="Ver PDF"
      >
        <Eye size={18} />
      </a>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
        title="Eliminar"
      >
        <Trash2 size={18} />
      </button>
    </div>
  )
}

