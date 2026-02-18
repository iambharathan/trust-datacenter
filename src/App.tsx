import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'

// Public Pages
import Home from './pages/Home'
import About from './pages/About'
import Admissions from './pages/Admissions'
import Contact from './pages/Contact'
import Notices from './pages/Notices'

// Auth Pages
import Login from './components/Login'
import Signup from './components/Signup'

// Admin Components
import AdminLayout from './components/AdminLayout'
import Dashboard from './components/admin/Dashboard'
import StudentsList from './components/StudentsList'
import StudentForm from './components/StudentForm'
import StudentDetail from './components/StudentDetail'
import StudentFees from './components/StudentFees'
import MonthlyRegister from './components/MonthlyRegister'
import PendingDues from './components/PendingDues'
import Reminders from './components/Reminders'
import AdminNotices from './components/AdminNotices'
import AdminSettings from './components/AdminSettings'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  return user ? <>{children}</> : <Navigate to="/login" />
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  return user ? <Navigate to="/admin" /> : <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Website Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/admissions" element={<Admissions />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/notices" element={<Notices />} />

      {/* Auth Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/students"
        element={
          <PrivateRoute>
            <AdminLayout>
              <StudentsList />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/students/new"
        element={
          <PrivateRoute>
            <AdminLayout>
              <StudentForm />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/students/:id"
        element={
          <PrivateRoute>
            <AdminLayout>
              <StudentDetail />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/students/:id/edit"
        element={
          <PrivateRoute>
            <AdminLayout>
              <StudentForm />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/students/:id/fees"
        element={
          <PrivateRoute>
            <AdminLayout>
              <StudentFees />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/fees"
        element={
          <PrivateRoute>
            <AdminLayout>
              <MonthlyRegister />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/fees/pending"
        element={
          <PrivateRoute>
            <AdminLayout>
              <PendingDues />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/reminders"
        element={
          <PrivateRoute>
            <AdminLayout>
              <Reminders />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/notices"
        element={
          <PrivateRoute>
            <AdminLayout>
              <AdminNotices />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <PrivateRoute>
            <AdminLayout>
              <AdminSettings />
            </AdminLayout>
          </PrivateRoute>
        }
      />

      {/* Redirect old routes */}
      <Route path="/students" element={<Navigate to="/admin/students" />} />
      <Route path="/students/*" element={<Navigate to="/admin/students" />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App