import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { LogIn, GraduationCap, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signIn } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await signIn(email, password)
    
    if (error) {
      setError(error.message)
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-700 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-hero-pattern opacity-30"></div>
        
        {/* Decorative circles */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-emerald-500/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-teal-500/30 rounded-full blur-3xl"></div>
        
        <div className="relative flex flex-col justify-center items-center w-full px-12 text-white">
          <Link to="/" className="absolute top-8 left-8 flex items-center text-white/80 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Website
          </Link>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white/10 backdrop-blur-lg rounded-3xl mb-8 shadow-2xl">
              <GraduationCap className="h-14 w-14 text-yellow-400" />
            </div>
            
            <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Amiri', serif" }}>
              مدرسہ رحمانیہ عربیہ
            </h1>
            <h2 className="text-2xl font-semibold mb-4">Madrasa Rahmania Arabia</h2>
            <p className="text-emerald-100 text-lg max-w-sm">
              Student Management System for Kambipur Trust
            </p>
            
            <div className="mt-12 grid grid-cols-3 gap-8">
              {[
                { value: '500+', label: 'Students' },
                { value: '25+', label: 'Staff' },
                { value: '15+', label: 'Years' },
              ].map((stat, idx) => (
                <div key={idx}>
                  <div className="text-3xl font-bold text-yellow-400">{stat.value}</div>
                  <div className="text-sm text-emerald-200">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile header */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Website
            </Link>
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-4 rounded-2xl shadow-lg">
                <GraduationCap className="h-10 w-10 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Madrasa Rahmania</h1>
            <p className="text-gray-500">Kambipur Trust</p>
          </div>
          
          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
              <p className="text-gray-500 mt-2">Sign in to access the admin panel</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center animate-fade-in">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3.5 px-4 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center group"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                ) : (
                  <>
                    <LogIn className="h-5 w-5 mr-2 group-hover:translate-x-0.5 transition-transform" />
                    Sign In
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Don't have an account?{' '}
                <Link to="/signup" className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors">
                  Create Account
                </Link>
              </p>
            </div>
          </div>
          
          {/* Footer */}
          <p className="text-center text-sm text-gray-400 mt-8">
            © {new Date().getFullYear()} Kambipur Trust. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}

