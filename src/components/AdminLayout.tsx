import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  LogOut, 
  GraduationCap, 
  Users, 
  IndianRupee, 
  LayoutDashboard,
  Bell,
  Settings,
  FileText,
  MessageSquare,
  Menu,
  X,
  ChevronRight,
  Home
} from 'lucide-react'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { signOut, user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const navItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { path: '/admin/students', icon: Users, label: 'Students' },
    { path: '/admin/fees', icon: IndianRupee, label: 'Fee Collection' },
    { path: '/admin/fees/pending', icon: Bell, label: 'Pending Dues' },
    { path: '/admin/reminders', icon: MessageSquare, label: 'Reminders' },
    { path: '/admin/notices', icon: FileText, label: 'Notices' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' },
  ]

  const isActive = (path: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === path
    }
    return location.pathname.startsWith(path) && !navItems.some(item => 
      item.path !== path && item.path.startsWith(path) && location.pathname.startsWith(item.path)
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-72 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 text-white 
        transform transition-all duration-300 ease-out shadow-2xl
        lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-700/50">
            <Link to="/admin" className="flex items-center group">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2.5 rounded-xl shadow-lg group-hover:shadow-emerald-500/25 transition-all duration-300">
                <GraduationCap className="h-7 w-7 text-white" />
              </div>
              <div className="ml-3">
                <span className="font-bold text-xl block leading-tight text-white">MRA Admin</span>
                <span className="text-gray-400 text-xs">Student Management</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto hide-scrollbar">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-3">
              Main Menu
            </div>
            {navItems.slice(0, 4).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  group flex items-center px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive(item.path, item.exact)
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/20'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }
                `}
              >
                <item.icon className={`h-5 w-5 mr-3 transition-transform duration-200 ${isActive(item.path, item.exact) ? '' : 'group-hover:scale-110'}`} />
                <span className="font-medium">{item.label}</span>
                {isActive(item.path, item.exact) && (
                  <ChevronRight className="h-4 w-4 ml-auto" />
                )}
              </Link>
            ))}
            
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mt-6 mb-3">
              Management
            </div>
            {navItems.slice(4).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  group flex items-center px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive(item.path, item.exact)
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/20'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }
                `}
              >
                <item.icon className={`h-5 w-5 mr-3 transition-transform duration-200 ${isActive(item.path, item.exact) ? '' : 'group-hover:scale-110'}`} />
                <span className="font-medium">{item.label}</span>
                {isActive(item.path, item.exact) && (
                  <ChevronRight className="h-4 w-4 ml-auto" />
                )}
              </Link>
            ))}
          </nav>

          {/* User & Logout */}
          <div className="p-4 border-t border-gray-700/50">
            <div className="bg-gray-800/50 rounded-xl p-4 mb-3">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-semibold">
                  {user?.email?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">Admin</p>
                  <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                to="/"
                className="flex-1 flex items-center justify-center px-3 py-2.5 text-gray-300 hover:text-white hover:bg-gray-800 rounded-xl transition-all"
              >
                <Home className="h-4 w-4 mr-2" />
                Website
              </Link>
              <button
                onClick={handleSignOut}
                className="flex-1 flex items-center justify-center px-3 py-2.5 text-red-400 hover:text-white hover:bg-red-600/20 rounded-xl transition-all"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 lg:px-8 py-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl hover:bg-gray-100 mr-4 transition-colors"
              >
                <Menu className="h-6 w-6 text-gray-600" />
              </button>
              <div className="hidden lg:block">
                <h1 className="text-xl font-bold text-gray-900">
                  {navItems.find(item => isActive(item.path, item.exact))?.label || 'Dashboard'}
                </h1>
                <p className="text-sm text-gray-500">
                  {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <div className="lg:hidden flex items-center">
                <GraduationCap className="h-6 w-6 text-emerald-600" />
                <span className="ml-2 font-bold text-gray-900">MRA Admin</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="relative p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="hidden sm:flex items-center pl-3 border-l border-gray-200">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-semibold text-sm">
                  {user?.email?.charAt(0).toUpperCase() || 'A'}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
