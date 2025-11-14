'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function FormForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
  })
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.type !== 'application/pdf') {
        toast.error('Solo se permiten archivos PDF')
        return
      }
      setFile(selectedFile)
    }
  }

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || 'Error al subir archivo')
    }

    const data = await response.json()
    return data.url
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!file) {
      toast.error('Debe seleccionar un archivo PDF')
      setLoading(false)
      return
    }

    try {
      setUploading(true)
      const fileUrl = await uploadFile(file)
      setUploading(false)

      const response = await fetch('/api/formularios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          fileUrl,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Formulario creado correctamente')
        router.push('/formularios')
        router.refresh()
      } else {
        toast.error(data.error || 'Error al crear formulario')
      }
    } catch (error: any) {
      toast.error(error.message || 'Error al crear formulario')
    } finally {
      setLoading(false)
      setUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Nombre del Formulario <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="input-field"
          placeholder="Ej: Formulario estándar 2025, Entrega portátiles grado 9°"
          required
        />
      </div>

      <div>
        <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
          Archivo PDF <span className="text-red-500">*</span>
        </label>
        <input
          id="file"
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="input-field"
          required
        />
        <p className="mt-1 text-xs text-gray-500">
          {file ? `Archivo seleccionado: ${file.name}` : 'Seleccione un archivo PDF para subir'}
        </p>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={loading || uploading}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? 'Subiendo archivo...' : loading ? 'Guardando...' : 'Crear Formulario'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-secondary"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}

