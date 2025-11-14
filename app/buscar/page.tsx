'use client'

import { useState } from 'react'
import AppLayout from '@/components/AppLayout'
import { Search, Smartphone, User } from 'lucide-react'
import Link from 'next/link'
import type { Device, Responsible } from '@prisma/client'

interface SearchResults {
  devices?: (Device & { responsible?: Responsible | null })[]
  responsibles?: (Responsible & { devices: Device[] })[]
}

export default function BuscarPage() {
  const [searchType, setSearchType] = useState<'code' | 'responsible'>('code')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<SearchResults | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    try {
      const response = await fetch(
        `/api/buscar?type=${searchType}&q=${encodeURIComponent(query)}`
      )
      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error('Error searching:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppLayout title="Buscar">
      <div className="max-w-4xl space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Búsqueda</h2>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de búsqueda
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="searchType"
                    value="code"
                    checked={searchType === 'code'}
                    onChange={(e) => {
                      setSearchType('code')
                      setResults(null)
                    }}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="flex items-center gap-2">
                    <Smartphone size={18} />
                    Por código de dispositivo
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="searchType"
                    value="responsible"
                    checked={searchType === 'responsible'}
                    onChange={(e) => {
                      setSearchType('responsible')
                      setResults(null)
                    }}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="flex items-center gap-2">
                    <User size={18} />
                    Por nombre de responsable
                  </span>
                </label>
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="input-field flex-1"
                placeholder={
                  searchType === 'code'
                    ? 'Ingrese el código (ej: CF-001)'
                    : 'Ingrese el nombre del responsable'
                }
              />
              <button type="submit" className="btn-primary flex items-center gap-2" disabled={loading}>
                <Search size={20} />
                {loading ? 'Buscando...' : 'Buscar'}
              </button>
            </div>
          </form>
        </div>

        {results && (
          <div className="space-y-6">
            {searchType === 'code' && results.devices && (
              <div>
                {results.devices.length === 0 ? (
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
                    <p className="text-gray-600">No se encontró ningún dispositivo con ese código</p>
                  </div>
                ) : (
                  results.devices.map((device) => (
                    <div
                      key={device.id}
                      className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-primary">{device.code}</h3>
                        <Link href={`/dispositivos/${device.id}`} className="btn-accent text-sm">
                          Ver detalle completo
                        </Link>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">
                            Propietario
                          </label>
                          <p className="text-gray-800">{device.ownerType}</p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">
                            Responsable
                          </label>
                          {device.responsible ? (
                            <Link
                              href={`/responsables/${device.responsible.id}`}
                              className="text-accent hover:underline"
                            >
                              {device.responsible.name}
                            </Link>
                          ) : (
                            <p className="text-gray-400">Sin asignar</p>
                          )}
                        </div>

                        {device.observations && (
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-500 mb-1">
                              Observaciones
                            </label>
                            <p className="text-gray-800">{device.observations}</p>
                          </div>
                        )}

                        {device.isExternalRenting && (
                          <>
                            {device.rentingCompany && (
                              <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">
                                  Empresa de renting
                                </label>
                                <p className="text-gray-800">{device.rentingCompany}</p>
                              </div>
                            )}
                            {device.returnDueDate && (
                              <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">
                                  Fecha de devolución
                                </label>
                                <p className="text-gray-800">
                                  {new Date(device.returnDueDate).toLocaleDateString('es-ES')}
                                </p>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {searchType === 'responsible' && results.responsibles && (
              <div>
                {results.responsibles.length === 0 ? (
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
                    <p className="text-gray-600">No se encontraron responsables con ese nombre</p>
                  </div>
                ) : (
                  results.responsibles.map((responsible) => (
                    <div
                      key={responsible.id}
                      className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-primary">{responsible.name}</h3>
                          <p className="text-gray-600">{responsible.taller}</p>
                        </div>
                        <Link href={`/responsables/${responsible.id}`} className="btn-accent text-sm">
                          Ver detalle completo
                        </Link>
                      </div>

                      {responsible.associatedDocumentUrl && (
                        <div className="mb-4">
                          <a
                            href={responsible.associatedDocumentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent hover:underline text-sm"
                          >
                            Ver documento asociado (PDF)
                          </a>
                        </div>
                      )}

                      <div className="border-t border-gray-200 pt-4">
                        <h4 className="font-bold text-gray-800 mb-3">
                          Dispositivos ({responsible.devices.length})
                        </h4>
                        {responsible.devices.length === 0 ? (
                          <p className="text-gray-500">No hay dispositivos asignados</p>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                    Código
                                  </th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                    Propietario
                                  </th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                    Acción
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {responsible.devices.map((device) => (
                                  <tr key={device.id} className="table-row">
                                    <td className="px-4 py-2">
                                      <span className="font-medium text-primary">{device.code}</span>
                                    </td>
                                    <td className="px-4 py-2">
                                      <span className="text-sm text-gray-700">{device.ownerType}</span>
                                    </td>
                                    <td className="px-4 py-2">
                                      <Link
                                        href={`/dispositivos/${device.id}`}
                                        className="text-accent hover:underline text-sm"
                                      >
                                        Ver detalle
                                      </Link>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  )
}

