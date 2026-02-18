import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle, Clock, AlertCircle, Plus } from 'lucide-react'
import { supabase, Student, FeePayment, MONTHS, PAYMENT_MODES, PAYMENT_STATUSES } from '../lib/supabase'

export default function StudentFees() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [student, setStudent] = useState<Student | null>(null)
  const [payments, setPayments] = useState<FeePayment[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)

  useEffect(() => {
    fetchStudentAndPayments()
  }, [id, selectedYear])

  const fetchStudentAndPayments = async () => {
    try {
      const [studentRes, paymentsRes] = await Promise.all([
        supabase.from('students').select('*').eq('id', id).single(),
        supabase
          .from('fee_payments')
          .select('*')
          .eq('student_id', id)
          .eq('year', selectedYear)
          .order('created_at', { ascending: false })
      ])

      if (studentRes.error) throw studentRes.error
      setStudent(studentRes.data)
      setPayments(paymentsRes.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPaymentForMonth = (month: string) => {
    return payments.find(p => p.month_name === month && p.fee_type === 'monthly')
  }

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'partial':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
    }
  }

  const getStatusBadge = (status: string) => {
    const statusInfo = PAYMENT_STATUSES.find(s => s.value === status)
    const colors: Record<string, string> = {
      green: 'bg-green-100 text-green-800',
      red: 'bg-red-100 text-red-800',
      yellow: 'bg-yellow-100 text-yellow-800'
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[statusInfo?.color || 'red']}`}>
        {statusInfo?.label || status}
      </span>
    )
  }

  const calculateTotals = () => {
    const totalDue = MONTHS.length * (student?.monthly_fee_amount || 0)
    const totalPaid = payments.reduce((sum, p) => {
      if (p.payment_status === 'paid') return sum + p.amount
      if (p.payment_status === 'partial') return sum + (p.partial_amount || 0)
      return sum
    }, 0)
    const totalPending = payments.reduce((sum, p) => {
      if (p.payment_status === 'pending') return sum + p.amount
      if (p.payment_status === 'partial') return sum + (p.amount - (p.partial_amount || 0))
      return sum
    }, 0)
    return { totalDue, totalPaid, totalPending }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Student not found</p>
        <Link to="/admin/students" className="text-emerald-600 hover:underline mt-2 inline-block">
          Go back to students list
        </Link>
      </div>
    )
  }

  const totals = calculateTotals()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Fee Management</h1>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Record Payment
          </button>
        </div>
      </div>

      {/* Student Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{student.full_name}</h2>
            <p className="text-gray-500">
              Roll #{student.roll_number} • {student.class_level} • {student.academic_year}
            </p>
            <p className="text-gray-500 text-sm mt-1">
              Father: {student.father_name} • Phone: {student.phone}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Monthly Fee</p>
            <p className="text-2xl font-bold text-emerald-600">
              ₹{student.monthly_fee_amount?.toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm text-gray-500">Total Paid ({selectedYear})</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            ₹{totals.totalPaid.toLocaleString('en-IN')}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm text-gray-500">Total Pending</p>
          <p className="text-2xl font-bold text-red-600 mt-1">
            ₹{totals.totalPending.toLocaleString('en-IN')}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm text-gray-500">Yearly Due</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            ₹{totals.totalDue.toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* Monthly Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Fee Status - {selectedYear}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {MONTHS.map((month) => {
            const payment = getPaymentForMonth(month)
            const isPaid = payment?.payment_status === 'paid'
            const isPartial = payment?.payment_status === 'partial'
            const isPending = payment?.payment_status === 'pending'

            return (
              <div
                key={month}
                className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                  isPaid
                    ? 'border-green-200 bg-green-50'
                    : isPartial
                    ? 'border-yellow-200 bg-yellow-50'
                    : isPending
                    ? 'border-red-200 bg-red-50'
                    : 'border-gray-200 bg-gray-50 hover:border-emerald-300'
                }`}
                onClick={() => !isPaid && setShowAddModal(true)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{month}</span>
                  {getStatusIcon(payment?.payment_status)}
                </div>
                {payment ? (
                  <div className="text-sm">
                    <p className={isPaid ? 'text-green-600' : isPartial ? 'text-yellow-600' : 'text-red-600'}>
                      {isPaid ? 'Paid' : isPartial ? `Partial: ₹${payment.partial_amount}` : 'Pending'}
                    </p>
                    {payment.payment_date && (
                      <p className="text-gray-500 text-xs mt-1">{payment.payment_date}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">Not recorded</p>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Payment History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Month/Year</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mode</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No payments recorded for {selectedYear}
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {payment.month_name} {payment.year}
                    </td>
                    <td className="px-6 py-4 capitalize">{payment.fee_type}</td>
                    <td className="px-6 py-4 font-medium">
                      ₹{payment.amount.toLocaleString('en-IN')}
                      {payment.partial_amount && payment.partial_amount > 0 && (
                        <span className="text-sm text-gray-500 ml-1">
                          (Paid: ₹{payment.partial_amount})
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(payment.payment_status)}</td>
                    <td className="px-6 py-4 text-gray-500">{payment.payment_date || '-'}</td>
                    <td className="px-6 py-4 text-gray-500 capitalize">{payment.payment_mode || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Payment Modal */}
      {showAddModal && (
        <AddPaymentModal
          student={student}
          year={selectedYear}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false)
            fetchStudentAndPayments()
          }}
        />
      )}
    </div>
  )
}

// Add Payment Modal Component
function AddPaymentModal({ 
  student, 
  year, 
  onClose, 
  onSuccess 
}: { 
  student: Student
  year: number
  onClose: () => void
  onSuccess: () => void 
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    month_name: MONTHS[new Date().getMonth()],
    fee_type: 'monthly',
    amount: student.monthly_fee_amount,
    payment_status: 'paid',
    payment_date: new Date().toISOString().split('T')[0],
    payment_mode: 'cash',
    partial_amount: 0,
    remarks: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' || name === 'partial_amount' ? parseFloat(value) || 0 : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error: insertError } = await supabase
        .from('fee_payments')
        .upsert([{
          student_id: student.id,
          year,
          ...formData
        }], {
          onConflict: 'student_id,fee_type,month_name,year'
        })

      if (insertError) throw insertError
      onSuccess()
    } catch (err: any) {
      console.error('Error recording payment:', err)
      setError(err.message || 'Failed to record payment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Record Payment</h2>
          <p className="text-gray-500 text-sm mt-1">{student.full_name} - {year}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
              <select
                name="month_name"
                value={formData.month_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                {MONTHS.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fee Type</label>
              <select
                name="fee_type"
                value={formData.fee_type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                <option value="monthly">Monthly</option>
                <option value="admission">Admission</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="payment_status"
                value={formData.payment_status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                {PAYMENT_STATUSES.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Mode</label>
              <select
                name="payment_mode"
                value={formData.payment_mode}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                {PAYMENT_MODES.map(mode => (
                  <option key={mode.value} value={mode.value}>{mode.label}</option>
                ))}
              </select>
            </div>
          </div>

          {formData.payment_status === 'partial' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Partial Amount Paid (₹)</label>
              <input
                type="number"
                name="partial_amount"
                value={formData.partial_amount}
                onChange={handleChange}
                min="0"
                max={formData.amount}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
            <input
              type="date"
              name="payment_date"
              value={formData.payment_date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Remarks (Optional)</label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              placeholder="Any additional notes..."
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
