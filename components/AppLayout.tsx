import Sidebar from './Sidebar'
import Header from './Header'

export default function AppLayout({
  children,
  title,
}: {
  children: React.ReactNode
  title: string
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title={title} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}

