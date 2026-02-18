import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  GraduationCap, 
  Bell,
  Calendar,
  ChevronRight
} from 'lucide-react'
import { supabase, Notice } from '../lib/supabase'

export default function Notices() {
  const [notices, setNotices] = useState<Notice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotices()
  }, [])

  const fetchNotices = async () => {
    try {
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .eq('is_published', true)
        .order('publish_date', { ascending: false })

      if (error) throw error
      setNotices(data || [])
    } catch (err) {
      console.error('Error fetching notices:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-emerald-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center">
              <GraduationCap className="h-8 w-8 text-yellow-400" />
              <span className="ml-2 text-xl font-bold">Madrasa Rahmania Arabia</span>
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="hover:text-yellow-400 transition">Home</Link>
              <Link to="/about" className="hover:text-yellow-400 transition">About</Link>
              <Link to="/admissions" className="hover:text-yellow-400 transition">Admissions</Link>
              <Link to="/notices" className="text-yellow-400">Notices</Link>
              <Link to="/contact" className="hover:text-yellow-400 transition">Contact</Link>
              <Link 
                to="/login" 
                className="bg-yellow-500 text-emerald-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition"
              >
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-700 to-emerald-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Notices & Announcements</h1>
          <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
            Stay updated with the latest news, events, and announcements from our institution.
          </p>
        </div>
      </section>

      {/* Notices List */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
          ) : notices.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600">No Notices Yet</h3>
              <p className="text-gray-500 mt-2">Check back later for updates and announcements.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {notices.map((notice) => (
                <div 
                  key={notice.id} 
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(notice.publish_date)}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {notice.title}
                      </h3>
                      <p className="text-gray-600 whitespace-pre-line">
                        {notice.content}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0 ml-4" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} Madrasa Rahmania Arabia - Kambipur Trust. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
