import React, { useState, useEffect } from 'react'
import { Download, Search, CheckCircle, XCircle, Clock } from 'lucide-react'
import { supabase, Student, FeePayment, MONTHS } from '../lib/supabase'

interface RegisterEntry {
  student: Student
  payment?: FeePayment
}

export default function MonthlyRegister() {
  const [entries, setEntries] = useState<RegisterEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[new Date().getMonth()])
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [classFilter, setClassFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [classes, setClasses] = useState<string[]>([])

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)

  useEffect(() => {
    fetchRegisterData()
  }, [selectedMonth, selectedYear])

  const fetchRegisterData = async () => {
    setLoading(true)
    try {
      // Fetch all active students
      const { data: students, error: studentsError } = await supabase
        .from('students')
        .select('*')
        .eq('status', 'active')
        .order('roll_number')

      if (studentsError) throw studentsError

      // Fetch payments for the selected month/year
      const { data: payments, error: paymentsError } = await supabase
        .from('fee_payments')
        .select('*')
        .eq('month_name', selectedMonth)
        .eq('year', selectedYear)
        .eq('fee_type', 'monthly')

      if (paymentsError) throw paymentsError

      // Combine students with their payments
      const registerEntries: RegisterEntry[] = (students || []).map(student => ({
        student,
        payment: payments?.find(p => p.student_id === student.id)
      }))

      setEntries(registerEntries)
      
      // Extract unique classes
      const uniqueClasses = Array.from(new Set(students?.map(s => s.class_level) || []))
      setClasses(uniqueClasses)
    } catch (error) {
      console.error('Error fetching register data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = 
      entry.student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.student.father_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.student.phone.includes(searchTerm)

    const matchesClass = classFilter === 'all' || entry.student.class_level === classFilter
    
    const paymentStatus = entry.payment?.payment_status || 'not_recorded'
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'paid' && paymentStatus === 'paid') ||
      (statusFilter === 'pending' && (paymentStatus === 'pending' || paymentStatus === 'not_recorded')) ||
      (statusFilter === 'partial' && paymentStatus === 'partial')

    return matchesSearch && matchesClass && matchesStatus
  })

  const summary = {
    total: filteredEntries.length,
    paid: filteredEntries.filter(e => e.payment?.payment_status === 'paid').length,
    pending: filteredEntries.filter(e => !e.payment || e.payment?.payment_status === 'pending').length,
    partial: filteredEntries.filter(e => e.payment?.payment_status === 'partial').length,
    totalCollected: filteredEntries.reduce((sum, e) => {
      if (e.payment?.payment_status === 'paid') return sum + e.payment.amount
      if (e.payment?.payment_status === 'partial') return sum + (e.payment.partial_amount || 0)
      return sum
    }, 0),
    totalPending: filteredEntries.reduce((sum, e) => {
      if (!e.payment || e.payment?.payment_status === 'pending') return sum + e.student.monthly_fee_amount
      if (e.payment?.payment_status === 'partial') return sum + (e.payment.amount - (e.payment.partial_amount || 0))
      return sum
    }, 0)
  }

  const getStatusBadge = (payment?: FeePayment) => {
    if (!payment) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          <XCircle className="h-3 w-3 mr-1" />
          Not Recorded
        </span>
      )
    }

    switch (payment.payment_status) {
      case 'paid':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Paid
          </span>
        )
      case 'partial':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Partial
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Pending
          </span>
        )
      default:
        return null
    }
  }

  const exportToCSV = () => {
    const headers = ['Roll #', 'Student Name', 'Father Name', 'Phone', 'Class', 'Fee Amount', 'Status', 'Amount Paid', 'Payment Date']
    const rows = filteredEntries.map(entry => [
      entry.student.roll_number,
      entry.student.full_name,
      entry.student.father_name,
      entry.student.phone,
      entry.student.class_level,
      entry.student.monthly_fee_amount,
      entry.payment?.payment_status || 'Not Recorded',
      entry.payment?.payment_status === 'paid' ? entry.payment.amount : (entry.payment?.partial_amount || 0),
      entry.payment?.payment_date || ''
    ])

    const csvContent = [
      `Monthly Fee Register - ${selectedMonth} ${selectedYear}`,
      '',
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `fee-register-${selectedMonth}-${selectedYear}.csv`
    a.click()
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Monthly Fee Register</h1>
          <p className="text-gray-500 mt-1">
            {selectedMonth} {selectedYear} - {filteredEntries.length} students
          </p>
        </div>
        <button
          onClick={exportToCSV}
          className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
        >
          <Download className="h-5 w-5 mr-2" />
          Export CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Total Students</p>
          <p className="text-2xl font-bold text-gray-900">{summary.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Paid</p>
          <p className="text-2xl font-bold text-green-600">{summary.paid}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Collected</p>
          <p className="text-2xl font-bold text-emerald-600">₹{summary.totalCollected.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-red-600">₹{summary.totalPending.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex gap-2">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            >
              {MONTHS.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, father's name, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Classes</option>
              {classes.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="partial">Partial</option>
            </select>
          </div>
        </div>
      </div>

      {/* Register Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll #</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Father Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fee</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paid</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-gray-500">
                    No records found
                  </td>
                </tr>
              ) : (
                filteredEntries.map((entry) => (
                  <tr key={entry.student.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">#{entry.student.roll_number}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{entry.student.full_name}</td>
                    <td className="px-4 py-3 text-gray-600">{entry.student.father_name}</td>
                    <td className="px-4 py-3 text-gray-600">{entry.student.phone}</td>
                    <td className="px-4 py-3 text-gray-600">{entry.student.class_level}</td>
                    <td className="px-4 py-3 text-gray-900">₹{entry.student.monthly_fee_amount}</td>
                    <td className="px-4 py-3">{getStatusBadge(entry.payment)}</td>
                    <td className="px-4 py-3">
                      {entry.payment?.payment_status === 'paid' ? (
                        <span className="text-green-600 font-medium">₹{entry.payment.amount}</span>
                      ) : entry.payment?.partial_amount ? (
                        <span className="text-yellow-600 font-medium">₹{entry.payment.partial_amount}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-sm">
                      {entry.payment?.payment_date || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
