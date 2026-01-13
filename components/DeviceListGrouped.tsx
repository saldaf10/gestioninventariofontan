'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronRight, UserPlus, Check, X } from 'lucide-react'
import DeviceActions from '@/components/DeviceActions'
import type { Device, Responsible } from '@prisma/client'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

type DeviceWithResponsible = Device & {
  responsible: Responsible | null
}

interface DeviceListGroupedProps {
  devices: DeviceWithResponsible[]
}

export default function DeviceListGrouped({ devices }: DeviceListGroupedProps) {
  const router = useRouter()
  // Group devices by ownerType
  const groupedDevices = {
    'Colegio Fontán': devices.filter(d => d.ownerType === 'Colegio Fontán'),
    'Renting Fontán': devices.filter(d => d.ownerType === 'Renting Fontán'),
    'Asofontán': devices.filter(d => d.ownerType === 'Asofontán'),
    'Otros': devices.filter(d => !['Colegio Fontán', 'Renting Fontán', 'Asofontán'].includes(d.ownerType))
  }

  // State for expanded sections (all expanded by default)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    'Colegio Fontán': true,
    'Renting Fontán': true,
    'Asofontán': true,
    'Otros': true
  })

  // Selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [responsibles, setResponsibles] = useState<Responsible[]>([])
  const [targetResponsibleId, setTargetResponsibleId] = useState<string>('')
  const [isAssigning, setIsAssigning] = useState(false)

  useEffect(() => {
    const fetchResponsibles = async () => {
      try {
        const res = await fetch('/api/responsables')
        if (res.ok) {
          const data = await res.json()
          setResponsibles(data)
        }
      } catch (error) {
        console.error('Error fetching responsibles:', error)
      }
    }
    fetchResponsibles()
  }, [])

  const toggleSection = (section: string) => {
    setExpanded(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  const toggleAllInSection = (sectionDevices: DeviceWithResponsible[]) => {
    const sectionIds = sectionDevices.map(d => d.id)
    const allSelected = sectionIds.every(id => selectedIds.has(id))

    const newSelected = new Set(selectedIds)
    if (allSelected) {
      sectionIds.forEach(id => newSelected.delete(id))
    } else {
      sectionIds.forEach(id => newSelected.add(id))
    }
    setSelectedIds(newSelected)
  }

  const handleBulkAssign = async () => {
    if (!targetResponsibleId) {
      toast.error('Por favor selecciona un responsable')
      return
    }

    setIsAssigning(true)
    try {
      const res = await fetch('/api/dispositivos/bulk-assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceIds: Array.from(selectedIds),
          responsibleId: targetResponsibleId
        })
      })

      if (res.ok) {
        const data = await res.json()
        toast.success(data.message)
        setSelectedIds(new Set())
        setTargetResponsibleId('')
        router.refresh()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Error al asignar dispositivos')
      }
    } catch (error) {
      toast.error('Error al realizar la asignación')
    } finally {
      setIsAssigning(false)
    }
  }

  const renderDeviceTable = (groupDevices: DeviceWithResponsible[]) => {
    if (groupDevices.length === 0) {
      return (
        <div className="p-4 text-center text-gray-500 bg-white border-t border-gray-200">
          No hay dispositivos en esta categoría
        </div>
      )
    }

    const allInSectionSelected = groupDevices.every(d => selectedIds.has(d.id))
    const someInSectionSelected = groupDevices.some(d => selectedIds.has(d.id))

    return (
      <div className="overflow-x-auto bg-white border-t border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left w-10">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
                  checked={allInSectionSelected}
                  ref={el => {
                    if (el) el.indeterminate = someInSectionSelected && !allInSectionSelected
                  }}
                  onChange={() => toggleAllInSection(groupDevices)}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Código
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Responsable
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Renting
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {groupDevices.map((device) => (
              <tr key={device.id} className={`hover:bg-gray-50 ${selectedIds.has(device.id) ? 'bg-primary/5' : ''}`}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
                    checked={selectedIds.has(device.id)}
                    onChange={() => toggleSelection(device.id)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-medium text-primary">{device.code}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {device.responsible ? (
                    <Link
                      href={`/responsables/${device.responsible.id}`}
                      className="text-accent hover:underline"
                    >
                      {device.responsible.name}
                    </Link>
                  ) : (
                    <span className="text-gray-400">Sin asignar</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {device.isExternalRenting ? (
                    <div className="text-sm">
                      <span className="text-accent font-medium">{device.rentingCompany}</span>
                      {device.returnDueDate && (
                        <div className="text-gray-500 text-xs">
                          {new Date(device.returnDueDate).toLocaleDateString('es-ES')}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <DeviceActions deviceId={device.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="space-y-4 pb-20">
      {Object.entries(groupedDevices).map(([type, groupDevices]) => {
        if (type === 'Otros' && groupDevices.length === 0) return null

        return (
          <div key={type} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <button
              onClick={() => toggleSection(type)}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                {expanded[type] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                <h3 className="text-lg font-semibold text-gray-800">{type}</h3>
                <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                  {groupDevices.length}
                </span>
              </div>
            </button>

            {expanded[type] && renderDeviceTable(groupDevices)}
          </div>
        )
      })}

      {/* Floating Action Bar */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white border border-gray-200 rounded-full shadow-2xl px-6 py-3 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300 z-50">
          <div className="flex items-center gap-2 pr-4 border-r border-gray-200">
            <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
              {selectedIds.size}
            </span>
            <span className="text-sm font-medium text-gray-600">Equipos seleccionados</span>
          </div>

          <div className="flex items-center gap-3">
            <UserPlus size={18} className="text-gray-400" />
            <select
              className="text-sm border-gray-300 rounded-md focus:ring-primary focus:border-primary py-1 pl-2 pr-8"
              value={targetResponsibleId}
              onChange={(e) => setTargetResponsibleId(e.target.value)}
              disabled={isAssigning}
            >
              <option value="">Asignar a responsable...</option>
              {responsibles.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>

            <button
              onClick={handleBulkAssign}
              disabled={isAssigning || !targetResponsibleId}
              className="bg-primary hover:bg-primary-dark text-white text-sm font-semibold px-4 py-1.5 rounded-full transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAssigning ? 'Asignando...' : (
                <>
                  <Check size={16} />
                  Asignar
                </>
              )}
            </button>

            <button
              onClick={() => setSelectedIds(new Set())}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              title="Cancelar selección"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

