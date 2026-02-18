import React, { useState, useEffect } from 'react'
import { Save, Plus, Edit2, Trash2, GraduationCap, Calendar, IndianRupee, Settings, Building } from 'lucide-react'
import { supabase, ClassLevel, AcademicYear } from '../lib/supabase'

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState<'general' | 'classes' | 'academic'>('general')
  const [classLevels, setClassLevels] = useState<ClassLevel[]>([])
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // General settings
  const [generalSettings, setGeneralSettings] = useState({
    instituteName: 'Madrasa',
    instituteAddress: '',
    institutePhone: '',
    instituteEmail: '',
    defaultMonthlyFee: 1000
  })

  // Class form
  const [showClassModal, setShowClassModal] = useState(false)
  const [editingClass, setEditingClass] = useState<ClassLevel | null>(null)
  const [classForm, setClassForm] = useState({
    name: '',
    description: '',
    monthly_fee: 0,
    order_index: 0
  })

  // Academic year form
  const [showYearModal, setShowYearModal] = useState(false)
  const [editingYear, setEditingYear] = useState<AcademicYear | null>(null)
  const [yearForm, setYearForm] = useState({
    year_name: '',
    start_date: '',
    end_date: '',
    is_current: false
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [classesRes, yearsRes] = await Promise.all([
        supabase.from('class_levels').select('*').order('order_index'),
        supabase.from('academic_years').select('*').order('year_name', { ascending: false })
      ])

      setClassLevels(classesRes.data || [])
      setAcademicYears(yearsRes.data || [])
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  // Class Level Functions
  const openNewClass = () => {
    setEditingClass(null)
    setClassForm({ name: '', description: '', monthly_fee: 0, order_index: classLevels.length })
    setShowClassModal(true)
  }

  const openEditClass = (cls: ClassLevel) => {
    setEditingClass(cls)
    setClassForm({
      name: cls.name,
      description: cls.description || '',
      monthly_fee: cls.monthly_fee,
      order_index: cls.order_index
    })
    setShowClassModal(true)
  }

  const saveClass = async () => {
    if (!classForm.name) {
      alert('Class name is required')
      return
    }

    setSaving(true)
    try {
      if (editingClass) {
        const { error } = await supabase
          .from('class_levels')
          .update(classForm)
          .eq('id', editingClass.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('class_levels')
          .insert(classForm)
        if (error) throw error
      }
      setShowClassModal(false)
      fetchData()
    } catch (error) {
      console.error('Error saving class:', error)
      alert('Failed to save class')
    } finally {
      setSaving(false)
    }
  }

  const deleteClass = async (cls: ClassLevel) => {
    if (!window.confirm('Are you sure you want to delete this class?')) return

    try {
      const { error } = await supabase
        .from('class_levels')
        .delete()
        .eq('id', cls.id)
      if (error) throw error
      fetchData()
    } catch (error) {
      console.error('Error deleting class:', error)
      alert('Cannot delete class. It may have students assigned.')
    }
  }

  // Academic Year Functions
  const openNewYear = () => {
    setEditingYear(null)
    const currentYear = new Date().getFullYear()
    setYearForm({
      year_name: `${currentYear}-${currentYear + 1}`,
      start_date: `${currentYear}-04-01`,
      end_date: `${currentYear + 1}-03-31`,
      is_current: false
    })
    setShowYearModal(true)
  }

  const openEditYear = (year: AcademicYear) => {
    setEditingYear(year)
    setYearForm({
      year_name: year.year_name,
      start_date: year.start_date.split('T')[0],
      end_date: year.end_date.split('T')[0],
      is_current: year.is_current
    })
    setShowYearModal(true)
  }

  const saveYear = async () => {
    if (!yearForm.year_name || !yearForm.start_date || !yearForm.end_date) {
      alert('All fields are required')
      return
    }

    setSaving(true)
    try {
      // If marking as current, unmark others
      if (yearForm.is_current) {
        await supabase
          .from('academic_years')
          .update({ is_current: false })
          .neq('id', editingYear?.id || '')
      }

      if (editingYear) {
        const { error } = await supabase
          .from('academic_years')
          .update(yearForm)
          .eq('id', editingYear.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('academic_years')
          .insert(yearForm)
        if (error) throw error
      }
      setShowYearModal(false)
      fetchData()
    } catch (error) {
      console.error('Error saving year:', error)
      alert('Failed to save academic year')
    } finally {
      setSaving(false)
    }
  }

  const deleteYear = async (year: AcademicYear) => {
    if (!window.confirm('Are you sure you want to delete this academic year?')) return

    try {
      const { error } = await supabase
        .from('academic_years')
        .delete()
        .eq('id', year.id)
      if (error) throw error
      fetchData()
    } catch (error) {
      console.error('Error deleting year:', error)
      alert('Cannot delete academic year. It may have students or payments assigned.')
    }
  }

  const setCurrentYear = async (year: AcademicYear) => {
    try {
      await supabase
        .from('academic_years')
        .update({ is_current: false })
        .neq('id', year.id)

      await supabase
        .from('academic_years')
        .update({ is_current: true })
        .eq('id', year.id)

      fetchData()
    } catch (error) {
      console.error('Error setting current year:', error)
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your institution settings</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'general', label: 'General', icon: Building },
            { id: 'classes', label: 'Class Levels', icon: GraduationCap },
            { id: 'academic', label: 'Academic Years', icon: Calendar }
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

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">General Settings</h3>
          <div className="space-y-4 max-w-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Institution Name</label>
              <input
                type="text"
                value={generalSettings.instituteName}
                onChange={(e) => setGeneralSettings({ ...generalSettings, instituteName: e.target.value })}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea
                value={generalSettings.instituteAddress}
                onChange={(e) => setGeneralSettings({ ...generalSettings, instituteAddress: e.target.value })}
                rows={3}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={generalSettings.institutePhone}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, institutePhone: e.target.value })}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={generalSettings.instituteEmail}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, instituteEmail: e.target.value })}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Default Monthly Fee (₹)</label>
              <input
                type="number"
                value={generalSettings.defaultMonthlyFee}
                onChange={(e) => setGeneralSettings({ ...generalSettings, defaultMonthlyFee: parseInt(e.target.value) })}
                className="w-full max-w-xs rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>
            <button
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Save className="h-4 w-4 inline mr-2" />
              Save Settings
            </button>
          </div>
        </div>
      )}

      {/* Class Levels */}
      {activeTab === 'classes' && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Class Levels</h3>
            <button
              onClick={openNewClass}
              className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Class
            </button>
          </div>

          {classLevels.length === 0 ? (
            <div className="p-12 text-center">
              <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No Classes</h3>
              <p className="text-gray-500 mt-1">Add your first class level to get started.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monthly Fee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {classLevels.map(cls => (
                  <tr key={cls.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-500">{cls.order_index + 1}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{cls.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{cls.description || '-'}</td>
                    <td className="px-6 py-4">
                      <span className="flex items-center text-emerald-600 font-medium">
                        <IndianRupee className="h-4 w-4" />
                        {cls.monthly_fee.toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openEditClass(cls)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteClass(cls)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Academic Years */}
      {activeTab === 'academic' && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Academic Years</h3>
            <button
              onClick={openNewYear}
              className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Academic Year
            </button>
          </div>

          {academicYears.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No Academic Years</h3>
              <p className="text-gray-500 mt-1">Add your first academic year to get started.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Year</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">End Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {academicYears.map(year => (
                  <tr key={year.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{year.year_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(year.start_date).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(year.end_date).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-6 py-4">
                      {year.is_current ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Current
                        </span>
                      ) : (
                        <button
                          onClick={() => setCurrentYear(year)}
                          className="text-sm text-emerald-600 hover:text-emerald-700"
                        >
                          Set as Current
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openEditYear(year)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteYear(year)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Class Modal */}
      {showClassModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingClass ? 'Edit Class' : 'Add Class'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={classForm.name}
                  onChange={(e) => setClassForm({ ...classForm, name: e.target.value })}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  placeholder="e.g., Hifz Year 1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={classForm.description}
                  onChange={(e) => setClassForm({ ...classForm, description: e.target.value })}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  placeholder="Optional description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Fee (₹)</label>
                  <input
                    type="number"
                    value={classForm.monthly_fee}
                    onChange={(e) => setClassForm({ ...classForm, monthly_fee: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                  <input
                    type="number"
                    value={classForm.order_index}
                    onChange={(e) => setClassForm({ ...classForm, order_index: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowClassModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={saveClass}
                disabled={saving}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Academic Year Modal */}
      {showYearModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingYear ? 'Edit Academic Year' : 'Add Academic Year'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year Name *</label>
                <input
                  type="text"
                  value={yearForm.year_name}
                  onChange={(e) => setYearForm({ ...yearForm, year_name: e.target.value })}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  placeholder="e.g., 2025-2026"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                  <input
                    type="date"
                    value={yearForm.start_date}
                    onChange={(e) => setYearForm({ ...yearForm, start_date: e.target.value })}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                  <input
                    type="date"
                    value={yearForm.end_date}
                    onChange={(e) => setYearForm({ ...yearForm, end_date: e.target.value })}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_current"
                  checked={yearForm.is_current}
                  onChange={(e) => setYearForm({ ...yearForm, is_current: e.target.checked })}
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="is_current" className="ml-2 text-sm text-gray-700">
                  Set as current academic year
                </label>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowYearModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={saveYear}
                disabled={saving}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
