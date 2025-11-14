'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { validateDeviceCode, getOwnerTypeFromCode } from '@/lib/utils'
import type { Device, Responsible } from '@prisma/client'

interface DeviceFormProps {
  device?: Device & { responsible?: Responsible | null }
  responsibles: Responsible[]
}

export default function DeviceForm({ device, responsibles }: DeviceFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    code: device?.code || '',
    responsibleId: device?.responsibleId || '',
    observations: device?.observations || '',
    isExternalRenting: device?.isExternalRenting || false,
    rentingCompany: device?.rentingCompany || '',
    returnDueDate: device?.returnDueDate
      ? new Date(device.returnDueDate).toISOString().split('T')[0]
      : '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!validateDeviceCode(formData.code)) {
      toast.error('El código debe tener el formato CF-XXX, RF-XXX o AF-XXX (donde XXX son números)')
      setLoading(false)
      return
    }

    try {
      const payload = {
        ...formData,
        responsibleId: formData.responsibleId || null,
        returnDueDate: formData.returnDueDate || null,
      }

      const url = device ? `/api/dispositivos/${device.id}` : '/api/dispositivos'
      const method = device ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(device ? 'Dispositivo actualizado correctamente' : 'Dispositivo creado correctamente')
        router.push('/dispositivos')
        router.refresh()
      } else {
        toast.error(data.error || 'Error al guardar dispositivo')
      }
    } catch (error) {
      toast.error('Error al guardar dispositivo')
    } finally {
      setLoading(false)
    }
  }

  const ownerType = formData.code ? getOwnerTypeFromCode(formData.code) : ''

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-6">
      <div>
        <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
          Código <span className="text-red-500">*</span>
        </label>
        <input
          id="code"
          type="text"
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
          className="input-field"
          placeholder="CF-001, RF-001, AF-001"
          required
          disabled={!!device}
        />
        {formData.code && ownerType && (
          <p className="mt-1 text-sm text-gray-600">
            Tipo de propietario: <span className="font-medium text-primary">{ownerType}</span>
          </p>
        )}
      </div>

      <div>
        <label htmlFor="responsibleId" className="block text-sm font-medium text-gray-700 mb-2">
          Responsable
        </label>
        <select
          id="responsibleId"
          value={formData.responsibleId}
          onChange={(e) => setFormData({ ...formData, responsibleId: e.target.value })}
          className="input-field"
        >
          <option value="">Sin asignar</option>
          {responsibles.map((responsible) => (
            <option key={responsible.id} value={responsible.id}>
              {responsible.name} - {responsible.taller}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="observations" className="block text-sm font-medium text-gray-700 mb-2">
          Observaciones
        </label>
        <textarea
          id="observations"
          value={formData.observations}
          onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
          className="input-field"
          rows={4}
          placeholder="Observaciones adicionales sobre el dispositivo..."
        />
      </div>

      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center gap-3 mb-4">
          <input
            type="checkbox"
            id="isExternalRenting"
            checked={formData.isExternalRenting}
            onChange={(e) => setFormData({ ...formData, isExternalRenting: e.target.checked })}
            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
          />
          <label htmlFor="isExternalRenting" className="text-sm font-medium text-gray-700">
            Es renting externo
          </label>
        </div>

        {formData.isExternalRenting && (
          <div className="space-y-4 pl-7">
            <div>
              <label htmlFor="rentingCompany" className="block text-sm font-medium text-gray-700 mb-2">
                Empresa que lo rentó
              </label>
              <input
                id="rentingCompany"
                type="text"
                value={formData.rentingCompany}
                onChange={(e) => setFormData({ ...formData, rentingCompany: e.target.value })}
                className="input-field"
                placeholder="Nombre de la empresa"
              />
            </div>

            <div>
              <label htmlFor="returnDueDate" className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de devolución estipulada
              </label>
              <input
                id="returnDueDate"
                type="date"
                value={formData.returnDueDate}
                onChange={(e) => setFormData({ ...formData, returnDueDate: e.target.value })}
                className="input-field"
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Guardando...' : device ? 'Actualizar' : 'Crear'}
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

