import React, { useState, useEffect } from 'react'
import { Bell, Send, CheckCircle, Clock, AlertCircle, Phone, MessageSquare, Settings } from 'lucide-react'
import { supabase, Student, FeePayment, FeeReminder, ReminderSettings } from '../lib/supabase'

interface StudentWithDues {
  student: Student
  pendingPayments: FeePayment[]
  totalPending: number
  lastReminder?: FeeReminder
}

export default function Reminders() {
  const [studentsWithDues, setStudentsWithDues] = useState<StudentWithDues[]>([])
  const [reminders, setReminders] = useState<FeeReminder[]>([])
  const [settings, setSettings] = useState<ReminderSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<'pending' | 'history' | 'settings'>('pending')
  const [showSendModal, setShowSendModal] = useState(false)
  const [reminderType, setReminderType] = useState<'sms' | 'whatsapp' | 'both'>('whatsapp')
  const [customMessage, setCustomMessage] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch students with pending dues
      const { data: students } = await supabase
        .from('students')
        .select('*')
        .eq('status', 'active')
        .order('name')

      // Fetch pending payments
      const { data: payments } = await supabase
        .from('fee_payments')
        .select('*')
        .in('payment_status', ['pending', 'partial'])

      // Fetch recent reminders
      const { data: recentReminders } = await supabase
        .from('fee_reminders')
        .select('*')
        .order('sent_at', { ascending: false })
        .limit(100)

      // Fetch reminder settings
      const { data: reminderSettings } = await supabase
        .from('reminder_settings')
        .select('*')
        .single()

      // Group pending payments by student
      const studentDuesMap: { [key: string]: StudentWithDues } = {}
      
      students?.forEach(student => {
        const studentPayments = payments?.filter(p => p.student_id === student.id) || []
        if (studentPayments.length > 0) {
          const totalPending = studentPayments.reduce((sum, p) => sum + (p.amount - (p.paid_amount || 0)), 0)
          const lastReminder = recentReminders?.find(r => r.student_id === student.id)
          
          studentDuesMap[student.id] = {
            student,
            pendingPayments: studentPayments,
            totalPending,
            lastReminder
          }
        }
      })

      setStudentsWithDues(Object.values(studentDuesMap))
      setReminders(recentReminders || [])
      setSettings(reminderSettings)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectAll = () => {
    if (selectedStudents.length === studentsWithDues.length) {
      setSelectedStudents([])
    } else {
      setSelectedStudents(studentsWithDues.map(s => s.student.id))
    }
  }

  const handleSelectStudent = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    )
  }

  const generateMessage = (student: Student, totalDue: number) => {
    const defaultMessage = `Dear Parent,\n\nThis is a reminder that ₹${totalDue.toLocaleString('en-IN')} is pending for ${student.full_name} (Roll: ${student.roll_number}).\n\nPlease pay at your earliest convenience.\n\nRegards,\nMadrasa Administration`
    return customMessage || defaultMessage
  }

  const sendReminders = async () => {
    if (selectedStudents.length === 0) return
    
    setSending(true)
    try {
      const selectedStudentData = studentsWithDues.filter(s => 
        selectedStudents.includes(s.student.id)
      )

      // Create reminder records
      const reminderRecords = selectedStudentData.map(s => ({
        student_id: s.student.id,
        reminder_type: reminderType === 'both' ? 'sms' : reminderType,
        message: generateMessage(s.student, s.totalPending),
        sent_to: s.student.phone || '',
        status: 'sent',
        sent_at: new Date().toISOString()
      }))

      const { error } = await supabase
        .from('fee_reminders')
        .insert(reminderRecords)

      if (error) throw error

      // In a real app, you would integrate with SMS/WhatsApp API here
      // For now, we'll just show a success message
      
      alert(`Successfully sent ${selectedStudents.length} reminder(s)!`)
      setSelectedStudents([])
      setShowSendModal(false)
      fetchData()
    } catch (error) {
      console.error('Error sending reminders:', error)
      alert('Failed to send reminders. Please try again.')
    } finally {
      setSending(false)
    }
  }

  const saveSettings = async () => {
    if (!settings) return
    
    try {
      const { error } = await supabase
        .from('reminder_settings')
        .upsert({
          id: settings.id || undefined,
          reminder_frequency: settings.reminder_frequency,
          reminder_day: settings.reminder_day,
          sms_enabled: settings.sms_enabled,
          email_enabled: settings.email_enabled,
          reminder_message_template: settings.reminder_message_template
        })

      if (error) throw error
      alert('Settings saved successfully!')
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Failed to save settings.')
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getDaysSinceLastReminder = (lastReminder?: FeeReminder) => {
    if (!lastReminder) return null
    const days = Math.floor((Date.now() - new Date(lastReminder.sent_at).getTime()) / (1000 * 60 * 60 * 24))
    return days
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
          <h1 className="text-2xl font-bold text-gray-900">Fee Reminders</h1>
          <p className="text-gray-600 mt-1">Send payment reminders to parents</p>
        </div>
        {activeTab === 'pending' && selectedStudents.length > 0 && (
          <button
            onClick={() => setShowSendModal(true)}
            className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Send className="h-5 w-5 mr-2" />
            Send Reminder ({selectedStudents.length})
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'pending', label: 'Pending Dues', icon: AlertCircle },
            { id: 'history', label: 'Reminder History', icon: Clock },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`
                flex items-center pb-3 px-1 border-b-2 font-medium text-sm transition-colors
                ${activeTab === tab.id
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Pending Dues Tab */}
      {activeTab === 'pending' && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {studentsWithDues.length === 0 ? (
            <div className="p-12 text-center">
              <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No Pending Dues</h3>
              <p className="text-gray-500 mt-1">All students have cleared their fees!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedStudents.length === studentsWithDues.length}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pending Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Reminder
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {studentsWithDues.map(({ student, totalPending, lastReminder }) => {
                    const daysSince = getDaysSinceLastReminder(lastReminder)
                    return (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedStudents.includes(student.id)}
                            onChange={() => handleSelectStudent(student.id)}
                            className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900">{student.full_name}</div>
                            <div className="text-sm text-gray-500">
                              Roll #{student.roll_number} • {student.class_level}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="h-4 w-4 mr-1" />
                            {student.phone || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-lg font-semibold text-red-600">
                            ₹{totalPending.toLocaleString('en-IN')}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {lastReminder ? (
                            <div>
                              <div className="text-sm text-gray-900">
                                {daysSince === 0 ? 'Today' : daysSince === 1 ? 'Yesterday' : `${daysSince} days ago`}
                              </div>
                              <div className="text-xs text-gray-500">
                                via {lastReminder.reminder_type}
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">Never sent</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => {
                              setSelectedStudents([student.id])
                              setShowSendModal(true)
                            }}
                            className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                          >
                            Send Reminder
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {reminders.length === 0 ? (
            <div className="p-12 text-center">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No Reminders Sent</h3>
              <p className="text-gray-500 mt-1">You haven't sent any reminders yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sent Via
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reminders.map(reminder => (
                    <tr key={reminder.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {reminder.student_id}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                          {reminder.reminder_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(reminder.sent_at)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          reminder.status === 'sent' ? 'bg-green-100 text-green-800' :
                          reminder.status === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {reminder.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Reminder Settings</h3>
          
          <div className="space-y-6">
            {/* Reminder Frequency */}
            <div>
              <label className="block font-medium text-gray-900 mb-2">Reminder Frequency</label>
              <select
                value={settings?.reminder_frequency || 'weekly'}
                onChange={(e) => setSettings(prev => prev ? { ...prev, reminder_frequency: e.target.value as 'weekly' | 'monthly' | 'manual' } : null)}
                className="w-full max-w-xs rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="manual">Manual Only</option>
              </select>
            </div>

            {/* Reminder Day */}
            <div>
              <label className="block font-medium text-gray-900 mb-2">Reminder Day of Month</label>
              <select
                value={settings?.reminder_day || 1}
                onChange={(e) => setSettings(prev => prev ? { ...prev, reminder_day: parseInt(e.target.value) } : null)}
                className="w-full max-w-xs rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              >
                {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Day of the month to send automatic reminders</p>
            </div>

            {/* Channels */}
            <div>
              <label className="block font-medium text-gray-900 mb-3">Notification Channels</label>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings?.sms_enabled ?? false}
                    onChange={(e) => setSettings(prev => prev ? { ...prev, sms_enabled: e.target.checked } : null)}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <Phone className="h-4 w-4 ml-3 mr-2 text-blue-600" />
                  <span>SMS</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings?.email_enabled ?? false}
                    onChange={(e) => setSettings(prev => prev ? { ...prev, email_enabled: e.target.checked } : null)}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <MessageSquare className="h-4 w-4 ml-3 mr-2 text-green-600" />
                  <span>Email</span>
                </label>
              </div>
            </div>

            {/* Default Message Template */}
            <div>
              <label className="block font-medium text-gray-900 mb-2">Default Message Template</label>
              <textarea
                value={settings?.reminder_message_template || ''}
                onChange={(e) => setSettings(prev => prev ? { ...prev, reminder_message_template: e.target.value } : null)}
                rows={5}
                placeholder="Dear Parent, This is a reminder that ₹{amount} is pending for {student_name}..."
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Use {'{student_name}'}, {'{amount}'}, {'{roll_number}'} as placeholders
              </p>
            </div>

            <button
              onClick={saveSettings}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Save Settings
            </button>
          </div>
        </div>
      )}

      {/* Send Reminder Modal */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Send Reminder</h3>
            
            <p className="text-gray-600 mb-4">
              Send reminder to {selectedStudents.length} student{selectedStudents.length > 1 ? 's' : ''}
            </p>

            {/* Reminder Type */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Send via</label>
              <div className="flex space-x-4">
                {[
                  { value: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
                  { value: 'sms', label: 'SMS', icon: Phone },
                  { value: 'both', label: 'Both', icon: Bell }
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => setReminderType(option.value as typeof reminderType)}
                    className={`flex items-center px-4 py-2 rounded-lg border-2 transition-colors ${
                      reminderType === option.value
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <option.icon className="h-4 w-4 mr-2" />
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Message */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Message (Optional)
              </label>
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={4}
                placeholder="Leave empty to use default template..."
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowSendModal(false)
                  setCustomMessage('')
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={sendReminders}
                disabled={sending}
                className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {sending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
