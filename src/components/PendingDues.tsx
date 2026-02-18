import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, Phone, Send, IndianRupee, CheckSquare, Square, MessageSquare } from 'lucide-react'
import { supabase, Student, FeePayment } from '../lib/supabase'

interface StudentWithDues {
  student: Student
  pendingPayments: FeePayment[]
  totalPending: number
}

export default function PendingDues() {
  const [studentsWithDues, setStudentsWithDues] = useState<StudentWithDues[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [classFilter, setClassFilter] = useState('all')
  const [classes, setClasses] = useState<string[]>([])
  const [showReminderModal, setShowReminderModal] = useState(false)

  useEffect(() => {
    fetchPendingDues()
  }, [])

  const fetchPendingDues = async () => {
    try {
      const { data: students, error: studentsError } = await supabase
        .from('students')
        .select(`
          *,
          fee_payments(*)
        `)
        .eq('status', 'active')

      if (studentsError) throw studentsError

      const withDues: StudentWithDues[] = (students || [])
        .map(student => {
          const pendingPayments = (student.fee_payments || []).filter(
            (p: FeePayment) => p.payment_status === 'pending' || p.payment_status === 'partial'
          )
          const totalPending = pendingPayments.reduce((sum: number, p: FeePayment) => {
            if (p.payment_status === 'pending') return sum + p.amount
            if (p.payment_status === 'partial') return sum + (p.amount - (p.partial_amount || 0))
            return sum
          }, 0)
          return {
            student,
            pendingPayments,
            totalPending
          }
        })
        .filter(s => s.totalPending > 0)
        .sort((a, b) => b.totalPending - a.totalPending)

      setStudentsWithDues(withDues)
      
      const uniqueClasses = Array.from(new Set(students?.map(s => s.class_level) || []))
      setClasses(uniqueClasses)
    } catch (error) {
      console.error('Error fetching pending dues:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredStudents = studentsWithDues.filter(s => 
    classFilter === 'all' || s.student.class_level === classFilter
  )

  const totalPendingAmount = filteredStudents.reduce((sum, s) => sum + s.totalPending, 0)

  const toggleSelectStudent = (id: string) => {
    setSelectedStudents(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([])
    } else {
      setSelectedStudents(filteredStudents.map(s => s.student.id))
    }
  }

  const handleSendReminders = async () => {
    const selectedData = studentsWithDues.filter(s => selectedStudents.includes(s.student.id))
    
    try {
      // Create reminder records
      const reminders = selectedData.map(s => ({
        student_id: s.student.id,
        reminder_type: 'manual',
        sent_to: s.student.phone,
        message: `Dear Parent, Fee of ₹${s.totalPending} is pending for ${s.student.full_name}. Please pay at the earliest.`,
        status: 'sent'
      }))

      const { error } = await supabase
        .from('fee_reminders')
        .insert(reminders)

      if (error) throw error

      alert(`Reminders logged for ${selectedData.length} students. SMS integration pending.`)
      setSelectedStudents([])
      setShowReminderModal(false)
    } catch (error) {
      console.error('Error sending reminders:', error)
      alert('Failed to send reminders')
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
            Pending Dues
          </h1>
          <p className="text-gray-500 mt-1">
            {filteredStudents.length} students with pending fees
          </p>
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
          {selectedStudents.length > 0 && (
            <button
              onClick={() => setShowReminderModal(true)}
              className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              <Send className="h-5 w-5 mr-2" />
              Send Reminders ({selectedStudents.length})
            </button>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-red-800 font-medium">Total Pending Amount</p>
            <p className="text-3xl font-bold text-red-600">
              ₹{totalPendingAmount.toLocaleString('en-IN')}
            </p>
          </div>
          <AlertCircle className="h-12 w-12 text-red-400" />
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <button
            onClick={toggleSelectAll}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            {selectedStudents.length === filteredStudents.length && filteredStudents.length > 0 ? (
              <CheckSquare className="h-5 w-5 mr-2 text-emerald-600" />
            ) : (
              <Square className="h-5 w-5 mr-2" />
            )}
            Select All
          </button>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="p-12 text-center">
            <AlertCircle className="h-12 w-12 text-green-400 mx-auto mb-3" />
            <p className="text-gray-500">No pending dues! All fees are collected. 🎉</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredStudents.map(({ student, pendingPayments, totalPending }) => (
              <div key={student.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => toggleSelectStudent(student.id)}
                    className="mt-1"
                  >
                    {selectedStudents.includes(student.id) ? (
                      <CheckSquare className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <Square className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link 
                          to={`/admin/students/${student.id}/fees`}
                          className="font-semibold text-gray-900 hover:text-emerald-600"
                        >
                          {student.full_name}
                        </Link>
                        <p className="text-sm text-gray-500">
                          Roll #{student.roll_number} • {student.class_level}
                        </p>
                        <p className="text-sm text-gray-500">
                          Father: {student.father_name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-red-600">
                          ₹{totalPending.toLocaleString('en-IN')}
                        </p>
                        <p className="text-sm text-gray-500">
                          {pendingPayments.length} month(s) pending
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {pendingPayments.map(payment => (
                        <span 
                          key={payment.id}
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            payment.payment_status === 'partial' 
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {payment.month_name} {payment.year}
                          {payment.payment_status === 'partial' && ` (Partial: ₹${payment.partial_amount})`}
                        </span>
                      ))}
                    </div>

                    <div className="mt-3 flex items-center gap-4 text-sm">
                      <a 
                        href={`tel:${student.phone}`}
                        className="flex items-center text-blue-600 hover:text-blue-700"
                      >
                        <Phone className="h-4 w-4 mr-1" />
                        {student.phone}
                      </a>
                      <Link
                        to={`/admin/students/${student.id}/fees`}
                        className="flex items-center text-emerald-600 hover:text-emerald-700"
                      >
                        <IndianRupee className="h-4 w-4 mr-1" />
                        Collect Fee
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reminder Modal */}
      {showReminderModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <MessageSquare className="h-6 w-6 text-orange-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Send Reminders</h2>
            </div>
            <p className="text-gray-600 mb-4">
              You are about to send fee reminders to <strong>{selectedStudents.length}</strong> students.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800 text-sm">
                <strong>Note:</strong> SMS integration is not yet configured. Reminders will be logged in the system for now.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowReminderModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSendReminders}
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                Send Reminders
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
