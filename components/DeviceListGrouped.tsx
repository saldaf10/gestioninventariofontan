'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronRight } from 'lucide-react'
import DeviceActions from '@/components/DeviceActions'
import type { Device, Responsible } from '@prisma/client'

type DeviceWithResponsible = Device & {
  responsible: Responsible | null
}

interface DeviceListGroupedProps {
  devices: DeviceWithResponsible[]
}

export default function DeviceListGrouped({ devices }: DeviceListGroupedProps) {
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

  const toggleSection = (section: string) => {
    setExpanded(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const renderDeviceTable = (devices: DeviceWithResponsible[]) => {
    if (devices.length === 0) {
      return (
        <div className="p-4 text-center text-gray-500 bg-white border-t border-gray-200">
          No hay dispositivos en esta categoría
        </div>
      )
    }

    return (
      <div className="overflow-x-auto bg-white border-t border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
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
            {devices.map((device) => (
              <tr key={device.id} className="hover:bg-gray-50">
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
    <div className="space-y-4">
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
    </div>
  )
}
