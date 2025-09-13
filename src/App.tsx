import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Login from './components/Login'
import Layout from './components/Layout'
import StudentsList from './components/StudentsList'
import StudentForm from './components/StudentForm'
import StudentDetail from './components/StudentDetail'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return user ? <Navigate to="/students" /> : <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      
      <Route
        path="/students"
        element={
          <PrivateRoute>
            <Layout>
              <StudentsList />
            </Layout>
          </PrivateRoute>
        }
      />
      
      <Route
        path="/students/new"
        element={
          <PrivateRoute>
            <Layout>
              <StudentForm />
            </Layout>
          </PrivateRoute>
        }
      />
      
      <Route
        path="/students/:id"
        element={
          <PrivateRoute>
            <Layout>
              <StudentDetail />
            </Layout>
          </PrivateRoute>
        }
      />
      
      <Route
        path="/students/:id/edit"
        element={
          <PrivateRoute>
            <Layout>
              <StudentForm />
            </Layout>
          </PrivateRoute>
        }
      />
      
      <Route path="/" element={<Navigate to="/students" />} />
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