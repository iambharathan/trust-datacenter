import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase, Staff } from '../lib/supabase'
import { Plus, Search, Edit, Trash2, Eye, UserPlus, Users, GraduationCap, Shield, Wrench } from 'lucide-react'

export default function StaffList() {
  const [staff, setStaff] = useState<Staff[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [error, setError] = useState('')

  useEffect(() => {
    fetchStaff()
  }, [])

  const fetchStaff = async () => {
    try {
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setStaff(data || [])
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const deleteStaff = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this staff member?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('staff')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setStaff(staff.filter(member => member.id !== id))
    } catch (error: any) {
      setError(error.message)
    }
  }

  const getStaffIcon = (type: string) => {
    switch (type) {
      case 'teacher':
        return <GraduationCap className="h-5 w-5 text-blue-600" />
      case 'servant':
        return <Wrench className="h-5 w-5 text-green-600" />
      case 'trustee':
        return <Shield className="h-5 w-5 text-purple-600" />
      default:
        return <Users className="h-5 w-5 text-gray-600" />
    }
  }

  const getStaffTypeColor = (type: string) => {
    switch (type) {
      case 'teacher':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'servant':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'trustee':
        return 'bg-purple-50 text-purple-700 border-purple-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const filteredStaff = staff.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.department?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterType === 'all' || member.staff_type === filterType
    
    return matchesSearch && matchesFilter
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-600 mt-1">Manage teachers, servants, and trustees</p>
        </div>
        
        <Link
          to="/staff/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors"
        >
          <UserPlus className="h-5 w-5" />
          <span>Add Staff Member</span>
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Filters and Search */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search staff by name, position, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filter by type */}
          <div className="sm:w-48">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Staff</option>
              <option value="teacher">Teachers</option>
              <option value="servant">Servants</option>
              <option value="trustee">Trustees</option>
            </select>
          </div>
        </div>
      </div>

      {/* Staff Grid */}
      {filteredStaff.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No staff members found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || filterType !== 'all' ? 'Try adjusting your search or filter' : 'Get started by adding your first staff member'}
          </p>
          {!searchTerm && filterType === 'all' && (
            <Link
              to="/staff/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add First Staff Member
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStaff.map((member) => (
            <div key={member.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getStaffIcon(member.staff_type)}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {member.name}
                      </h3>
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStaffTypeColor(member.staff_type)}`}>
                        {member.staff_type.charAt(0).toUpperCase() + member.staff_type.slice(1)}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4 space-y-2">
                  {member.position && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Position:</span> {member.position}
                    </p>
                  )}
                  {member.department && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Department:</span> {member.department}
                    </p>
                  )}
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Phone:</span> {member.phone}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Experience:</span> {member.experience_years} years
                  </p>
                  {member.salary && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Salary:</span> ₹{member.salary.toLocaleString()}
                    </p>
                  )}
                </div>

                <div className="flex space-x-2">
                  <Link
                    to={`/staff/${member.id}`}
                    className="flex-1 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 flex items-center justify-center space-x-1"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View</span>
                  </Link>
                  
                  <Link
                    to={`/staff/${member.id}/edit`}
                    className="flex-1 bg-green-50 text-green-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-100 flex items-center justify-center space-x-1"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                  </Link>
                  
                  <button
                    onClick={() => deleteStaff(member.id)}
                    className="flex-1 bg-red-50 text-red-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-100 flex items-center justify-center space-x-1"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

