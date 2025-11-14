'use client'

import { useEffect, useState } from 'react'

export default function Header({ title }: { title: string }) {
  const [username, setUsername] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => setUsername(data.username))
      .catch(() => setUsername(null))
  }, [])

  return (
    <header className="bg-primary text-white px-6 py-4 shadow-md">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{title}</h1>
        {username && (
          <div className="flex items-center gap-4">
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
              Sesión: {username}
            </span>
          </div>
        )}
      </div>
    </header>
  )
}

