import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { supabase, Student, FeePayment } from '../lib/supabase'
import { ArrowLeft, Edit, Calendar, Phone, Mail, MapPin, User, CreditCard, BookOpen, CheckCircle, XCircle, Clock } from 'lucide-react'

export default function StudentDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [student, setStudent] = useState<Student | null>(null)
  const [payments, setPayments] = useState<FeePayment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (id) { fetchStudentData(id) }
  }, [id])

  const fetchStudentData = async (studentId: string) => {
    try {
      const { data: studentData, error: studentError } = await supabase.from('students').select('*').eq('id', studentId).single()
      if (studentError) throw studentError
      setStudent(studentData)
      const { data: paymentsData, error: paymentsError } = await supabase.from('fee_payments').select('*').eq('student_id', studentId).order('year', { ascending: false }).limit(12)
      if (paymentsError) throw paymentsError
      setPayments(paymentsData || [])
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    if (status === 'active') return 'bg-green-100 text-green-800'
    if (status === 'left') return 'bg-red-100 text-red-800'
    if (status === 'completed') return 'bg-blue-100 text-blue-800'
    return 'bg-gray-100 text-gray-800'
  }

  const getPaymentStatusIcon = (status: string) => {
    if (status === 'paid') return <CheckCircle className="w-4 h-4 text-green-600" />
    if (status === 'pending') return <XCircle className="w-4 h-4 text-red-600" />
    if (status === 'partial') return <Clock className="w-4 h-4 text-amber-600" />
    return null
  }

  const getPaymentStatusColor = (status: string) => {
    if (status === 'paid') return 'bg-green-100 text-green-800'
    if (status === 'pending') return 'bg-red-100 text-red-800'
    if (status === 'partial') return 'bg-amber-100 text-amber-800'
    return 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (<div className="flex justify-center items-center min-h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div></div>)
  }

  if (error) {
    return (<div className="bg-red-50 border border-red-200 rounded-lg p-4"><p className="text-red-600">Error: {error}</p><button onClick={() => navigate('/admin/students')} className="mt-2 text-red-600 underline">Back</button></div>)
  }

  if (!student) {
    return (<div className="text-center py-8"><p className="text-gray-600">Student not found</p><Link to="/admin/students" className="text-emerald-600 underline">Back</Link></div>)
  }

  const pendingPayments = payments.filter(p => p.payment_status === 'pending' || p.payment_status === 'partial')
  const totalPending = pendingPayments.reduce((sum, p) => {
    if (p.payment_status === 'pending') return sum + p.amount
    if (p.payment_status === 'partial') return sum + (p.amount - (p.partial_amount || 0))
    return sum
  }, 0)

  const feesLink = '/admin/students/' + student.id + '/fees'
  const editLink = '/admin/students/' + student.id + '/edit'

  return (
    <div>
      <div className="mb-6">
        <Link to="/admin/students" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft className="w-4 h-4 mr-1" />Back to Students
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{student.full_name}</h1>
            <p className="text-gray-600">Roll No: {student.roll_number} | {student.class_level}</p>
          </div>
          <div className="flex gap-2">
            <Link to={feesLink} className="inline-flex items-center px-4 py-2 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50">
              <CreditCard className="w-4 h-4 mr-2" />Manage Fees
            </Link>
            <Link to={editLink} className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
              <Edit className="w-4 h-4 mr-2" />Edit
            </Link>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"><User className="w-5 h-5 mr-2 text-emerald-600" />Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><p className="text-sm text-gray-500">Full Name</p><p className="text-gray-900 font-medium">{student.full_name}</p></div>
              <div><p className="text-sm text-gray-500">Father Name</p><p className="text-gray-900">{student.father_name}</p></div>
              {student.guardian_name && <div><p className="text-sm text-gray-500">Guardian Name</p><p className="text-gray-900">{student.guardian_name}</p></div>}
              <div><p className="text-sm text-gray-500">Status</p><span className={'inline-flex px-2 py-1 text-xs font-medium rounded-full ' + getStatusColor(student.status)}>{student.status}</span></div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"><Phone className="w-5 h-5 mr-2 text-emerald-600" />Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start"><Phone className="w-4 h-4 text-gray-400 mr-2 mt-1" /><div><p className="text-sm text-gray-500">Phone</p><p className="text-gray-900">{student.phone}</p></div></div>
              {student.alternate_phone && <div className="flex items-start"><Phone className="w-4 h-4 text-gray-400 mr-2 mt-1" /><div><p className="text-sm text-gray-500">Alt Phone</p><p className="text-gray-900">{student.alternate_phone}</p></div></div>}
              {student.email && <div className="flex items-start"><Mail className="w-4 h-4 text-gray-400 mr-2 mt-1" /><div><p className="text-sm text-gray-500">Email</p><p className="text-gray-900">{student.email}</p></div></div>}
              {student.address && <div className="flex items-start md:col-span-2"><MapPin className="w-4 h-4 text-gray-400 mr-2 mt-1" /><div><p className="text-sm text-gray-500">Address</p><p className="text-gray-900">{student.address}</p></div></div>}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"><BookOpen className="w-5 h-5 mr-2 text-emerald-600" />Academic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start"><Calendar className="w-4 h-4 text-gray-400 mr-2 mt-1" /><div><p className="text-sm text-gray-500">Date of Joining</p><p className="text-gray-900">{new Date(student.date_of_joining).toLocaleDateString('en-IN')}</p></div></div>
              <div><p className="text-sm text-gray-500">Academic Year</p><p className="text-gray-900">{student.academic_year}</p></div>
              <div><p className="text-sm text-gray-500">Class Level</p><p className="text-gray-900">{student.class_level}</p></div>
              <div><p className="text-sm text-gray-500">Roll Number</p><p className="text-gray-900">{student.roll_number}</p></div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center"><CreditCard className="w-5 h-5 mr-2 text-emerald-600" />Recent Payments</h2>
              <Link to={feesLink} className="text-emerald-600 hover:text-emerald-800 text-sm">View All</Link>
            </div>
            {payments.length === 0 ? (<p className="text-gray-500 text-center py-4">No payment records</p>) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead><tr className="border-b border-gray-200"><th className="text-left py-2 text-sm font-medium text-gray-500">Month</th><th className="text-left py-2 text-sm font-medium text-gray-500">Amount</th><th className="text-left py-2 text-sm font-medium text-gray-500">Status</th><th className="text-left py-2 text-sm font-medium text-gray-500">Date</th></tr></thead>
                  <tbody>{payments.slice(0, 6).map((p) => (<tr key={p.id} className="border-b border-gray-100"><td className="py-3 text-sm">{p.month_name} {p.year}</td><td className="py-3 text-sm">Rs.{p.amount}</td><td className="py-3"><span className={'inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ' + getPaymentStatusColor(p.payment_status)}>{getPaymentStatusIcon(p.payment_status)}<span className="ml-1">{p.payment_status}</span></span></td><td className="py-3 text-sm text-gray-500">{p.payment_date ? new Date(p.payment_date).toLocaleDateString('en-IN') : '-'}</td></tr>))}</tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Fee Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center"><span className="text-gray-600">Monthly Fee</span><span className="font-semibold text-gray-900">Rs.{student.monthly_fee_amount}</span></div>
              {(student.admission_fee_amount ?? 0) > 0 && <div className="flex justify-between items-center"><span className="text-gray-600">Admission Fee</span><span className="font-semibold text-gray-900">Rs.{student.admission_fee_amount}</span></div>}
              <hr className="border-gray-200" />
              <div className="flex justify-between items-center"><span className="text-gray-600">Pending Dues</span><span className={'font-semibold ' + (totalPending > 0 ? 'text-red-600' : 'text-green-600')}>Rs.{totalPending}</span></div>
              <div className="flex justify-between items-center"><span className="text-gray-600">Pending Months</span><span className="font-semibold text-gray-900">{pendingPayments.length}</span></div>
            </div>
            <Link to={feesLink} className="mt-4 w-full inline-flex justify-center items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"><CreditCard className="w-4 h-4 mr-2" />Collect Fee</Link>
          </div>
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg shadow-sm p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">Quick Info</h3>
            <div className="space-y-3">
              <div className="flex items-center"><BookOpen className="w-4 h-4 mr-3 opacity-80" /><span>{student.class_level}</span></div>
              <div className="flex items-center"><Calendar className="w-4 h-4 mr-3 opacity-80" /><span>Joined: {new Date(student.date_of_joining).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span></div>
              <div className="flex items-center"><Phone className="w-4 h-4 mr-3 opacity-80" /><span>{student.phone}</span></div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
            <div className="space-y-2">
              <Link to={editLink} className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"><Edit className="w-4 h-4 mr-2" />Edit Student</Link>
              <Link to={feesLink} className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"><CreditCard className="w-4 h-4 mr-2" />Fee Management</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
