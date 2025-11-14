'use client'

import Link from 'next/link'
import { Eye, Edit, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function ResponsibleActions({ responsibleId }: { responsibleId: string }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('¿Está seguro de que desea eliminar este responsable? Los dispositivos asociados quedarán sin responsable.')) {
      return
    }

    setDeleting(true)
    try {
      const response = await fetch(`/api/responsables/${responsibleId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Responsable eliminado correctamente')
        router.refresh()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Error al eliminar responsable')
      }
    } catch (error) {
      toast.error('Error al eliminar responsable')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/responsables/${responsibleId}`}
        className="p-2 text-accent hover:bg-accent/10 rounded transition-colors"
        title="Ver detalle"
      >
        <Eye size={18} />
      </Link>
      <Link
        href={`/responsables/${responsibleId}/editar`}
        className="p-2 text-primary hover:bg-primary/10 rounded transition-colors"
        title="Editar"
      >
        <Edit size={18} />
      </Link>
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

