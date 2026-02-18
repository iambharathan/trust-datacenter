import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Users, 
  IndianRupee, 
  AlertCircle, 
  TrendingUp,
  Calendar,
  Bell,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { supabase, Student, FeePayment } from '../../lib/supabase'

interface DashboardStats {
  totalStudents: number
  activeStudents: number
  totalCollected: number
  totalPending: number
  thisMonthCollection: number
  pendingReminders: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    activeStudents: 0,
    totalCollected: 0,
    totalPending: 0,
    thisMonthCollection: 0,
    pendingReminders: 0
  })
  const [recentPayments, setRecentPayments] = useState<(FeePayment & { student: Student })[]>([])
  const [pendingDues, setPendingDues] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const currentMonth = new Date().toLocaleString('en-US', { month: 'long' })
  const currentYear = new Date().getFullYear()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch students count
      const { count: totalStudents } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true })

      const { count: activeStudents } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')

      // Fetch payments summary
      const { data: payments } = await supabase
        .from('fee_payments')
        .select('*')

      const totalCollected = payments?.reduce((sum: number, p: FeePayment) => {
        if (p.payment_status === 'paid') return sum + p.amount
        if (p.payment_status === 'partial') return sum + (p.partial_amount || 0)
        return sum
      }, 0) || 0

      const totalPending = payments?.reduce((sum: number, p: FeePayment) => {
        if (p.payment_status === 'pending') return sum + p.amount
        if (p.payment_status === 'partial') return sum + (p.amount - (p.partial_amount || 0))
        return sum
      }, 0) || 0

      // This month's collection
      const thisMonthPayments = payments?.filter((p: FeePayment) => 
        p.month_name === currentMonth && p.year === currentYear
      ) || []
      
      const thisMonthCollection = thisMonthPayments.reduce((sum: number, p: FeePayment) => {
        if (p.payment_status === 'paid') return sum + p.amount
        if (p.payment_status === 'partial') return sum + (p.partial_amount || 0)
        return sum
      }, 0)

      // Recent payments
      const { data: recent } = await supabase
        .from('fee_payments')
        .select('*, student:students(*)')
        .eq('payment_status', 'paid')
        .order('payment_date', { ascending: false })
        .limit(5)

      // Students with pending dues
      const { data: studentsWithDues } = await supabase
        .from('students')
        .select(`
          *,
          fee_payments(*)
        `)
        .eq('status', 'active')

      const pendingList = studentsWithDues?.map((student: Student & { fee_payments?: FeePayment[] }) => {
        const pendingPayments = student.fee_payments?.filter(
          (p: FeePayment) => p.payment_status === 'pending' || p.payment_status === 'partial'
        ) || []
        const pendingAmount = pendingPayments.reduce((sum: number, p: FeePayment) => {
          if (p.payment_status === 'pending') return sum + p.amount
          if (p.payment_status === 'partial') return sum + (p.amount - (p.partial_amount || 0))
          return sum
        }, 0)
        return {
          ...student,
          pendingCount: pendingPayments.length,
          pendingAmount
        }
      }).filter((s: { pendingAmount: number }) => s.pendingAmount > 0).slice(0, 5) || []

      setStats({
        totalStudents: totalStudents || 0,
        activeStudents: activeStudents || 0,
        totalCollected,
        totalPending,
        thisMonthCollection,
        pendingReminders: pendingList.length
      })
      setRecentPayments(recent || [])
      setPendingDues(pendingList)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">{currentMonth} {currentYear}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Students</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalStudents}</p>
              <p className="text-sm text-green-600 mt-1">
                {stats.activeStudents} active
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">This Month Collection</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                ₹{stats.thisMonthCollection.toLocaleString('en-IN')}
              </p>
              <p className="text-sm text-green-600 mt-1 flex items-center">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                {currentMonth}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <IndianRupee className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Collected</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                ₹{stats.totalCollected.toLocaleString('en-IN')}
              </p>
              <p className="text-sm text-gray-500 mt-1">All time</p>
            </div>
            <div className="bg-emerald-100 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Dues</p>
              <p className="text-3xl font-bold text-red-600 mt-1">
                ₹{stats.totalPending.toLocaleString('en-IN')}
              </p>
              <p className="text-sm text-red-600 mt-1 flex items-center">
                <ArrowDownRight className="h-4 w-4 mr-1" />
                {stats.pendingReminders} students
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link
          to="/admin/students/new"
          className="bg-emerald-600 text-white p-4 rounded-lg text-center hover:bg-emerald-700 transition"
        >
          + Add New Student
        </Link>
        <Link
          to="/admin/fees/collect"
          className="bg-blue-600 text-white p-4 rounded-lg text-center hover:bg-blue-700 transition"
        >
          Collect Fee
        </Link>
        <Link
          to="/admin/fees/pending"
          className="bg-orange-600 text-white p-4 rounded-lg text-center hover:bg-orange-700 transition"
        >
          View Pending Dues
        </Link>
        <Link
          to="/admin/reminders"
          className="bg-purple-600 text-white p-4 rounded-lg text-center hover:bg-purple-700 transition"
        >
          Send Reminders
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Payments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Payments</h2>
              <Link to="/admin/fees" className="text-emerald-600 text-sm hover:underline">
                View All
              </Link>
            </div>
          </div>
          <div className="p-6">
            {recentPayments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No recent payments</p>
            ) : (
              <div className="space-y-4">
                {recentPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{payment.student?.full_name}</p>
                      <p className="text-sm text-gray-500">
                        {payment.month_name} {payment.year}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">
                        ₹{payment.amount.toLocaleString('en-IN')}
                      </p>
                      <p className="text-xs text-gray-500">{payment.payment_date}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pending Dues */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Bell className="h-5 w-5 mr-2 text-red-500" />
                Students with Pending Dues
              </h2>
              <Link to="/admin/fees/pending" className="text-emerald-600 text-sm hover:underline">
                View All
              </Link>
            </div>
          </div>
          <div className="p-6">
            {pendingDues.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No pending dues! 🎉</p>
            ) : (
              <div className="space-y-4">
                {pendingDues.map((student) => (
                  <div key={student.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{student.full_name}</p>
                      <p className="text-sm text-gray-500">
                        {student.pendingCount} month(s) pending
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-red-600">
                        ₹{student.pendingAmount.toLocaleString('en-IN')}
                      </p>
                      <Link 
                        to={`/admin/students/${student.id}/fees`}
                        className="text-xs text-emerald-600 hover:underline"
                      >
                        Collect Now
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Monthly Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-emerald-600" />
          Monthly Overview - {currentYear}
        </h2>
        <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-12 gap-2">
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, idx) => {
            const isCurrentMonth = idx === new Date().getMonth()
            const isPastMonth = idx < new Date().getMonth()
            return (
              <div
                key={month}
                className={`p-3 rounded-lg text-center text-sm ${
                  isCurrentMonth 
                    ? 'bg-emerald-600 text-white' 
                    : isPastMonth 
                      ? 'bg-gray-100 text-gray-600'
                      : 'bg-gray-50 text-gray-400'
                }`}
              >
                {month}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
