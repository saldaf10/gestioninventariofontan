'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import type { Responsible } from '@prisma/client'

interface ResponsibleFormProps {
  responsible?: Responsible
}

export default function ResponsibleForm({ responsible }: ResponsibleFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    name: responsible?.name || '',
    taller: responsible?.taller || '',
    associatedDocumentUrl: responsible?.associatedDocumentUrl || '',
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

    try {
      let documentUrl = formData.associatedDocumentUrl

      // Upload new file if provided
      if (file) {
        setUploading(true)
        documentUrl = await uploadFile(file)
        setUploading(false)
      }

      const payload = {
        name: formData.name,
        taller: formData.taller,
        associatedDocumentUrl: documentUrl || null,
      }

      const url = responsible ? `/api/responsables/${responsible.id}` : '/api/responsables'
      const method = responsible ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(responsible ? 'Responsable actualizado correctamente' : 'Responsable creado correctamente')
        router.push('/responsables')
        router.refresh()
      } else {
        toast.error(data.error || 'Error al guardar responsable')
      }
    } catch (error: any) {
      toast.error(error.message || 'Error al guardar responsable')
    } finally {
      setLoading(false)
      setUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Nombre <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="input-field"
          placeholder="Nombre del responsable"
          required
        />
      </div>

      <div>
        <label htmlFor="taller" className="block text-sm font-medium text-gray-700 mb-2">
          Taller <span className="text-red-500">*</span>
        </label>
        <input
          id="taller"
          type="text"
          value={formData.taller}
          onChange={(e) => setFormData({ ...formData, taller: e.target.value })}
          className="input-field"
          placeholder="Grupo, taller o dependencia"
          required
        />
      </div>

      <div>
        <label htmlFor="document" className="block text-sm font-medium text-gray-700 mb-2">
          Documento Asociado (PDF)
        </label>
        {responsible?.associatedDocumentUrl && !file && (
          <div className="mb-3 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Documento actual:</p>
            <a
              href={responsible.associatedDocumentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline text-sm"
            >
              {responsible.associatedDocumentUrl.split('/').pop()}
            </a>
          </div>
        )}
        <input
          id="document"
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="input-field"
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
          {uploading ? 'Subiendo archivo...' : loading ? 'Guardando...' : responsible ? 'Actualizar' : 'Crear'}
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

